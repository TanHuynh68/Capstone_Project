import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LibraryItem } from "./ItemLibrary";
import SidebarSearchBar from "./SidebarSearchBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ENV from "@/config/env";

interface PixabayPhoto {
    id: number;
    type: "photo" | "illustration" | "vector";
    webformatURL: string;
    largeImageURL: string;
    fullHDURL?: string;
    imageURL?: string;   // full API access
    vectorURL?: string;  // full API access
    tags: string;        // comma separated
    user: string;
    views: number;
    downloads: number;
    likes: number;
}

interface PixabayLibraryProps {
    onSelect: (imageUrl: string) => void;
    isOpen: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, imageUrl: string) => void;
}

type ImageType = "all" | "photo" | "illustration" | "vector";

const API_KEY = ENV.PIXABAY_API_KEY;

const PER_PAGE = 100; // Tối ưu cho rate limit: 100 requests/60s, cache 24h
// Rate limiting & caching configuration
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours cache TTL (minimum per Pixabay policy)
const RATE_LIMIT_MAX_PER_MINUTE = 80; // Giữ margin an toàn dưới giới hạn 100/min của Pixabay
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_KEY = "pixabay:reqTimes"; // stores recent request timestamps (ms)
const COOLDOWN_UNTIL_KEY = "pixabay:cooldownUntil"; // stores epoch ms until we should pause requests

const PERSON_WORDS = new Set([
    "người", "con người", "nam", "nữ", "đàn ông", "đàn bà", "phụ nữ", "bé trai", "bé gái", "trẻ em", "em bé",
    "chân dung", "khuôn mặt", "tự chụp", "hình đại diện", "người mẫu", "người già", "người cao tuổi"
]);

const PRESETS: { key: string; label: string; q: string }[] = [
    { key: "props", label: "Phụ kiện", q: "đồ chơi phụ kiện" },
    { key: "hat", label: "Nón", q: "nón mũ" },
    { key: "eyes", label: "Mắt", q: "mắt" },
    { key: "glasses", label: "Kính", q: "mắt kính" },
    { key: "outfit", label: "Trang phục", q: "quần áo trang phục" },
    { key: "scarf", label: "Khăn", q: "khăn quàng" },
    { key: "shoes", label: "Giày", q: "giày dép" },
    { key: "bag", label: "Túi", q: "túi xách" },
    { key: "jewelry", label: "Trang sức", q: "vòng tay nhẫn" },
];





