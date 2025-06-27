"use client";

import type React from "react";

import { Input } from "../../atoms/delivery/input";
import { Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ImageGalleryOrder from "../post/post-detail/ImageGalleryOrder";
import { PickShift } from "./pick-shift";

interface ProductInfoProps {
  onChange?: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  setPickShift: (shift: Record<string, unknown>) => void;
}

export function ProductInfo({
  onChange,
  errors = {},
  setPickShift,
}: ProductInfoProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({ images: [] });
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (onChange) onChange(form);
  }, [form, onChange]);

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
      setForm((f) => ({
        ...f,
        images: [...currentFiles, ...filesToAdd],
      }));
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
      setForm((f) => ({
        ...f,
        images: [...currentFiles, ...filesToAdd],
      }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setForm((f) => ({
      ...f,
      images: ((f.images as File[]) || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thông tin sản phẩm</h3>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
            {errors?.content && (
              <div className="text-red-500 text-sm mt-1">{errors.content}</div>
            )}
          </div>
          <div>
            <PickShift onChange={setPickShift} errors={errors} />
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
              label="KL (gram)"
              defaultValue="0"
              type="number"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, weight: e.target.value }))
              }
            />
            {errors?.weight && (
              <div className="text-red-500 text-sm mt-1">{errors.weight}</div>
            )}
          </div>
          <div>
            <Input
              label="Dài (cm)"
              defaultValue="0"
              type="number"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, length: e.target.value }))
              }
            />
            {errors?.length && (
              <div className="text-red-500 text-sm mt-1">{errors.length}</div>
            )}
          </div>
          <div>
            <Input
              label="Rộng (cm)"
              defaultValue="0"
              type="number"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, width: e.target.value }))
              }
            />
            {errors?.width && (
              <div className="text-red-500 text-sm mt-1">{errors.width}</div>
            )}
          </div>
          <div>
            <Input
              label="Cao (cm)"
              defaultValue="0"
              type="number"
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, height: e.target.value }))
              }
            />
            {errors?.height && (
              <div className="text-red-500 text-sm mt-1">{errors.height}</div>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 justify-start flex">
            Hình ảnh sản phẩm
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
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors mt-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={((form.images as File[]) || []).length >= 3}
              />

              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="text-primary font-medium">
                      Nhấp để tải ảnh lên
                    </span>{" "}
                    hoặc kéo thả ảnh vào đây
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 1MB, tối đa 3 ảnh
                  </div>
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
            <label className="block text-sm font-medium mb-2 justify-start flex">
              Ghi chú
            </label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú"
              className="min-h-[120px] border-gray-300 focus:border-primary"
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
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
