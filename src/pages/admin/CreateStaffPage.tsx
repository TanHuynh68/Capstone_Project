"use client";

// import { useNavigate } from "react-router-dom";
import CreateStaffForm from "@/components/organisms/staff/create-staff/CreateStaffForm";
import { type RegisterFormValues } from "@/schemas/registerSchema";
import { toast } from "sonner";
// import { PATH } from "@/routes/path";
import AdminService from "@/services/AdminService";

export default function CreateStaffPage() {
  // const navigate = useNavigate();

  const adminService = AdminService();
  const handleCreateStaff = async (data: RegisterFormValues) => {
    try {
      // Convert role and gender from string to number
      const processedData = {
        ...data,
        role: parseInt(data.role),
        gender: parseInt(data.gender),
      };

      const response = await adminService.createStaff(processedData);

      if (response?.statusCode) {
        toast.success("Tạo tài khoản nhân viên thành công!");
        // navigate(PATH.ADMIN_DASHBOARD);
      } else {
        // toast.error(
        //   response.message || "Có lỗi xảy ra khi tạo tài khoản nhân viên"
        // );
      }
    } catch (error) {
      console.error("Error creating staff account:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tạo tài khoản nhân viên";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CreateStaffForm  onSubmit={handleCreateStaff} />
    </div>
  );
}
