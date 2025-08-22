# 🚀 Cấu hình Cloudinary cho 3D Models

## ❓ Tại sao cần Cloudinary?

Canvas3D gặp lỗi **"413 Request Entity Too Large"** khi lưu vì:
- GLB files có thể rất lớn (10MB - 100MB+)
- Base64 encoding làm tăng kích thước thêm ~33%
- Database có giới hạn kích thước field

**Giải pháp**: Chỉ upload **model hiện tại** lên Cloudinary khi nhấn "Lưu 3D", còn textures và accessories vẫn giữ base64.

## ⚙️ Cấu hình Cloudinary

### 1. Tạo tài khoản Cloudinary
- Đăng ký tại [cloudinary.com](https://cloudinary.com)
- Lấy **Cloud Name** từ dashboard

### 2. Tạo Upload Preset
1. Vào **Settings** → **Upload**
2. Tạo **Upload Preset** mới
3. Cấu hình:
   - **Signing Mode**: `Unsigned` (không cần API key)
   - **Resource Type**: `Raw` (cho GLB files)
   - **Folder**: `3d-assets` (chỉ cho models)
   - **Allowed Formats**: `glb`, `gltf`

### 3. Cập nhật Environment Variables

Sửa file `src/config/env.ts`:

```typescript
export default {
    // ... other env vars
    CLOUDINARY_CLOUD_NAME_YUMI: 'your_actual_cloud_name',
    CLOUDINARY_UPLOAD_PRESET_YUMI: 'your_actual_upload_preset',
    CLOUDINARY_API_KEY_YUMI: 'your_api_key', // nếu cần
    CLOUDINARY_API_SECRET_YUMI: 'your_api_secret', // nếu cần
};
```

### 4. Hoặc sử dụng .env file

Tạo file `.env`:

```bash
REACT_APP_CLOUDINARY_CLOUD_NAME_YUMI=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET_YUMI=your_upload_preset
REACT_APP_CLOUDINARY_API_KEY_YUMI=your_api_key
REACT_APP_CLOUDINARY_API_SECRET_YUMI=your_api_secret
```

## 🔄 Quy trình hoạt động

### **Trước (Base64 - Lỗi 413):**
```
GLB File (50MB) → Base64 → JSON (67MB) → Database ❌
```

### **Sau (Cloudinary - Thành công):**
```
Model hiện tại → Upload Cloudinary → URL → canvas3D field → Database ✅
```

## 📁 Cấu trúc thư mục Cloudinary

```
cloudinary.com/your_cloud_name/
└── 3d-assets/          # Tất cả file 3D (GLB, texture, accessory)
    ├── model1.glb
    ├── texture1.png
    ├── hat.glb
    └── ...
```

## 🧪 Test Upload

1. **Mở Console** (F12)
2. **Upload GLB file** → Xem log upload
3. **Nhấn "👁️ Preview"** → Xem dữ liệu sẽ lưu
4. **Nhấn "Lưu 3D"** → Xem quá trình upload Cloudinary và lưu vào canvas3D

## 📊 So sánh kích thước

| Loại | Trước (Base64) | Sau (Cloudinary) | Giảm |
|------|----------------|------------------|------|
| Model 50MB | 67MB | 0.1KB | **99.9%** |
| **Tổng** | **~67MB** | **0.1KB** | **99.9%** |

## 🚨 Lưu ý quan trọng

1. **Upload Preset phải là "Unsigned"** để không cần API key
2. **Resource Type phải là "Raw"** để hỗ trợ GLB files
3. **File size limit**: 
   - **Free Plan**: 10MB tối đa cho tất cả files
   - **Paid Plans**: Có thể lên đến 100MB+ tùy gói
4. **Backup**: Cloudinary có thể xóa files nếu vi phạm ToS
5. **Environment Variables**: Tất cả config đều lấy từ env, không hardcode

## 🔧 Troubleshooting

### Lỗi "Upload failed"
- Kiểm tra Cloud Name và Upload Preset
- Đảm bảo Upload Preset cho phép unsigned uploads
- Kiểm tra file size limit

### Lỗi "File size too large" 
```
"File size too large. Got 10602788. Maximum is 10485760"
```
**Nguyên nhân**: File GLB vượt quá 10MB (giới hạn free plan)

**Giải pháp**:
1. **Tối ưu hóa thiết kế**:
   - Giảm số lượng texture và accessory
   - Sử dụng texture có kích thước nhỏ hơn
   - Xóa các elements không cần thiết
   
2. **Nâng cấp Cloudinary plan**:
   - Truy cập [Cloudinary Pricing](https://cloudinary.com/pricing)
   - Chọn gói phù hợp với nhu cầu
   - Cập nhật `FILE_SIZE_LIMITS.GLB` trong `src/config/cloudinary.ts`

### Lỗi "Resource type not allowed"
- Upload Preset phải cho phép "raw" resource type
- Kiểm tra allowed formats trong preset

### Files không hiển thị
- Kiểm tra URL trả về từ Cloudinary
- Đảm bảo file đã upload thành công
- Kiểm tra CORS settings nếu cần
