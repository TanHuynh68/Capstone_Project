"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import EditSettingDialog from "../../../molecules/admin/setting-system/EditSettingDialog";

interface SettingsTableProps {
  settings: SystemSetting[];
  loading: boolean;
  onRefresh: () => void;
}

export default function SettingsTable({
  settings,
  loading,
  onRefresh,
}: SettingsTableProps) {
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingSetting, setDeletingSetting] = useState<SystemSetting | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingSetting, setViewingSetting] = useState<SystemSetting | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSettingTypeColor = (key: string) => {
    if (key.toLowerCase().includes("level")) return "bg-blue-100 text-blue-800";
    if (key.toLowerCase().includes("fee")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsEditDialogOpen(true);
  };

  const handleView = (setting: SystemSetting) => {
    setViewingSetting(setting);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (setting: SystemSetting) => {
    setDeletingSetting(setting);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingSetting) return;

    try {
      // TODO: Replace with actual API call
      console.log("Deleting setting:", deletingSetting.settingId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Xóa setting thành công!");
      setIsDeleteDialogOpen(false);
      setDeletingSetting(null);
      onRefresh();
    } catch (error) {
      console.error("Error deleting setting:", error);
      toast.error("Có lỗi xảy ra khi xóa setting");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Key</TableHead>
              <TableHead className="w-[100px]">Giá trị</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[150px]">Cập nhật lần cuối</TableHead>
              <TableHead className="w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  Không có setting nào
                </TableCell>
              </TableRow>
            ) : (
              settings.map((setting) => (
                <TableRow key={setting.settingId}>
                  <TableCell>
                    <div className="">
                      <Badge
                        variant="secondary"
                        className={getSettingTypeColor(setting.key)}
                      >
                        {setting.key}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{setting.value}</span>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-4xl   truncate"
                      title={setting.description}
                    >
                      {setting.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(setting.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(setting)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(setting)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(setting)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <EditSettingDialog
        setting={editingSetting}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingSetting(null);
        }}
        onSettingUpdated={onRefresh}
      />

      {/* View Dialog */}
      {viewingSetting && (
        <AlertDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} >
          <AlertDialogContent className="max-w-md rounded-2xl shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold">
                📋 Chi tiết Setting
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4 mt-2">
              {/* Key */}
              <div className="flex items-start justify-between rounded-lg border p-3">
                <span className="text-sm font-medium text-gray-600">Key</span>
                <span className="text-sm font-semibold">
                  {viewingSetting.key}
                </span>
              </div>

              {/* Giá trị */}
              <div className="flex items-start justify-between rounded-lg border p-3">
                <span className="text-sm font-medium text-gray-600">
                  Giá trị
                </span>
                <span className="text-sm font-semibold text-primary">
                  {viewingSetting.value}
                </span>
              </div>

              {/* Mô tả */}
              <div className="rounded-lg border p-3">
                <span className="text-sm font-medium text-gray-600">Mô tả</span>
                <p className="mt-1 text-sm text-gray-800">
                  {viewingSetting.description || "—"}
                </p>
              </div>

              {/* Ngày tạo */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium text-gray-600">
                  Ngày tạo
                </span>
                <span className="text-sm">
                  {formatDate(viewingSetting.createdAt)}
                </span>
              </div>

              {/* Ngày cập nhật */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium text-gray-600">
                  Cập nhật lần cuối
                </span>
                <span className="text-sm">
                  {formatDate(viewingSetting.updatedAt)}
                </span>
              </div>
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="rounded-lg">Đóng</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa setting "{deletingSetting?.key}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
