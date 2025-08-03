# CreateStaffForm Component

Component này được sử dụng để tạo tài khoản nhân viên cho admin.

## Tính năng

- UI giống hệt trang đăng ký thông thường
- Có 3 role options: Khách hàng, Nhà thiết kế, Nhân viên
- Validation form với Zod schema
- Loading state khi submit
- Error handling
- Responsive design

## Cách sử dụng

```tsx
import CreateStaffForm from "@/components/organisms/staff/create-staff/CreateStaffForm";

function AdminPage() {
  const handleCreateStaff = async (data: RegisterFormValues) => {
    try {
      // Gọi API tạo tài khoản staff
      const response = await staffService.createStaff(data);
      // Xử lý response
    } catch (error) {
      // Xử lý error
    }
  };

  return (
    <CreateStaffForm onSubmit={handleCreateStaff} />
  );
}
```

## Props

- `onSubmit`: Function nhận data từ form và xử lý tạo tài khoản

## Dependencies

- react-hook-form
- @hookform/resolvers/zod
- lucide-react
- sonner (cho toast notifications)

## Routes

- Admin route: `/admin/create-staff`
- Được thêm vào sidebar admin với icon UserPlusIcon 