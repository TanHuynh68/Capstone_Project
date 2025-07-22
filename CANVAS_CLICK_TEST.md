# Test Canvas Click Functionality

## Mô tả

Kiểm tra tính năng khi click vào thư mục trong CanvasListInPage thì mở nó vào canvas.

## Các trường hợp test

### 1. Thư mục có canvas

- **Bước 1**: Click vào thư mục có canvas
- **Kết quả mong đợi**:
  - Navigate đến trang thiết kế
  - Load canvas từ `latestCanvasInfo.canvasDescription`
  - Hiển thị toast "Đã tải thiết kế [tên] thành công!"
  - Canvas được hiển thị với nội dung đã lưu

### 2. Thư mục trống

- **Bước 1**: Click vào thư mục trống (không có canvas)
- **Kết quả mong đợi**:
  - Navigate đến trang thiết kế
  - Tạo canvas mới với tên "Thiết kế mới - [tên thư mục]"
  - Hiển thị toast "Đã tạo canvas mới!"
  - Canvas trống sẵn sàng để thiết kế

### 3. Xử lý lỗi

- **Bước 1**: Click vào thư mục khi có lỗi network
- **Kết quả mong đợi**:
  - Hiển thị toast "Có lỗi xảy ra khi tải thiết kế"
  - Không crash ứng dụng

## Các thay đổi đã thực hiện

### 1. Cập nhật logic xử lý location.state

- Hỗ trợ cả `selectedCanvasId` và `canvasId`
- Xử lý trường hợp có `canvasDescription` trực tiếp
- Xử lý trường hợp `hasExistingCanvas = false`

### 2. Cải thiện UI

- Hiển thị "Thư mục trống" cho thư mục không có canvas
- Thêm console.log để debug
- Cải thiện toast messages

### 3. Xử lý lỗi tốt hơn

- Fallback khi không tìm thấy canvas trong API
- Tạo canvas mới thay vì hiển thị lỗi

## Cách test

1. Mở trang CanvasPage
2. Click vào một thư mục có canvas
3. Kiểm tra xem canvas có được load đúng không
4. Click vào một thư mục trống
5. Kiểm tra xem có tạo canvas mới không
6. Kiểm tra console để xem các log messages
