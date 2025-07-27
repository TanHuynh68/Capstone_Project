import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  FolderOpen,
  FolderX,
  Loader2,
} from "lucide-react";
import SidebarSearchBar from "../SidebarSearchBar";
import CanvasService from "@/services/CanvasService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFullDateWithDistance3 } from "@/utils/date";
import { useNavigate } from "react-router-dom";

interface CanvasFolder {
  canvasFolderId: string;
  folderName: string;
  createdAt: string;
  latestCanvasInfo: {
    canvasInfoId?: string;
    canvasTitle?: string;
    canvasDescription?: string;
    previewUrl?: string;
  } | null;
  previewUrl?: string;
  previewWidth?: number;
  previewHeight?: number;
}

interface CanvasListProps {
  onSelect: (
    canvasDescription: string,
    folderName: string,
    canvasId: string,
    folderId?: string,
    hasExistingCanvas?: boolean
  ) => void;
  initialCanvasState?: {
    canvasId: string;
    folderName: string;
    canvasDescription: string;
  };
  selectedCanvasId?: string;
}

const CanvasListInPage: React.FC<CanvasListProps> = ({
  onSelect,
  selectedCanvasId,
  initialCanvasState,
}) => {
  const [canvasList, setCanvasList] = useState<CanvasFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<CanvasFolder | null>(null);
  const [editFolderName, setEditFolderName] = useState("");

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState<CanvasFolder | null>(
    null
  );
  const [isEditDialogJustOpened, setIsEditDialogJustOpened] = useState(false);
  const size = 8;
  const { getFolderCanvas, putFolderCanvas, deleteFolderCanvas } =
    CanvasService();
  const navigate = useNavigate();

  // Function to generate canvas preview
  const generateCanvasPreview = async (
    item: CanvasFolder
  ): Promise<{ url: string; width: number; height: number }> => {
    try {
      // If we have latestCanvasInfo with previewUrl, use it
      if (item.latestCanvasInfo?.previewUrl) {
        return { url: item.latestCanvasInfo.previewUrl, width: 0, height: 0 };
      }

      // If we have canvas description, generate preview from it
      if (item.latestCanvasInfo?.canvasDescription) {
        let originalWidth = 960;
        let originalHeight = 540;
        try {
          const parsedDesc = JSON.parse(
            item.latestCanvasInfo.canvasDescription
          );
          if (parsedDesc.width && parsedDesc.height) {
            originalWidth = parsedDesc.width;
            originalHeight = parsedDesc.height;
          }

          // Tạo canvas gốc
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = originalWidth;
          tempCanvas.height = originalHeight;
          const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
            backgroundColor: "#fff",
          });

          await new Promise((resolve) => {
            fabricCanvas.loadFromJSON(parsedDesc, () => {
              setTimeout(() => {
                fabricCanvas.renderAll();
                resolve(null);
              }, 100);
            });
          });

          // Tạo preview đúng kích thước gốc
          const previewCanvas = document.createElement("canvas");
          previewCanvas.width = originalWidth;
          previewCanvas.height = originalHeight;
          const ctx = previewCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, originalWidth, originalHeight);
            const canvasEl =
              typeof fabricCanvas.getElement === "function"
                ? (fabricCanvas.getElement() as HTMLCanvasElement)
                : (
                    fabricCanvas as unknown as {
                      lowerCanvasEl: HTMLCanvasElement;
                    }
                  ).lowerCanvasEl;
            ctx.drawImage(
              canvasEl,
              0,
              0,
              originalWidth,
              originalHeight,
              0,
              0,
              originalWidth,
              originalHeight
            );
            return {
              url: previewCanvas.toDataURL("image/png"),
              width: originalWidth,
              height: originalHeight,
            };
          }
        } catch (parseError) {
          console.error("Error parsing canvas description:", parseError);
        }
      }
      // Return placeholder if no preview available
      return { url: "/images/canvas-placeholder.png", width: 0, height: 0 };
    } catch (error) {
      console.error("Error generating preview:", error);
      return { url: "/images/canvas-placeholder.png", width: 0, height: 0 };
    }
  };

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFolderCanvas({
        FolderName: searchTitle,
        page,
        size,
      });
      const items = data?.responseRequestModel?.responseList?.items || [];

      // Generate previews for all items
      const itemsWithPreviews = await Promise.all(
        items.map(async (item: CanvasFolder) => {
          const preview = await generateCanvasPreview(item);
          return {
            ...item,
            previewUrl: preview.url,
            previewWidth: preview.width,
            previewHeight: preview.height,
          };
        })
      );

      setCanvasList(itemsWithPreviews);

      const totalCount =
        data?.responseRequestModel?.responseList?.totalItems || 0;
      window.dispatchEvent(
        new CustomEvent("canvasCountUpdated", {
          detail: { totalCount },
        })
      );
    } catch (error) {
      console.error("Lỗi tải thiết kế:", error);
    } finally {
      setLoading(false);
    }
  }, [page, getFolderCanvas, searchTitle]);

  const handleSearch = () => {
    setSearchTitle(folderName);
    setPage(1);
  };

  // Update folder name
  const handleUpdateFolder = async (
    canvasFolderId: string,
    newFolderName: string
  ) => {
    try {
      setLoading(true);
      const response = await putFolderCanvas({
        canvasFolderId,
        folderName: newFolderName,
      });
      if (response?.statusCode === 200) {
        toast.success("Cập nhật thư mục thành công!");
        loadList(); // Refresh the list
      } else {
        // toast.error(response?.message || "Cập nhật thư mục thất bại!");
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      // toast.error("Cập nhật thư mục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (canvasFolderId: string) => {
    try {
      setLoading(true);
      const response = await deleteFolderCanvas({ id: canvasFolderId });
      if (response?.statusCode === 200) {
        toast.success("Xóa thư mục thành công!");
        loadList(); // Refresh the list
      } else {
        // toast.error(response?.message || "Xóa thư mục thất bại!");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      // toast.error("Xóa thư mục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Dialog handlers
  const handleEditFolderSubmit = async () => {
    console.log("Submitting edit with:", { editingFolder, editFolderName });
    if (!editingFolder || !editFolderName.trim()) {
      toast.error("Vui lòng nhập tên thư mục!");
      return;
    }
    await handleUpdateFolder(
      editingFolder.canvasFolderId,
      editFolderName.trim()
    );
    setIsEditDialogOpen(false);
    setEditingFolder(null);
    setEditFolderName("");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFolder) return;

    await handleDeleteFolder(deletingFolder.canvasFolderId);
    setIsDeleteDialogOpen(false);
    setDeletingFolder(null);
  };

  useEffect(() => {
    loadList();
  }, [searchTitle, page, loadList]);

  useEffect(() => {
    const handleCanvasSaved = () => {
      setPage(1);
      loadList();
    };

    window.addEventListener("canvasSaved", handleCanvasSaved);
    return () => {
      window.removeEventListener("canvasSaved", handleCanvasSaved);
    };
  }, [loadList]);

  useEffect(() => {
    if (initialCanvasState && canvasList.length > 0 && !hasAutoSelected) {
      const match = canvasList.find(
        (item) => item.canvasFolderId === initialCanvasState.canvasId
      );

      if (match) {
        onSelect(
          initialCanvasState.canvasDescription,
          initialCanvasState.folderName,
          initialCanvasState.canvasId,
          initialCanvasState.canvasId // Use canvasId as folderId for backward compatibility
        );
        setHasAutoSelected(true);
      }
    }
  }, [canvasList, initialCanvasState, onSelect, hasAutoSelected]);

  // Debug useEffect for editFolderName
  useEffect(() => {
    console.log("editFolderName changed:", editFolderName);
  }, [editFolderName]);

  // Reset edit dialog state when dialog closes
  useEffect(() => {
    if (!isEditDialogOpen) {
      setIsEditDialogJustOpened(false);
    }
  }, [isEditDialogOpen]);

  return (
    <div className="space-y-4 p-2">
      {/* Redesigned Search Bar UI */}
      <div className="flex justify-center items-center py-4">
        <div className="relative w-full max-w-4xl">
          <SidebarSearchBar
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onSearch={handleSearch}
            placeholder="Tìm thiết kế..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            loading={loading}
          />
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-4" />
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Đang tải...
              </span>
            </div>
          ) : canvasList.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <FolderX className="w-16 h-16 text-pink-300 mb-4" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Không có thiết kế nào
              </span>
            </div>
          ) : (
            canvasList.map((item) => (
              <div
                key={item.canvasFolderId}
                className={`relative group rounded-3xl shadow-xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 border-2 ${
                  item.canvasFolderId === selectedCanvasId
                    ? "border-pink-400 scale-105"
                    : "border-transparent"
                } transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden`}
                onClick={() => {
                  if (item.latestCanvasInfo?.canvasDescription) {
                    navigate("/canvas/plushdoll-design", {
                      state: {
                        canvasId:
                          item.latestCanvasInfo.canvasInfoId ||
                          item.canvasFolderId,
                        canvasDescription:
                          item.latestCanvasInfo.canvasDescription,
                        canvasTitle:
                          item.latestCanvasInfo.canvasTitle || item.folderName,
                        folderName: item.folderName,
                        folderId: item.canvasFolderId,
                      },
                    });
                  } else {
                    navigate("/canvas/plushdoll-design", {
                      state: {
                        canvasId: "",
                        canvasDescription: "",
                        canvasTitle: "",
                        folderName: item.folderName,
                        folderId: item.canvasFolderId,
                      },
                    });
                  }
                }}
              >
                {/* Edit & Delete Buttons - show on hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    className="p-1 rounded-full bg-white shadow hover:bg-pink-100 border border-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolder(item);
                      setEditFolderName(item.folderName);
                      setIsEditDialogOpen(true);
                      setIsEditDialogJustOpened(true);
                    }}
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-white shadow hover:bg-pink-100 border border-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFolder(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
                <div className="w-full h-40 flex items-center justify-center p-4 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.folderName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                      aspectRatio:
                        item.previewWidth && item.previewHeight
                          ? `${item.previewWidth} / ${item.previewHeight}`
                          : undefined,
                    }}
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 pb-3">
                  {item.latestCanvasInfo?.canvasDescription ? (
                    <div className="text-base font-bold truncate bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {item.latestCanvasInfo.canvasTitle || "Thiết kế mới nhất"}
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1 ${
                        item.canvasFolderId === selectedCanvasId
                          ? "drop-shadow-md"
                          : ""
                      }`}
                    >
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                      {item.folderName}
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      {formatFullDateWithDistance3(item.createdAt)}
                    </div>
                  </div>
                  {/* {item.latestCanvasInfo?.canvasDescription ? (
                    <div className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                      {item.latestCanvasInfo.canvasTitle || "Thiết kế mới nhất"}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Folders className="w-4 h-4 text-gray-300" />
                      Thư mục trống
                    </div>
                  )} */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center items-center pt-6 gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || loading}
          className="rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-pink-600 shadow hover:scale-110 transition-transform border-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <span className="text-base font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Trang {page}
        </span>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={canvasList.length < size || loading}
          className="rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-pink-600 shadow hover:scale-110 transition-transform border-none"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              Chỉnh sửa thư mục
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="editFolderName"
                className="text-base font-semibold mb-1"
              >
                Tên thư mục
              </Label>
              <Input
                id="editFolderName"
                value={editFolderName}
                onChange={(e) => {
                  setEditFolderName(e.target.value);
                }}
                placeholder="Nhập tên thư mục..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditFolderSubmit();
                }}
                autoFocus={isEditDialogJustOpened}
                className="rounded-full px-4 py-2 border-2 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 text-base"
                onFocus={(e) => {
                  if (isEditDialogJustOpened) {
                    const input = e.target;
                    input.setSelectionRange(
                      input.value.length,
                      input.value.length
                    );
                    setIsEditDialogJustOpened(false);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleEditFolderSubmit}
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 font-semibold shadow-md hover:scale-105 transition-transform"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              Xác nhận xóa thư mục?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-base text-gray-600">
              Bạn có chắc chắn muốn xóa thư mục
              <span className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mx-1">
                "{deletingFolder?.folderName}"
              </span>
              không?
              <br />
              <span className="text-sm text-gray-400">
                Hành động này sẽ xóa tất cả các phiên bản thiết kế trong thư mục
                này.
              </span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleDeleteConfirm}
                disabled={loading}
                variant="destructive"
                className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 font-semibold shadow-md hover:scale-105 transition-transform border-none"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Xóa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CanvasListInPage;
