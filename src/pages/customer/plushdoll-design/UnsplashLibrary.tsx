import React, { useState, useEffect, useRef, useCallback } from "react";
import { LibraryItem } from "./ItemLibrary";
import ENV from "@/config/env";

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string | null;
  tags: Array<{
    title: string;
  }>;
}

interface UnsplashLibraryProps {
  onSelect: (imageUrl: string) => void;
  isOpen: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, imageUrl: string) => void;
}

const UnsplashLibrary: React.FC<UnsplashLibraryProps> = ({
  onSelect,
  isOpen,
  onDragStart,
}) => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(
    null
  );
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);
  const [exhaustedKeys, setExhaustedKeys] = useState<{ [key: number]: number }>(
    {}
  );
  const [isAllKeysExhausted, setIsAllKeysExhausted] = useState(false);

  // Array of API keys to use
  const apiKeys = [
    ENV.UNSPLASH_ACCESS_KEY,
    ENV.UNSPLASH_ACCESS_KEY_2,
    ENV.UNSPLASH_ACCESS_KEY_3,
  ];

  const getCurrentApiKey = () => {
    return apiKeys[currentApiKeyIndex];
  };

  const findNextAvailableKey = (currentIndex: number): number | null => {
    // Try each key in order
    for (let i = 0; i < apiKeys.length; i++) {
      const nextIndex = (currentIndex + i + 1) % apiKeys.length;
      // If this key is not exhausted, use it
      if (!exhaustedKeys[nextIndex]) {
        return nextIndex;
      }
    }
    return null; // No available keys
  };

  const switchToNextApiKey = () => {
    console.log(`Current API key before switch: ${currentApiKeyIndex + 1}`);

    // Mark current key as exhausted with timestamp
    if (!exhaustedKeys[currentApiKeyIndex]) {
      const newExhaustedKeys = {
        ...exhaustedKeys,
        [currentApiKeyIndex]: Date.now(),
      };
      setExhaustedKeys(newExhaustedKeys);

      // Check if all keys are exhausted
      if (Object.keys(newExhaustedKeys).length === apiKeys.length) {
        console.log("All API keys have been exhausted");
        setIsAllKeysExhausted(true);
        setRateLimitError(true);
        return;
      }
    }

    // Find next available key
    const nextIndex = findNextAvailableKey(currentApiKeyIndex);
    if (nextIndex !== null) {
      console.log(
        `Switching from API key ${currentApiKeyIndex + 1} to API key ${
          nextIndex + 1
        }`
      );
      setCurrentApiKeyIndex(nextIndex);
      setRateLimitError(false);
    } else {
      console.log("No available API keys found");
      setIsAllKeysExhausted(true);
      setRateLimitError(true);
    }
  };

  // Reset exhausted keys after 1 hour
  useEffect(() => {
    const checkAndResetExhaustedKeys = () => {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      const newExhaustedKeys = { ...exhaustedKeys };
      let hasChanges = false;

      // Check each exhausted key
      Object.entries(exhaustedKeys).forEach(([key, timestamp]) => {
        if (now - timestamp > oneHour) {
          delete newExhaustedKeys[Number(key)];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        console.log("Resetting expired exhausted keys");
        setExhaustedKeys(newExhaustedKeys);
        setIsAllKeysExhausted(
          Object.keys(newExhaustedKeys).length === apiKeys.length
        );
      }
    };

    // Check every minute
    const interval = setInterval(checkAndResetExhaustedKeys, 60000);
    return () => clearInterval(interval);
  }, [exhaustedKeys]);

  // Reset states when component mounts or when search query changes
  useEffect(() => {
    setExhaustedKeys({});
    setIsAllKeysExhausted(false);
    setRateLimitError(false);
  }, [searchQuery]);

  // Use the IntersectionObserver to trigger loading more items when the user scrolls
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && hasMore && !rateLimitError) {
        if (page <= 5) {
          // Limiting page number for the demo purpose
          setPage((prev) => prev + 1);
        }
      }
    },
    [isLoading, hasMore, rateLimitError, page]
  );

  useEffect(() => {
    if (loadingRef.current) {
      observer.current = new IntersectionObserver(handleObserver, {
        threshold: 0.1, // 10% of the loading div must be visible
      });
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handleObserver]);

  const fetchUnsplashImages = async () => {
    // Don't fetch if all keys are exhausted
    if (isAllKeysExhausted) {
      return;
    }

    // Check if data is cached
    const cacheKey = `unsplash-${searchQuery}-${page}-${currentApiKeyIndex}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setItems(JSON.parse(cachedData));
      return;
    }

    try {
      setIsLoading(true);
      const query = searchQuery || "plush";
      console.log(`Fetching with API key ${currentApiKeyIndex + 1}`);

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=30&orientation=portrait&page=${page}`,
        {
          headers: {
            Authorization: `Client-ID ${getCurrentApiKey()}`,
          },
        }
      );

      // Check remaining requests and reset time
      const remaining = response.headers.get("X-RateLimit-Remaining");
      const reset = response.headers.get("X-RateLimit-Reset");
      console.log(
        `API key ${currentApiKeyIndex + 1} - Remaining requests: ${remaining}`
      );

      if (remaining === "0") {
        console.log(
          `API key ${
            currentApiKeyIndex + 1
          } rate limit reached, attempting to switch...`
        );
        switchToNextApiKey();
        // Only retry if not all keys are exhausted
        if (!isAllKeysExhausted) {
          return fetchUnsplashImages();
        }
        return;
      }

      if (reset) {
        const resetDate = new Date(parseInt(reset) * 1000);
        console.log(
          `API key ${
            currentApiKeyIndex + 1
          } - Rate limit resets at: ${resetDate}`
        );
        setResetTime(resetDate);
      }

      setRemainingRequests(Number(remaining));
      setRateLimitError(false);

      const data = await response.json();
      const unsplashItems: LibraryItem[] = data.results.map(
        (photo: UnsplashPhoto, index: number) => ({
          id: `unsplash-${photo.id}`,
          name: photo.alt_description || `Unsplash Image ${index + 1}`,
          imageUrl: photo.urls.regular,
          category: "Unsplash",
          tags: photo.tags?.map((tag) => tag.title) || [],
          source: "unsplash",
        })
      );

      // Cache the data in localStorage
      localStorage.setItem(cacheKey, JSON.stringify(unsplashItems));

      setItems((prevItems) => {
        const newItems = [...prevItems, ...unsplashItems];
        return Array.from(
          new Map(newItems.map((item) => [item.id, item])).values()
        );
      });

      setHasMore(data.total_pages > page);
    } catch (error) {
      console.error(`Error with API key ${currentApiKeyIndex + 1}:`, error);
      if (
        error instanceof Error &&
        (error.message.includes("403") || error.message.includes("401"))
      ) {
        console.log(
          `API key ${currentApiKeyIndex + 1} error, switching to next key...`
        );
        switchToNextApiKey();
        // Only retry if not all keys are exhausted
        if (!isAllKeysExhausted) {
          return fetchUnsplashImages();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch new items when the page changes or when search is triggered
  useEffect(() => {
    if (isOpen && !rateLimitError) {
      fetchUnsplashImages();
    }
  }, [isOpen, page, rateLimitError]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reset page and items when search is triggered
  const handleSearch = () => {
    setPage(1);
    setItems([]);
    fetchUnsplashImages();
  };

  // Handle "Enter" key press for searching
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Set crossOrigin after the image is loaded
    const img = e.target as HTMLImageElement;
    if (!img.crossOrigin) {
      img.crossOrigin = "anonymous";
    }
  };

  // Update the rate limit message
  const getRateLimitMessage = () => {
    if (isAllKeysExhausted) {
      const resetTime =
        Math.max(...Object.values(exhaustedKeys)) + 60 * 60 * 1000; // 1 hour from the last exhausted key
      return (
        <p className="ml-4 text-red-600">
          Bạn đã đạt đến giới hạn của tất cả API key. Vui lòng thử lại sau{" "}
          {new Date(resetTime).toLocaleTimeString()}
        </p>
      );
    } else if (rateLimitError) {
      const nextIndex = findNextAvailableKey(currentApiKeyIndex);
      if (nextIndex !== null) {
        return (
          <p className="ml-4 text-red-600">
            Đã đạt giới hạn yêu cầu. Đang chuyển sang API key {nextIndex + 1}...
          </p>
        );
      }
    } else if (remainingRequests !== null) {
      const exhaustedCount = Object.keys(exhaustedKeys).length;
      const exhaustedKeysText =
        exhaustedCount > 0 ? ` (Đã hết ${exhaustedCount} key)` : "";

      return (
        <p className="ml-4 text-gray-600">
          {remainingRequests} yêu cầu còn lại
          {resetTime && ` (Reset at ${resetTime.toLocaleString()})`}
          {remainingRequests === 0 &&
            !isAllKeysExhausted &&
            ` (Tiếp theo: API key ${
              findNextAvailableKey(currentApiKeyIndex)! + 1
            })`}
          {exhaustedKeysText}
        </p>
      );
    } else {
      return <p className="ml-4 text-gray-600">Đang tải...</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-[300px] h-full border-l bg-white flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-4">Thành phần</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tìm
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="cursor-move group"
              onClick={() => onSelect(item.imageUrl)}
              draggable
              onDragStart={(e) => onDragStart(e, item.imageUrl)}
            >
              <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  crossOrigin="anonymous"
                  onLoad={handleImageLoad}
                  className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p className="text-sm text-center text-gray-600 truncate">
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <div ref={loadingRef} className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          {getRateLimitMessage()}
        </div>
      </div>
    </div>
  );
};

export default UnsplashLibrary;
