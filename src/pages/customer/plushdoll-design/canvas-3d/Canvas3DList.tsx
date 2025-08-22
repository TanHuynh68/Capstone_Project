import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FolderOpen, Box, Eye, Download, ChevronRight, ChevronLeft, Loader2, FolderX } from 'lucide-react';
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
    onRefresh?: () => void;
}

export default function Canvas3DList({ onSelect, onRefresh }: Canvas3DListProps) {
    const [canvas3DList, setCanvas3DList] = useState<Canvas3DFolder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [folderName, setFolderName] = useState("");
    const [page, setPage] = useState(1);
    const [searchTitle, setSearchTitle] = useState("");
    const size = 10;

    const { getFolderCanvas } = CanvasService();

    const loadList = useCallback(async () => {
        try {
            setLoading(true);
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
            setError(null);
        } catch (error) {
            setError('Không thể tải danh sách canvas 3D');
            console.error('Lỗi tải thiết kế 3D:', error);
        } finally {
            setLoading(false);
        }
    }, [page, getFolderCanvas, searchTitle]);

    const handleSearch = () => {
        setSearchTitle(folderName);
        setPage(1);
    };

    useEffect(() => {
        loadList();
    }, [searchTitle, page, loadList]);

    const handleSelectCanvas = (canvas: Canvas3DInfo) => {
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
    };

    const parseCanvas3D = (canvas3DString: string) => {
        try {
            return JSON.parse(canvas3DString);
        } catch {
            return null;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải danh sách canvas 3D...</p>
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
                <FolderX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có canvas 3D nào</h3>
                <p className="text-gray-600 mb-4">
                    Tạo thiết kế 3D đầu tiên để bắt đầu sử dụng
                </p>
                <Button onClick={onRefresh} variant="outline">
                    Làm mới
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-2">
            <div className="flex items-center gap-2">
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
            </div>
            
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    Danh sách Canvas 3D ({canvas3DList.length})
                </h2>
                <Button onClick={onRefresh} variant="outline" size="sm">
                    Làm mới
                </Button>
            </div>

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
                                            <FolderOpen className="h-4 w-4 text-blue-600" />
                                            {folder.folderName}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
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
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Box className="h-4 w-4" />
                                            <span className="font-medium">Model:</span>
                                            <span>{canvas3DData.modelName}</span>
                                            {canvas3DData.isDefaultModel && (
                                                <Badge variant="outline" className="text-xs">
                                                    Mặc định
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Lưu lúc:</span>
                                            <span>{formatDate(canvas3DData.savedAt)}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Tạo lúc:</span>
                                            <span>{formatDate(canvas.createdAt || '')}</span>
                                        </div>

                                        {/* Scene Information */}
                                        {canvas3DData.sceneInfo && (
                                            <div className="space-y-1 pt-2 border-t border-gray-100">
                                                <div className="text-xs text-gray-500 font-medium">Thông tin scene:</div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <span>🎨</span>
                                                        <span>Textures: {canvas3DData.sceneInfo.texturesCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>🔧</span>
                                                        <span>Accessories: {canvas3DData.sceneInfo.accessoriesCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>📝</span>
                                                        <span>Texts: {canvas3DData.sceneInfo.textsCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>🖼️</span>
                                                        <span>Texture hiện tại: {canvas3DData.sceneInfo.hasCurrentTexture ? 'Có' : 'Không'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button 
                                                onClick={() => handleSelectCanvas(canvas)}
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Mở thiết kế
                                            </Button>
                                            
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                    if (canvas3DData?.sceneUrl) {
                                                        window.open(canvas3DData.sceneUrl, '_blank');
                                                    }
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            
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