const PixabayLibrary: React.FC<PixabayLibraryProps> = ({
    onSelect, isOpen, onDragStart,
}) => {
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [cooldownMsLeft, setCooldownMsLeft] = useState<number | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Separate loading state for pagination

    // filters
    const [imageType, setImageType] = useState<ImageType>("all");
    const [onlyTransparent, setOnlyTransparent] = useState(true);
    const [lang] = useState("vi");
    const [activePreset, setActivePreset] = useState<string | null>("props");

    // infinite scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement | null>(null);

    // cancel fetch when thay đổi nhanh
    const abortRef = useRef<AbortController | null>(null);
    const cooldownTimerRef = useRef<number | null>(null);
    const requestTimesRef = useRef<number[]>([]);

    // debounce search & reset trang
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
            setPage(1);
            setItems([]);
            setHasMore(true);
            setIsLoadingMore(false);
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery, imageType, onlyTransparent, activePreset]);

    // query thực tế
    const effectiveQuery = useMemo(() => {
        if (debouncedQuery) return debouncedQuery;
        const preset = PRESETS.find(p => p.key === activePreset);
        return preset ? preset.q : "phụ kiện";
    }, [debouncedQuery, activePreset]);

    // cache key
    const qParam = useMemo(() => effectiveQuery.trim() || undefined, [effectiveQuery]);
    const cacheKey = useMemo(() => {
        const color = onlyTransparent ? "transparent" : "any";
        // dùng qParam (đã encode + cắt 100 char) để cache đúng theo request thực tế
        return `pixabay:${qParam ?? "ALL"}:${imageType}:${color}:page${page}`;
    }, [qParam, imageType, onlyTransparent, page]);

    // Helpers: cache with TTL
    const readCache = useCallback((key: string): LibraryItem[] | null => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // backward compat: older cache stored array directly
            if (Array.isArray(parsed)) {
                // wrap and re-store with timestamp so it honors TTL
                localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: parsed }));
                return parsed as LibraryItem[];
            }
            const ts: number | undefined = parsed?.ts;
            const data: LibraryItem[] | undefined = parsed?.data;
            if (!ts || !Array.isArray(data)) return null;
            if (Date.now() - ts > TTL_MS) return null; // expired
            return data;
        } catch {
            return null;
        }
    }, []);

    const writeCache = useCallback((key: string, data: LibraryItem[]) => {
        try {
            localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
        } catch {
            // ignore quota errors
        }
    }, []);

    // Helpers: simple client-side rate limiter using sliding window timestamps in localStorage
    const loadRequestTimes = useCallback(() => {
        try {
            const raw = localStorage.getItem(RATE_KEY);
            const arr: number[] = raw ? JSON.parse(raw) : [];
            requestTimesRef.current = Array.isArray(arr) ? arr : [];
        } catch {
            requestTimesRef.current = [];
        }
    }, []);

    const saveRequestTimes = useCallback(() => {
        try {
            localStorage.setItem(RATE_KEY, JSON.stringify(requestTimesRef.current));
        } catch {
            // ignore
        }
    }, []);

    const getThrottleDelayMs = useCallback(() => {
        const now = Date.now();
        const windowStart = now - RATE_LIMIT_WINDOW_MS;
        // prune
        requestTimesRef.current = requestTimesRef.current.filter(t => t >= windowStart);
        const inWindow = requestTimesRef.current.length;
        if (inWindow < RATE_LIMIT_MAX_PER_MINUTE) return 0;
        const oldest = Math.min(...requestTimesRef.current);
        const wait = RATE_LIMIT_WINDOW_MS - (now - oldest) + 250; // small buffer
        return Math.max(wait, 0);
    }, []);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // initialize request times from localStorage
    useEffect(() => { loadRequestTimes(); }, [loadRequestTimes]);

    const fetchPixabayImages = useCallback(async (isLoadMore = false) => {
        if (!isOpen || (isLoading && !isLoadMore) || (isLoadingMore && isLoadMore)) return;

        // Chỉ check hasMore khi load more, không check khi load initial
        if (isLoadMore && !hasMore) return;

        // lấy cache (with TTL)
        const cachedData = readCache(cacheKey);
        if (cachedData) {
            console.log("📦 Cache hit:", { cacheKey, cachedDataLength: cachedData.length });
            const pageItems: LibraryItem[] = cachedData;
            if (isLoadMore) {
                setItems(prev => {
                    const merged = [...prev, ...pageItems];
                    return Array.from(new Map(merged.map(i => [i.id, i])).values());
                });
            } else {
                setItems(pageItems);
            }
            setHasMore(pageItems.length === PER_PAGE); // Với PER_PAGE = 100, sẽ load 100 ảnh/lần
            return;
        } else {
            console.log("❌ Cache miss:", { cacheKey });
        }

        // hủy request cũ nếu còn
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            // respect global cooldown if set (e.g. after receiving 429)
            const cooldownUntilStr = localStorage.getItem(COOLDOWN_UNTIL_KEY);
            const now = Date.now();
            let cooldownDelay = 0;
            if (cooldownUntilStr) {
                const until = parseInt(cooldownUntilStr, 10);
                if (!Number.isNaN(until) && until > now) {
                    cooldownDelay = until - now;
                }
            }

            // client-side throttle to keep well below 100/min
            const throttleDelay = getThrottleDelayMs();
            const totalDelay = Math.max(cooldownDelay, throttleDelay);
            if (totalDelay > 0) {
                setCooldownMsLeft(totalDelay);
                await delay(totalDelay);
                setCooldownMsLeft(null);
            }

            const params = new URLSearchParams({
                key: API_KEY,
                lang,
                image_type: imageType,
                orientation: "all",
                safesearch: "false",
                order: "popular",
                per_page: String(PER_PAGE),
                page: String(page),
            });

            if (onlyTransparent) params.set("colors", "transparent");
            if (qParam) params.set("q", qParam); // omit q nếu undefined => trả all images

            const url = `https://pixabay.com/api/?${params.toString()}`;
            console.log("🌐 Pixabay API Request:", {
                url,
                qParam,
                imageType,
                onlyTransparent,
                page,
                lang,
                isLoadMore
            });
            const res = await fetch(url, { signal: controller.signal });
            // Handle rate limiting explicitly
            if (res.status === 429) {
                const resetHeader = res.headers.get("X-RateLimit-Reset");
                // default to 60s if header missing
                const resetSec = resetHeader ? parseInt(resetHeader, 10) : 60;
                const waitMs = (Number.isFinite(resetSec) ? resetSec : 60) * 1000;
                const until = Date.now() + waitMs;
                try { localStorage.setItem(COOLDOWN_UNTIL_KEY, String(until)); } catch { /* ignore quota errors */ }
                setCooldownMsLeft(waitMs);
                console.warn(`Pixabay rate limited. Cooling down for ${waitMs}ms`);
                // schedule a retry attempt after cooldown with jitter
                if (cooldownTimerRef.current) window.clearTimeout(cooldownTimerRef.current);
                cooldownTimerRef.current = window.setTimeout(() => {
                    setCooldownMsLeft(null);
                    // trigger re-fetch by bumping page to same value
                    setPage(p => p);
                }, waitMs + Math.floor(Math.random() * 400));
                return;
            }
            if (!res.ok) throw new Error(`Pixabay ${res.status}`);
            const data = await res.json();
            console.log("✅ Pixabay API Response:", {
                status: res.status,
                total: data?.total,
                totalHits: data?.totalHits,
                hitsCount: data?.hits?.length || 0,
                firstHit: data?.hits?.[0]?.tags || "No hits",
                page,
                isLoadMore
            });

            setTotal(data?.total ?? 0); // Tổng số ảnh có sẵn

            // lọc bỏ ảnh người qua tags
            const hits: PixabayPhoto[] = (data.hits || []).filter((h: PixabayPhoto) => {
                const tagStr = (h.tags || "").toLowerCase();
                return ![...PERSON_WORDS].some(w => tagStr.includes(w));
            });

            const pageItems: LibraryItem[] = hits.map((h, i) => {
                const isVector = h.type === "vector" || !!h.vectorURL;
                const bestUrl =
                    (isVector && (h.vectorURL || h.imageURL)) || // nếu có full access
                    h.largeImageURL || h.webformatURL;

                return {
                    id: `pixabay-${h.id}-${page}-${i}`,
                    name: h.tags || "Pixabay Asset",
                    imageUrl: bestUrl,
                    category: "Pixabay",
                    tags: h.tags ? h.tags.split(",").map(s => s.trim()) : [],
                    source: "pixabay"
                };
            });

            // cache theo trang (with TTL)
            writeCache(cacheKey, pageItems);

            if (isLoadMore) {
                setItems(prev => {
                    const merged = [...prev, ...pageItems];
                    return Array.from(new Map(merged.map(i => [i.id, i])).values());
                });
            } else {
                setItems(pageItems);
            }

            // tính hasMore theo tổng số ảnh có sẵn
            const maxPages = Math.max(1, Math.ceil((data.total || 0) / PER_PAGE));
            console.log("📊 Pagination info:", {
                page,
                total: data.total,
                PER_PAGE,
                maxPages,
                hitsAfterFilter: pageItems.length,
                originalHits: data.hits?.length || 0,
                hasMore: page < maxPages
            });
            setHasMore(page < maxPages);

            // record successful request for rate limiter
            requestTimesRef.current.push(Date.now());
            saveRequestTimes();
        } catch (e: unknown) {
            if (e instanceof Error && e.name === "AbortError") {
                console.log("🚫 Request cancelled (user typing fast)");
                return; // bị hủy khi user gõ nhanh
            }
            console.error("❌ Error fetching Pixabay images:", e);
            setHasMore(false);
        } finally {
            if (isLoadMore) {
                setIsLoadingMore(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [isOpen, isLoading, isLoadingMore, hasMore, cacheKey, qParam, imageType, onlyTransparent, page, lang, getThrottleDelayMs, readCache, writeCache, saveRequestTimes]);

    // observe for infinite scroll
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && !isLoadingMore && hasMore) {
            console.log("🔄 Loading more images, current page:", page);
            setPage(p => p + 1);
        } else if (entry.isIntersecting) {
            console.log("🚫 Cannot load more:", {
                isIntersecting: entry.isIntersecting,
                isLoading,
                isLoadingMore,
                hasMore,
                page
            });
        }
    }, [isLoading, isLoadingMore, hasMore, page]);

    useEffect(() => {
        if (!loadingRef.current) return;
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: '100px' // Start loading 100px before reaching the bottom
        });
        observer.current.observe(loadingRef.current);
        return () => observer.current?.disconnect();
    }, [handleObserver]);

    // Fetch initial data
    useEffect(() => {
        if (page === 1) {
            fetchPixabayImages(false);
        }
    }, [debouncedQuery, imageType, onlyTransparent, activePreset]);

    // Fetch more data when page changes
    useEffect(() => {
        if (page > 1) {
            fetchPixabayImages(true);
        }
    }, [page]);

    useEffect(() => {
        return () => {
            abortRef.current?.abort(); // cleanup khi unmount
            if (cooldownTimerRef.current) window.clearTimeout(cooldownTimerRef.current);
        };
    }, []);

    if (!isOpen) return null;

    const status = isLoading
        ? "Đang tải..."
        : cooldownMsLeft != null
            ? `Tạm dừng do giới hạn tốc độ (${Math.ceil(cooldownMsLeft / 1000)}s)`
            : total > 0
                ? `~${total} ảnh${page > 1 ? ` (Trang ${page})` : ""}`
                : debouncedQuery || activePreset
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Sẵn sàng tìm kiếm";

    return (
        <>
            {/* Ô search */}
            <SidebarSearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => { setPage(1); setItems([]); setHasMore(true); }}
                onKeyDown={(e) => e.key === "Enter" && (setPage(1), setItems([]), setHasMore(true))}
                placeholder="Tìm phụ kiện (ví dụ: 'nón', 'mắt', 'kính')..."
                loading={isLoading}
            />

            {/* Preset + Filters */}
            <div className="px-0 pt-0 pb-2 space-y-2 text-sm">
                {/* Preset */}

                <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-4 preset-scroll-container">
                        {PRESETS.map(p => (
                            <Button
                                key={p.key}
                                variant={activePreset === p.key ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setActivePreset(p.key);
                                    setSearchQuery("");
                                    setPage(1);
                                    setItems([]);
                                    setHasMore(true);
                                }}
                                className="whitespace-nowrap"
                                title={p.q}
                            >
                                {p.label}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>


                <div className="flex flex-wrap items-center gap-2 justify-center">
                    {/* Image type filter as tags */}
                    <div className="flex gap-2 justify-center items-center">
                        {(["all", "photo", "illustration", "vector"] as ImageType[]).map(t => (
                            <div
                                key={t}
                                onClick={() => { setImageType(t); setPage(1); setItems([]); setHasMore(true); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap ${imageType === t
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                    }`}
                            >
                                {t === "all" ? "Tất cả" : t === "photo" ? "Ảnh chụp" : t === "illustration" ? "Đồ họa" : "Vector"}
                            </div>
                        ))}
                    </div>

                    {/* Transparent only */}
                    <label className="inline-flex items-center gap-2 cursor-pointer text-foreground">
                        <Checkbox
                            id="transparent-only"
                            checked={onlyTransparent}
                            onCheckedChange={(checked) => {
                                setOnlyTransparent(checked as boolean);
                                setPage(1);
                                setItems([]);
                                setHasMore(true);
                            }}
                        />
                        <span>Tách nền</span>
                        <span className="ml-auto text-muted-foreground">{status}</span>
                    </label>

                </div>
            </div>

            {/* Grid */}
            <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-2">
                    <div className="grid grid-cols-3 gap-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="cursor-move group"
                                onClick={() => onSelect(item.imageUrl)}
                                draggable
                                onDragStart={(e) => onDragStart(e, item.imageUrl)}
                            >
                                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors" />
                                </div>
                                {/* <p className="text-sm text-center text-muted-foreground truncate">
                                    {item.name}
                                </p> */}
                            </div>
                        ))}
                    </div>

                    {/* Infinite scroll loading indicator */}
                    <div ref={loadingRef} className="flex justify-center items-center h-24">
                        {isLoadingMore && (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                <p className="ml-3 text-muted-foreground">Đang tải thêm...</p>
                            </>
                        )}
                        {!isLoadingMore && !hasMore && items.length > 0 && (
                            <p className="text-muted-foreground">Đã hết kết quả.</p>
                        )}
                        {!isLoading && !isLoadingMore && items.length === 0 && (
                            <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp.</p>
                        )}
                    </div>
                    <div className="pb-2 text-center text-xs text-muted-foreground">
                        Kết quả từ Pixabay • {items.length} ảnh đã tải
                    </div>
                </div>
            </ScrollArea>
        </>
    );
};

export default PixabayLibrary;
