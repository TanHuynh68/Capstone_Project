"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import FormError from "@/components/atoms/post/customer-upload-post/FormError"

interface MultipleFileUploadProps {
  id: string
  onChange: (files: File[]) => void
  value: File[]
  error?: string
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
}

export default function MultipleFileUpload({
  id,
  onChange,
  value,
  error,
  accept = "image/*",
  maxSize = 1048576,
  maxFiles = 3,
}: MultipleFileUploadProps) {
  const [fileError, setFileError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])

    if (newFiles.length === 0) return

    // Check if adding these files would exceed the limit
    if (value.length + newFiles.length > maxFiles) {
      setFileError(`Không thể tải lên quá ${maxFiles} file`)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    // Validate each file
    let hasError = false

    for (const file of newFiles) {
      // Check file type
      const fileType = file.type.toLowerCase()
      const isImage = fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png")

      if (!isImage) {
        setFileError("Chỉ chấp nhận file .jpg, .jpeg, .png")
        hasError = true
        break
      }

      // Check file size
      if (file.size > maxSize) {
        setFileError(`Kích thước file không được lớn hơn ${maxSize / 1048576}MB`)
        hasError = true
        break
      }
    }

    if (hasError) {
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setFileError("")
    onChange([...value, ...newFiles])

    // Reset input
    if (inputRef.current) inputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {value.map((file, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
            <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Xóa file"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="bg-white border-gray-300 hover:bg-gray-50"
          onClick={() => inputRef.current?.click()}
          disabled={value.length >= maxFiles}
        >
          Chọn File
        </Button>

        {value.length > 0 && (
          <Button
            type="button"
            variant="outline"
            className="bg-white border-gray-300 hover:bg-gray-50"
            onClick={() => onChange([])}
          >
            Xoá tất cả
          </Button>
        )}

        <input
          id={id}
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple
        />
      </div>

      {(fileError || error) && <FormError>{fileError || error}</FormError>}
    </div>
  )
}
