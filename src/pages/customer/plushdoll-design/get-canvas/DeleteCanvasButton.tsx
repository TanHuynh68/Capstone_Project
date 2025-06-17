import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import CustomerService from "@/services/CustomerService";
import { toast } from "sonner";

interface DeleteCanvasButtonProps {
  canvasInfoId: string;
  canvasTitle: string;
}

const DeleteCanvasButton: React.FC<DeleteCanvasButtonProps> = ({
  canvasInfoId,
  canvasTitle,
}) => {
  const { deleteCanvas } = CustomerService();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteCanvas({ canvasInfoId });
      if (res?.statusCode === 200) {
        toast.success("Xóa thiết kế thành công!");
        window.dispatchEvent(new CustomEvent("canvasSaved"));
      } else {
        toast.error(res?.message || "Xóa thiết kế thất bại!");
      }
    } catch (err) {
      toast.error("Xóa thiết kế thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="ml-2">
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa thiết kế?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa thiết kế "{canvasTitle}" không? Hành động
            này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCanvasButton;
