# Paint Splash Screen

## Mô tả

Splash screen được hiển thị khi người dùng nhấn vào nút Paint trong navbar. Splash screen sẽ hiển thị trong 3 giây trước khi chuyển đến trang Canvas.

## Tính năng

### PaintSplashScreen Component

- **Animation mượt mà**: Sử dụng CSS animations và Tailwind CSS
- **Progress tracking**: Hiển thị tiến trình loading với thanh progress
- **Step indicators**: Hiển thị các bước đang thực hiện
- **Background effects**: Các hiệu ứng nền với particles và sparkles
- **Responsive design**: Tương thích với các kích thước màn hình khác nhau

### Paint Component

- **Click handler**: Xử lý sự kiện click và hiển thị splash screen
- **Navigation**: Tự động chuyển đến canvas page sau 3 giây
- **State management**: Quản lý trạng thái hiển thị splash screen

## Cách sử dụng

```tsx
import Paint from "@/components/atoms/layout/navbar/Paint";

// Sử dụng trong navbar
<Paint />;
```

## Animation Classes

### CSS Animations (PaintSplashScreen.css)

- `animate-fade-in`: Fade in animation
- `animate-fade-in-delay`: Fade in với delay 0.3s
- `animate-fade-in-delay-2`: Fade in với delay 0.6s
- `animate-fade-in-delay-3`: Fade in với delay 0.9s
- `animate-scale-in`: Scale in animation
- `animate-slide-in`: Slide in animation
- `animate-float`: Floating animation cho background elements
- `animate-pulse-green/blue/purple`: Pulse animations với màu sắc khác nhau

## Cấu trúc Files

```
navbar/
├── Paint.tsx                 # Main Paint component với splash screen
├── PaintSplashScreen.tsx     # Splash screen component
├── PaintSplashScreen.css     # CSS animations
└── README.md                 # Documentation
```

## Tùy chỉnh

### Thay đổi thời gian hiển thị

Trong `Paint.tsx`, thay đổi giá trị trong `setTimeout`:

```tsx
setTimeout(() => {
  navigate(USER_ROUTES.CANVAS_PAGE);
  setShowSplash(false);
}, 3000); // Thay đổi từ 3000ms thành giá trị mong muốn
```

### Thêm steps mới

Trong `PaintSplashScreen.tsx`, thêm vào array `steps`:

```tsx
const steps = [
  "Đang tải các thiết kế gần đây",
  "Chuẩn bị canvas workspace",
  "Khởi tạo công cụ thiết kế",
  "Hoàn tất!",
  "Bước mới của bạn", // Thêm bước mới
];
```

### Tùy chỉnh animation

Trong `PaintSplashScreen.css`, thêm hoặc chỉnh sửa các keyframes:

```css
@keyframes custom-animation {
  from {
    /* styles */
  }
  to {
    /* styles */
  }
}
```
