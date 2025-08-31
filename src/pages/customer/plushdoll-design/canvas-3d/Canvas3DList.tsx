import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FolderOpen, Box, Eye, ChevronRight, ChevronLeft, Loader2, FolderX, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CanvasService from '@/services/CanvasService';
import SidebarSearchBar from '../SidebarSearchBar';

interface Canvas3DInfo {
    canvasInfoId?: string;
    canvasTitle?: string;
    canvasDescription?: string;
    canvas3D?: string;
    versionNumber?: number;
    createdAt?: string;
}

interface Canvas3DFolder {
    canvasFolderId: string;
    folderName: string;
    createdAt: string;
    latestCanvasInfo: Canvas3DInfo | null;
}

interface Canvas3DListProps {
    onSelect: (canvas3D: string, title: string, id: string) => void;
}

export default function Canvas3DList({ onSelect }: Canvas3DListProps) {
    // ✅ Đảm bảo tất cả hooks được gọi trước khi có bất kỳ conditional return nào
    const [canvas3DList, setCanvas3DList] = useState<Canvas3DFolder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [folderName, setFolderName] = useState("");
    const [page, setPage] = useState(1);
    const [searchTitle, setSearchTitle] = useState("");
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const size = 10;

    const { getFolderCanvas } = CanvasService();

    const loadList = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getFolderCanvas({
                FolderName: searchTitle,
                page,
                size,
            });

            const items = data?.responseRequestModel?.responseList?.items || [];

            // Lọc chỉ những canvas có canvas3D
            const canvas3DItems = items.filter((item: Canvas3DFolder) =>
                item.latestCanvasInfo?.canvas3D
            );

            setCanvas3DList(canvas3DItems);
        } catch (error) {
            setError('Không thể tải danh sách canvas 3D');
            console.error('Lỗi tải thiết kế 3D:', error);
        } finally {
            setLoading(false);
        }
    }, [page, getFolderCanvas, searchTitle]);

    // Add a refresh function that can be called externally
    const refreshList = useCallback(() => {
        console.log('🔄 Refreshing Canvas3D list...');
        setPage(1); // Reset to first page
        setError(null);
        setLastRefreshed(new Date());
        loadList().then(() => {
            console.log('✅ Canvas3D list refreshed successfully at', new Date().toLocaleTimeString());
        });
    }, [loadList]);

    const handleSearch = useCallback(() => {
        setSearchTitle(folderName);
        setPage(1);
    }, [folderName]);

    const handleSelectCanvas = useCallback((canvas: Canvas3DInfo) => {
        try {
            if (!canvas.canvas3D || !canvas.canvasTitle || !canvas.canvasInfoId) {
                setError('Thông tin canvas không đầy đủ');
                return;
            }
            // Kiểm tra canvas3D có hợp lệ không
            JSON.parse(canvas.canvas3D);
            onSelect(canvas.canvas3D, canvas.canvasTitle, canvas.canvasInfoId);
        } catch (error) {
            console.error('Error parsing canvas3D:', error);
            setError('Dữ liệu canvas3D không hợp lệ');
        }
    }, [onSelect]);

    const parseCanvas3D = useCallback((canvas3DString: string) => {
        try {
            return JSON.parse(canvas3DString);
        } catch {
            return null;
        }
    }, []);

    const formatDate = useCallback((dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch {
            return 'N/A';
        }
    }, []);

    // ✅ Đảm bảo useEffect được gọi sau tất cả hooks
    useEffect(() => {
        loadList();
        // Set initial refresh time
        if (!lastRefreshed) {
            setLastRefreshed(new Date());
        }
    }, [searchTitle, page, loadList, lastRefreshed]);

    // ✅ Render UI sau khi tất cả hooks đã được gọi
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-muted-foreground">Đang tải danh sách canvas 3D...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Thử lại
                    </Button>
                </div>
            );
        }

        if (canvas3DList.length === 0) {
            return (
                <div className="text-center p-8">
                    <FolderX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Chưa có canvas 3D nào</h3>
                    <p className="text-muted-foreground mb-4">
                        Tạo thiết kế 3D đầu tiên để bắt đầu sử dụng
                    </p>
                    <Button onClick={refreshList} variant="outline" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang tải...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Làm mới
                            </>
                        )}
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {canvas3DList.map((folder) => {
                    const canvas = folder.latestCanvasInfo;
                    if (!canvas?.canvas3D) return null;

                    const canvas3DData = parseCanvas3D(canvas.canvas3D);

                    return (
                        <Card key={folder.canvasFolderId} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                            {folder.folderName}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {canvas.canvasTitle}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="ml-2">
                                        v{canvas.versionNumber}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                {canvas3DData && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Box className="h-4 w-4" />
                                            <span className="font-medium">Model:</span>
                                            <span>{canvas3DData.modelName}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Lưu lúc:</span>
                                            <span>{formatDate(canvas3DData.savedAt)}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Tạo lúc:</span>
                                            <span>{formatDate(canvas.createdAt || '')}</span>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => handleSelectCanvas(canvas)}
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Mở thiết kế
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    // ✅ Main return statement - luôn được gọi sau tất cả hooks
    return (
        <div className="space-y-4 p-2">
            <div className="relative flex-1">
                <SidebarSearchBar
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onSearch={handleSearch}
                    placeholder="Tìm thiết kế 3D..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                    loading={loading}
                />
            </div>

            <Button onClick={refreshList} className='w-full' variant="outline" size="sm" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tải...
                    </>
                ) : (
                    <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Làm mới
                    </>
                )}
            </Button>

            {renderContent()}

            <div className="flex justify-between items-center pt-4">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1 || loading}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Trang {page}</span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={canvas3DList.length < size || loading}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
