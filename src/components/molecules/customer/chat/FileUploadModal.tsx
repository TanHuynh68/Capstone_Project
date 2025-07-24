"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, File, ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Reset state when modal closes
  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsDragging(false);
    setIsUploading(false);
    onClose();
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    console.log('handleFileSelect: ', file)
    setSelectedFile(file);
    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Tải lên tệp
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Chọn tệp để tải lên và chia sẻ trong cuộc trò chuyện.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {!selectedFile ? (
            // File selection area
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-300 mb-2">
                Kéo thả tệp vào đây hoặc nhấp để chọn
              </p>
              <p className="text-sm text-gray-500">
                Hỗ trợ tất cả các định dạng tệp (tối đa 1MB)
              </p>
            </div>
          ) : (
            // File preview
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
              <div className="flex items-start gap-4">
                {preview ? (
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg">
                    {getFileIcon(selectedFile)}
                  </div>
                )}

                <div className="flex-1 max-w-[300px]">
                  <p className="font-medium text-gray-200 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFile.type || "Không xác định"}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept={"image/*"}
          />
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
