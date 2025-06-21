"use client";

import type React from "react";

import { Input } from "../../atoms/delivery/input";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function ProductInfo() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thông tin sản phẩm</h3>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
          <Input label="Sản phẩm" placeholder="Nhập tên sản phẩm" required />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Input label="KL (gram)" defaultValue="500" required />
          <Input label="Dài (cm)" defaultValue="10" required />
          <Input label="Rộng (cm)" defaultValue="10" required />
          <Input label="Cao (cm)" defaultValue="10" required />
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 justify-start flex">
            Hình ảnh sản phẩm
          </label>

          {/* Uploaded Images Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                <Camera className="w-8 h-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="text-orange-500 font-medium">
                    Nhấp để tải ảnh lên
                  </span>{" "}
                  hoặc kéo thả ảnh vào đây
                </div>
                <div className="text-xs text-gray-500">
                  PNG, JPG, GIF tối đa 10MB
                </div>
              </div>
            </label>
          </div>
          <div className="pt-5">
            <label className="block text-sm font-medium mb-2 justify-start flex">
              Ghi chú
            </label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú"
              className="min-h-[120px] border-gray-300 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
