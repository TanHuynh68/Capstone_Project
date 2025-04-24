"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import CustomerService from "@/services/CustomerService";

type DeleteAddressProps = {
  addressID: string;
  addressDetail: string;
  ward: string | number;
  district: string | number;
  getLocationName: (type: "district" | "ward", id: string | number) => string;
  onDeleted: () => void;
};


const DeleteAddress = ({
  addressID,
  addressDetail,
  ward,
  district,
  getLocationName,
  onDeleted,
}: DeleteAddressProps) => {
  const [loading, setLoading] = useState(false);
  const { deleteAddresses } = CustomerService();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAddresses({ addressID });
      toast.success("Xoá địa chỉ thành công!");
      onDeleted();
    } catch (err: any) {
      toast.error(err?.response?.data || "Xoá địa chỉ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn xoá địa chỉ này?</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-sm text-gray-700">
              Địa chỉ:
              <br />
              <strong>
                {addressDetail}, {getLocationName("ward", ward)},{" "}
                {getLocationName("district", district)}, TP. Hồ Chí Minh
              </strong>
            </p>
            <br />
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xoá..." : "Xoá"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAddress;
