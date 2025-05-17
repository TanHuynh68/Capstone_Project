"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import FormError from "@/components/atoms/post/customer-upload-post/FormError"

interface FileUploadProps {
  id: string
  onChange: (file: File | null) => void
  value: File | null
  error?: string
  accept?: string
  maxSize?: number // in bytes
}

export default function FileUpload({
  id,
  onChange,
  value,
  error,
  accept = "image/*",
  maxSize = 1048576,
}: FileUploadProps) {
  const [fileError, setFileError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      onChange(null)
      setFileError("")
      return
    }

    // Check file type
    const fileType = file.type.toLowerCase()
    const isImage = fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png")

    if (!isImage) {
      setFileError("Chỉ chấp nhận file .jpg, .jpeg, .png")
      onChange(null)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    // Check file size
    if (file.size > maxSize) {
      setFileError(`Kích thước file không được lớn hơn ${maxSize / 1048576}MB`)
      onChange(null)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setFileError("")
    onChange(file)
  }

  const clearFile = () => {
    onChange(null)
    setFileError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="bg-white border-gray-300 hover:bg-gray-50"
          onClick={() => inputRef.current?.click()}
        >
          Chọn File
        </Button>

        {value && (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
            <span className="text-sm text-gray-700 truncate max-w-[200px]">{value.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Xóa file"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <input id={id} ref={inputRef} type="file" className="hidden" onChange={handleFileChange} accept={accept} />
      </div>

      {(fileError || error) && <FormError>{fileError || error}</FormError>}
    </div>
  )
}
