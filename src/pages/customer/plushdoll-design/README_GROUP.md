# Tính năng Group/Ungroup trong Canvas Editor

## Tổng quan

Tính năng Group/Ungroup cho phép người dùng tổ chức và quản lý các đối tượng trên canvas một cách hiệu quả bằng cách nhóm chúng lại với nhau hoặc tách chúng ra.

## Các tính năng chính

### 1. Group Objects (Nhóm đối tượng)

- **Mục đích**: Kết hợp nhiều đối tượng thành một nhóm để dễ quản lý
- **Cách sử dụng**:
  - Chọn nhiều đối tượng bằng cách giữ Ctrl (hoặc Cmd trên Mac) và click
  - Nhấn Ctrl+G hoặc click nút "Nhóm" trong sidebar
- **Yêu cầu**: Cần chọn ít nhất 2 đối tượng

### 2. Ungroup Objects (Tách nhóm)

- **Mục đích**: Tách nhóm đối tượng thành các đối tượng riêng lẻ
- **Cách sử dụng**:
  - Chọn nhóm đối tượng
  - Nhấn Ctrl+Shift+G hoặc click nút "Tách nhóm" trong sidebar
- **Yêu cầu**: Cần chọn một nhóm đối tượng

## Giao diện người dùng

### Sidebar Buttons

- **Nút "Nhóm"**: Hiển thị khi có thể nhóm (chọn nhiều đối tượng)
- **Nút "Tách nhóm"**: Hiển thị khi có thể tách nhóm (chọn một nhóm)
- **Trạng thái disabled**: Các nút sẽ bị vô hiệu hóa khi không thể thực hiện hành động

### Toolbar Buttons

- Các nút Group/Ungroup cũng xuất hiện trong toolbar khi chọn đối tượng
- Vị trí: Bên cạnh các nút xoay và layer

### Phím tắt

- **Ctrl+G**: Nhóm đối tượng
- **Ctrl+Shift+G**: Tách nhóm
- **Ctrl+A**: Chọn tất cả đối tượng
- **Ctrl+C**: Copy đối tượng/nhóm
- **Ctrl+V**: Paste đối tượng/nhóm

## Lợi ích

### 1. Tổ chức thiết kế

- Nhóm các đối tượng liên quan lại với nhau
- Dễ dàng quản lý các thành phần phức tạp
- Giảm thiểu việc chọn nhầm đối tượng

### 2. Thao tác hiệu quả

- Di chuyển nhiều đối tượng cùng lúc
- Copy/paste nhóm đối tượng
- Transform (scale, rotate) nhóm đối tượng

### 3. Quản lý layer

- Nhóm đối tượng được xử lý như một đối tượng duy nhất
- Dễ dàng điều chỉnh thứ tự layer

## Cài đặt kỹ thuật

### State Management

```typescript
const [canGroupState, setCanGroupState] = useState(false);
const [canUngroupState, setCanUngroupState] = useState(false);
```

### Event Listeners

```typescript
useEffect(() => {
  const updateGroupStates = () => {
    setCanGroupState(canGroup());
    setCanUngroupState(canUngroup());
  };

  if (canvasRef.current) {
    canvasRef.current.on("selection:created", updateGroupStates);
    canvasRef.current.on("selection:updated", updateGroupStates);
    canvasRef.current.on("selection:cleared", updateGroupStates);
  }
}, []);
```

### Group Functions

```typescript
const groupObjects = () => {
  const activeObject = canvasRef.current?.getActiveObject();
  if (activeObject?.type === "activeSelection") {
    const group = activeObject.toGroup();
    canvasRef.current.setActiveObject(group);
    saveState();
  }
};

const ungroupObjects = () => {
  const activeObject = canvasRef.current?.getActiveObject();
  if (activeObject?.type === "group") {
    activeObject.toActiveSelection();
    saveState();
  }
};
```

## Lưu ý khi sử dụng

1. **Undo/Redo**: Các thao tác group/ungroup được hỗ trợ undo/redo
2. **Auto Save**: Nhóm đối tượng được lưu tự động cùng với thiết kế
3. **Performance**: Nhóm đối tượng giúp cải thiện hiệu suất khi xử lý nhiều đối tượng
4. **Compatibility**: Tương thích với tất cả các loại đối tượng (text, image, shape)

## Troubleshooting

### Vấn đề thường gặp

1. **Không thể nhóm**: Kiểm tra xem đã chọn đủ 2 đối tượng chưa
2. **Không thể tách nhóm**: Kiểm tra xem đã chọn đúng nhóm đối tượng chưa
3. **Nút bị disabled**: Đây là hành vi bình thường, nút sẽ được enable khi có thể thực hiện hành động

### Debug

- Sử dụng `CanvasDebugInfo` để xem số lượng đối tượng hiện tại
- Kiểm tra console để xem các thông báo lỗi
- Đảm bảo canvas đã được khởi tạo đúng cách
