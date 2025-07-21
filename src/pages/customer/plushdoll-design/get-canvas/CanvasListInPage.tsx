import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Plus, Edit, Trash2 } from "lucide-react";
import SidebarSearchBar from "../SidebarSearchBar";
import CanvasService from "@/services/CanvasService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FabricObject {
  scaleX?: number;
  scaleY?: number;
  left?: number;
  top?: number;
  fontSize?: number;
}

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
}

interface CanvasListProps {
  onSelect: (
    canvasDescription: string,
    folderName: string,
    canvasId: string,
    folderId?: string
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<CanvasFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderName, setEditFolderName] = useState("");

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState<CanvasFolder | null>(
    null
  );
  const [isEditDialogJustOpened, setIsEditDialogJustOpened] = useState(false);
  const size = 10;
  const {
    getFolderCanvas,
    postFolderCanvas,
    putFolderCanvas,
    deleteFolderCanvas,
  } = CanvasService();

  // Function to generate canvas preview
  const generateCanvasPreview = async (item: CanvasFolder): Promise<string> => {
    try {
      // If we have latestCanvasInfo with previewUrl, use it
      if (item.latestCanvasInfo?.previewUrl) {
        return item.latestCanvasInfo.previewUrl;
      }

      // If we have canvas description, generate preview from it
      if (item.latestCanvasInfo?.canvasDescription) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 444;
        tempCanvas.height = 250;
        const fabricCanvas = new window.fabric.Canvas(tempCanvas, {
          backgroundColor: "#fff",
        });

        try {
          const parsedDesc = JSON.parse(
            item.latestCanvasInfo.canvasDescription
          );
          const scaleX = tempCanvas.width / 960;
          const scaleY = tempCanvas.height / 540;
          const scale = Math.min(scaleX, scaleY);

          parsedDesc.objects?.forEach((obj: FabricObject) => {
            if (obj.scaleX) obj.scaleX *= scale;
            if (obj.scaleY) obj.scaleY *= scale;
            if (obj.left) obj.left *= scale;
            if (obj.top) obj.top *= scale;
            if (obj.fontSize) obj.fontSize *= scale;
          });

          await new Promise((resolve) => {
            fabricCanvas.loadFromJSON(parsedDesc, () => {
              setTimeout(() => {
                fabricCanvas.renderAll();
                resolve(null);
              }, 100);
            });
          });

          return fabricCanvas.toDataURL({ format: "png" });
        } catch (parseError) {
          console.error("Error parsing canvas description:", parseError);
        }
      }

      // Return placeholder if no preview available
      return "/images/canvas-placeholder.png";
    } catch (error) {
      console.error("Error generating preview:", error);
      return "/images/canvas-placeholder.png";
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
          const previewUrl = await generateCanvasPreview(item);
          return { ...item, previewUrl };
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

  const handleSelectCanvas = (
    description: string,
    title: string,
    id: string,
    folderId?: string
  ) => {
    onSelect(description, title, id, folderId);
  };

  const handleSearch = () => {
    setSearchTitle(folderName);
    setPage(1);
  };

  // Create new folder
  const handleCreateFolder = async (newFolderName: string) => {
    try {
      setLoading(true);
      const response = await postFolderCanvas({ folderName: newFolderName });
      if (response?.statusCode === 200) {
        toast.success("Tạo thư mục thành công!");
        loadList(); // Refresh the list
      } else {
        // toast.error(response?.message || "Tạo thư mục thất bại!");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      //   toast.error("Tạo thư mục thất bại!");
    } finally {
      setLoading(false);
    }
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
  const handleCreateFolderSubmit = async () => {
    if (!newFolderName.trim()) {
      toast.error("Vui lòng nhập tên thư mục!");
      return;
    }
    await handleCreateFolder(newFolderName.trim());
    setIsCreateDialogOpen(false);
    setNewFolderName("");
  };

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

  const openEditDialog = (folder: CanvasFolder) => {
    console.log("Opening edit dialog for folder:", folder);
    setEditingFolder(folder);
    setEditFolderName(folder.folderName);
    setIsEditDialogOpen(true);
    setIsEditDialogJustOpened(true);
  };

  const openDeleteDialog = (folder: CanvasFolder) => {
    setDeletingFolder(folder);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFolder) return;

    await handleDeleteFolder(deletingFolder.canvasFolderId);
    setIsDeleteDialogOpen(false);
    setDeletingFolder(null);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Vừa tạo";
    } else if (diffInHours < 24) {
      return `Đã tạo ${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Đã tạo ${diffInDays} ngày trước`;
    }
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
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
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

        {/* Create Folder Button */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tạo thư mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo thư mục mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newFolderName">Tên thư mục</Label>
                <Input
                  id="newFolderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nhập tên thư mục..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolderSubmit();
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCreateFolderSubmit} disabled={loading}>
                  {loading ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 text-center py-8 text-muted-foreground">
              Đang tải...
            </div>
          ) : canvasList.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 text-muted-foreground text-sm text-center py-8">
              Không có thiết kế nào
            </div>
          ) : (
            canvasList.map((item) => (
              <div
                key={item.canvasFolderId}
                className={`cursor-pointer group transition-all duration-200 ease-in-out transform `}
                onClick={() => {
                  console.log("Clicking on folder:", item);
                  // Check if folder has any canvas
                  if (item.latestCanvasInfo?.canvasDescription) {
                    // Folder has canvas - load the latest one
                    console.log("Loading existing canvas from folder:", {
                      description: item.latestCanvasInfo.canvasDescription,
                      title:
                        item.latestCanvasInfo.canvasTitle || item.folderName,
                      canvasId:
                        item.latestCanvasInfo.canvasInfoId ||
                        item.canvasFolderId,
                      folderId: item.canvasFolderId,
                    });
                    handleSelectCanvas(
                      item.latestCanvasInfo.canvasDescription,
                      item.latestCanvasInfo.canvasTitle || item.folderName,
                      item.latestCanvasInfo.canvasInfoId || item.canvasFolderId,
                      item.canvasFolderId
                    );
                  } else {
                    // Folder is empty - create new canvas in this folder
                    console.log("Creating new canvas in folder:", {
                      folderName: item.folderName,
                      folderId: item.canvasFolderId,
                    });
                    handleSelectCanvas(
                      "", // No canvas description
                      `Thiết kế mới - ${item.folderName}`, // Use folder name as title
                      item.canvasFolderId, // Use folder ID as canvas ID
                      item.canvasFolderId
                    );
                  }
                }}
              >
                <div className="aspect-video bg-white rounded-lg mb-2 relative border-2 border-primary/80 shadow-sm transition-transform duration-200">
                  <img
                    src={item.previewUrl}
                    alt={item.folderName}
                    className="w-full h-full object-contain transition-all duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(item);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(item);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-sm font-medium truncate transition-all duration-200 ${
                        item.canvasFolderId === selectedCanvasId
                          ? "text-primary scale-105"
                          : "text-muted-foreground scale-100"
                      }`}
                    >
                      {item.folderName}
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  {item.latestCanvasInfo?.canvasDescription ? (
                    <div className="text-xs text-blue-600 mt-1">
                      {item.latestCanvasInfo.canvasTitle || "Thiết kế mới nhất"}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1">
                      Thư mục trống
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
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
          disabled={canvasList.length < size || loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thư mục</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFolderName" className="text-sm mb-1">
                Tên thư mục
              </Label>
              <Input
                id="editFolderName"
                value={editFolderName}
                onChange={(e) => {
                  console.log("Input value changed:", e.target.value);
                  setEditFolderName(e.target.value);
                }}
                placeholder="Nhập tên thư mục..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditFolderSubmit();
                }}
                autoFocus={isEditDialogJustOpened}
                onFocus={(e) => {
                  if (isEditDialogJustOpened) {
                    // Đặt cursor ở cuối text thay vì select all
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
              <Button onClick={handleEditFolderSubmit} disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thư mục?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa thư mục{" "}
              <span className="font-bold text-primary">
                "{deletingFolder?.folderName}"
              </span>{" "}
              không?
              <br />
              Hành động này sẽ xóa tất cả các phiên bản thiết kế trong thư mục
              này.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleDeleteConfirm}
                disabled={loading}
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CanvasListInPage;
