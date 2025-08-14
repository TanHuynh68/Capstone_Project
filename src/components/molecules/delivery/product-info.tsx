
import type React from "react";
import { Input } from "../../atoms/delivery/input";
import { Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ImageGalleryOrder from "../post/post-detail/ImageGalleryOrder";
import { PickShift } from "./pick-shift";
import OrderService from "@/services/OrderService";

interface ProductInfoProps {
  onChange?: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  setPickShift: (shift: Record<string, unknown>) => void;
  orderId?: string; // Add orderId prop to fetch delivery value
}

export function ProductInfo({
  onChange,
  errors = {},
  setPickShift,
  orderId,
}: ProductInfoProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({ images: [] });
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
  //   {}
  // );
  const orderService = OrderService();

  // Fetch delivery value data when orderId is provided
  useEffect(() => {
    const fetchDeliveryValue = async () => {
      if (!orderId) return;

      setIsLoading(true);
      try {
        const response = await orderService.getOrderDeliveryValue(orderId);

        if (response?.isSuccess && response?.responseRequestModel) {
          const data = response.responseRequestModel;

          // Update form with fetched data
          const updatedForm = {
            ...form,
            weight: data.weight || "",
            length: data.length || "",
            width: data.width || "",
            height: data.height || "",
          };

          setForm(updatedForm);

          // Call onChange to notify parent component
          if (onChange) {
            onChange(updatedForm);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery value:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryValue();
  }, [orderId]);

  // Separate onChange handler for ProductInfo
  const handleProductInfoChange = (
    updatedForm: Record<string, unknown>,
    changedField?: string
  ) => {
    setForm(updatedForm);
    if (changedField) {
      // setTouchedFields((prev) => ({ ...prev, [changedField]: true }));
    }
    if (onChange) {
      onChange(updatedForm);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = event.target.files;
    if (filesArr) {
      const newFiles = Array.from(filesArr).filter((file) => {
        if (file.size > 1 * 1024 * 1024) {
          setImageError("Chỉ cho phép ảnh tối đa 1MB.");
          return false;
        }
        return true;
      });
      if (newFiles.length > 0) setImageError(null);
      const currentFiles = (form.images as File[]) || [];
      const filesToAdd = newFiles.slice(0, 3 - currentFiles.length);
      setUploadedImages((prev) => [
        ...prev,
        ...filesToAdd.map((file) => URL.createObjectURL(file)),
      ]);
      const updatedForm = {
        ...form,
        images: [...currentFiles, ...filesToAdd],
      };
      handleProductInfoChange(updatedForm);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const filesArr = event.dataTransfer.files;
    if (filesArr) {
      const newFiles = Array.from(filesArr).filter((file) => {
        if (file.size > 1 * 1024 * 1024) {
          setImageError("Chỉ cho phép ảnh tối đa 1MB.");
          return false;
        }
        return true;
      });
      if (newFiles.length > 0) setImageError(null);
      const currentFiles = (form.images as File[]) || [];
      const filesToAdd = newFiles.slice(0, 3 - currentFiles.length);
      setUploadedImages((prev) => [
        ...prev,
        ...filesToAdd.map((file) => URL.createObjectURL(file)),
      ]);
      const updatedForm = {
        ...form,
        images: [...currentFiles, ...filesToAdd],
      };
      handleProductInfoChange(updatedForm);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    const updatedForm = {
      ...form,
      images: ((form.images as File[]) || []).filter((_, i) => i !== index),
    };
    handleProductInfoChange(updatedForm);
  };

  // useEffect(() => {
  //   // Chỉ log errors nếu có ít nhất một trường đã nhập (touched)
  //   if (Object.values(touchedFields).some(Boolean)) {
  //     console.log(errors);
  //   }
  // }, [errors, touchedFields]);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thông tin sản phẩm</h3>
        {isLoading && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Đang tải thông tin sản phẩm...
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              required
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              value={form.content as string || ""}
              onChange={(e) => {
                const updatedForm = { ...form, content: e.target.value };
                handleProductInfoChange(updatedForm, "content");
              }}
              error={errors?.content}
              disabled={isLoading}
            />
          </div>
          <div>
            <PickShift onChange={setPickShift} errors={errors} disabled={isLoading} />
            {errors["pickShift.pickShiftId"] && (
              <span className="text-destructive text-sm mt-1">
                {errors["pickShift.pickShiftId"]}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Input
              required
              label="KL (gram)"
              value={form.weight as string || "0"}
              type="number"
              onChange={(e) => {
                const updatedForm = { ...form, weight: e.target.value };
                handleProductInfoChange(updatedForm, "weight");
              }}
              error={errors?.weight}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              label="Dài (cm)"
              required
              value={form.length as string || "0"}
              type="number"
              onChange={(e) => {
                const updatedForm = { ...form, length: e.target.value };
                handleProductInfoChange(updatedForm, "length");
              }}
              error={errors?.length}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              required
              label="Rộng (cm)"
              value={form.width as string || "0"}
              type="number"
              onChange={(e) => {
                const updatedForm = { ...form, width: e.target.value };
                handleProductInfoChange(updatedForm, "width");
              }}
              error={errors?.width}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              required
              label="Cao (cm)"
              value={form.height as string || "0"}
              type="number"
              onChange={(e) => {
                const updatedForm = { ...form, height: e.target.value };
                handleProductInfoChange(updatedForm, "height");
              }}
              error={errors?.height}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 justify-start ">
            Hình ảnh sản phẩm <span className="ml-2 text-red-500">*</span>
          </label>

          {/* Preview thumbnails & modal dùng ImageGalleryOrder */}
          <ImageGalleryOrder
            images={uploadedImages}
            title=""
            onRemoveImage={removeImage}
          />

          {/* Upload area, chỉ hiện nếu < 3 ảnh */}
          {(form.images as File[]).length < 3 && (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors mt-6 ${isLoading
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'hover:border-primary cursor-pointer'
                }`}
              onDrop={isLoading ? undefined : handleDrop}
              onDragOver={isLoading ? undefined : handleDragOver}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={((form.images as File[]) || []).length >= 3 || isLoading}
              />

              <label htmlFor="image-upload" className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="flex flex-col items-center space-y-2">
                  <Camera className={`w-8 h-8 ${isLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                  <div className={`text-sm ${isLoading ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isLoading ? (
                      "Đang tải thông tin sản phẩm..."
                    ) : (
                      <>
                        <span className="text-primary font-medium">
                          Nhấp để tải ảnh lên
                        </span>{" "}
                        hoặc kéo thả ảnh vào đây
                      </>
                    )}
                  </div>
                  {!isLoading && (
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 1MB, tối đa 3 ảnh
                    </div>
                  )}
                </div>
              </label>
            </div>
          )}
          {errors?.files && (
            <div className="text-red-500 text-sm mt-1">{errors.files}</div>
          )}
          {imageError && (
            <div className="text-red-500 text-sm mt-1">{imageError}</div>
          )}

          {errors.images && (
            <span className="text-destructive text-sm mt-1">
              {errors.images}
            </span>
          )}
        </div>

        {/* Notes only, full width */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 justify-start ">
              Ghi chú <span className="ml-2 text-red-500">*</span>
            </label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú"
              className="min-h-[120px] border-gray-300 focus:border-primary"
              value={form.note as string || ""}
              onChange={(e) => {
                const updatedForm = { ...form, note: e.target.value };
                handleProductInfoChange(updatedForm, "note");
              }}
              disabled={isLoading}
            />
            {errors?.note && (
              <div className="text-red-500 text-sm mt-1">{errors.note}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
