import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Upload, Play, Pause } from "lucide-react";
import { toast } from "sonner";

export interface MediaUploadData {
  file: File;
  description: string;
  type: "image" | "video";
}

interface ImageUploadWithDescriptionsProps {
  title?: string;
  subtitle?: string;
  maxFiles?: number;
  minFiles?: number;
  required?: boolean;
  onImagesChange: (images: MediaUploadData[]) => void;
  initialImages?: MediaUploadData[];
  className?: string;
  disabled?: boolean;
  showValidation?: boolean;
  validationErrors?: string[];
}

const ImageUploadWithDescriptions: React.FC<
  ImageUploadWithDescriptionsProps
> = ({
  title = "Tải ảnh minh chứng",
  subtitle = "Tải lên ảnh minh chứng (tối thiểu 1 file)",
  maxFiles = 3,
  minFiles = 1,
  required = true,
  onImagesChange,
  initialImages = [],
  className = "",
  disabled = false,
  showValidation = false,
  validationErrors = [],
}) => {
  const [files, setFiles] = useState<(File | undefined)[]>(
    initialImages.length > 0
      ? initialImages.map((img) => img.file)
      : [undefined]
  );
  const [previews, setPreviews] = useState<string[]>(
    initialImages.length > 0
      ? initialImages.map((img) => {
          try {
            return URL.createObjectURL(img.file);
          } catch (error) {
            console.error("Error creating object URL:", error);
            return "";
          }
        })
      : [""]
  );

  const [descriptions, setDescriptions] = useState<string[]>(
    initialImages.length > 0
      ? initialImages.map((img) => img.description)
      : [""]
  );
  const [fileTypes, setFileTypes] = useState<("image" | "video")[]>(
    initialImages.length > 0 ? initialImages.map((img) => img.type) : ["image"]
  );
  const [errors, setErrors] = useState<string[]>(
    initialImages.length > 0 ? new Array(initialImages.length).fill("") : [""]
  );
  const [videoPlaying, setVideoPlaying] = useState<boolean[]>(
    new Array(initialImages.length > 0 ? initialImages.length : 1).fill(false)
  );
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Cleanup effect to revoke URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all preview URLs to prevent memory leaks
      previews.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleFileChange = (idx: number, file: File | null) => {
    if (disabled) return;

    // Revoke old preview URL to prevent memory leaks
    if (previews[idx]) {
      URL.revokeObjectURL(previews[idx]);
    }

    if (file) {
      const isVideo = file.type.startsWith("video/");

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[idx] = file;
        return newFiles;
      });

      setFileTypes((prev) => {
        const newFileTypes = [...prev];
        newFileTypes[idx] = isVideo ? "video" : "image";
        return newFileTypes;
      });

      setVideoPlaying((prev) => {
        const newVideoPlaying = [...prev];
        newVideoPlaying[idx] = false;
        return newVideoPlaying;
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[idx] = ev.target?.result as string;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[idx] = undefined;
        return newFiles;
      });

      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[idx] = "";
        return newPreviews;
      });

      setFileTypes((prev) => {
        const newFileTypes = [...prev];
        newFileTypes[idx] = "image";
        return newFileTypes;
      });

      setVideoPlaying((prev) => {
        const newVideoPlaying = [...prev];
        newVideoPlaying[idx] = false;
        return newVideoPlaying;
      });
    }

    // Clear errors
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[idx] = "";
      return newErrors;
    });

    // Notify parent component
    const updatedFiles = [...files];
    const updatedFileTypes = [...fileTypes];

    if (file) {
      updatedFiles[idx] = file;
      updatedFileTypes[idx] = file.type.startsWith("video/")
        ? "video"
        : "image";
    } else {
      updatedFiles[idx] = undefined;
      updatedFileTypes[idx] = "image";
    }

    const validImages = updatedFiles
      .map((file, index) =>
        file
          ? {
              file,
              description: descriptions[index],
              type: updatedFileTypes[index],
            }
          : null
      )
      .filter(Boolean) as MediaUploadData[];
    onImagesChange(validImages);
  };

  const handleDescriptionChange = (idx: number, value: string) => {
    if (disabled) return;

    const newDescriptions = [...descriptions];
    newDescriptions[idx] = value;
    setDescriptions(newDescriptions);
    setErrors((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });

    // Notify parent component
    const validImages = files
      .map((file, index) =>
        file
          ? {
              file,
              description: newDescriptions[index],
              type: fileTypes[index],
            }
          : null
      )
      .filter(Boolean) as MediaUploadData[];
    onImagesChange(validImages);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (files.length < maxFiles) {
      setFiles([...files, undefined]);
      setPreviews([...previews, ""]);
      setDescriptions([...descriptions, ""]);
      setFileTypes([...fileTypes, "image"]);
      setVideoPlaying([...videoPlaying, false]);
      setErrors([...errors, ""]);
    }
  };

  const triggerFileInput = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.jpg,.jpeg";
    input.multiple = false;
    input.capture = "environment"; // Cho phép chụp ảnh trực tiếp từ camera
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Chặn video hoàn toàn
        if (file.type.startsWith("video/")) {
          toast.error("Không chấp nhận video", {
            description: "Chỉ cho phép tải ảnh định dạng PNG hoặc JPEG",
          });
          return;
        }

        // Kiểm tra kích thước file (giới hạn 1MB)
        if (file.size > 1 * 1024 * 1024) {
          toast.error("File quá lớn", {
            description: "Mỗi ảnh không được vượt quá 1MB",
          });
          return;
        }

        // Kiểm tra định dạng file (chỉ PNG/JPEG)
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(file.type)) {
          toast.error("Định dạng file không hợp lệ", {
            description: "Chỉ chấp nhận PNG, JPEG hoặc JPG",
          });
          return;
        }

        handleFileChange(index, file);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    if (disabled) return;

    // Stop video if playing
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.pause();
    }

    // Revoke old preview URL to prevent memory leaks
    if (previews[index]) {
      try {
        URL.revokeObjectURL(previews[index]);
      } catch (error) {
        console.error("Error revoking URL:", error);
      }
    }

    // Update all states at once
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = undefined;
      return newFiles;
    });

    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = "";
      return newPreviews;
    });

    setFileTypes((prev) => {
      const newFileTypes = [...prev];
      newFileTypes[index] = "image";
      return newFileTypes;
    });

    setVideoPlaying((prev) => {
      const newVideoPlaying = [...prev];
      newVideoPlaying[index] = false;
      return newVideoPlaying;
    });

    setDescriptions((prev) => {
      const newDescriptions = [...prev];
      newDescriptions[index] = "";
      return newDescriptions;
    });

    // Clear errors for this index
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = "";
      return newErrors;
    });

    // Notify parent component
    const updatedFiles = [...files];
    const updatedDescriptions = [...descriptions];
    const updatedFileTypes = [...fileTypes];

    updatedFiles[index] = undefined;
    updatedDescriptions[index] = "";
    updatedFileTypes[index] = "image";

    const validImages = updatedFiles
      .map((file, idx) =>
        file
          ? {
              file,
              description: updatedDescriptions[idx],
              type: updatedFileTypes[idx],
            }
          : null
      )
      .filter(Boolean) as MediaUploadData[];

    onImagesChange(validImages);
  };

  const handleVideoPlay = (index: number) => {
    const newVideoPlaying = [...videoPlaying];
    newVideoPlaying[index] = true;
    setVideoPlaying(newVideoPlaying);
  };

  const handleVideoPause = (index: number) => {
    const newVideoPlaying = [...videoPlaying];
    newVideoPlaying[index] = false;
    setVideoPlaying(newVideoPlaying);
  };

  const handleVideoEnded = (index: number) => {
    const newVideoPlaying = [...videoPlaying];
    newVideoPlaying[index] = false;
    setVideoPlaying(newVideoPlaying);
  };

  const toggleVideoPlay = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const validateImages = (): boolean => {
    const newErrors = files.map((file, i) => {
      if (!file && i < minFiles) {
        return "Vui lòng chọn ảnh hoặc video!";
      } else if (file && !descriptions[i]?.trim()) {
        return "Vui lòng nhập mô tả!";
      }
      return "";
    });

    setErrors(newErrors);
    return !newErrors.some((error) => error !== "");
  };

  // Expose validation method
  const ref = React.useRef<{
    validate: () => boolean;
    getImages: () => MediaUploadData[];
  }>(null);
  React.useImperativeHandle(ref, () => ({
    validate: validateImages,
    getImages: () =>
      files
        .map((file, index) =>
          file
            ? { file, description: descriptions[index], type: fileTypes[index] }
            : null
        )
        .filter(Boolean) as MediaUploadData[],
  }));

  return (
    <Card className={`shadow-sm border-border ${className}`}>
      <CardHeader className="bg-gradient-to-r rounded-t-lg">
        {title && (
          <div className="text-lg flex items-center gap-2 text-foreground mb-2">
            <div className="w-2 h-2 bg-green-600 dark:bg-primary rounded-full"></div>
            {title}
          </div>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-3 gap-6">
          {files.map((_, idx) => (
            <div key={idx} className="space-y-3">
              <div className="relative group">
                <div
                  className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                    previews[idx]
                      ? "border-green-300 bg-green-50 dark:border-primary dark:bg-primary/10"
                      : errors[idx] || (showValidation && validationErrors[idx])
                      ? "border-red-300 bg-red-50 dark:border-destructive dark:bg-destructive/10"
                      : "border-border hover:border-primary hover:bg-accent"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {previews[idx] ? (
                    <div className="relative">
                      {fileTypes[idx] === "video" ? (
                        <div className="relative">
                          <video
                            ref={(el) => {
                              videoRefs.current[idx] = el;
                            }}
                            src={previews[idx]}
                            className="w-full h-32 object-contain rounded-lg shadow-sm"
                            onPlay={() => handleVideoPlay(idx)}
                            onPause={() => handleVideoPause(idx)}
                            onEnded={() => handleVideoEnded(idx)}
                            onClick={(e) => toggleVideoPlay(idx, e)}
                          />
                          {!videoPlaying[idx] && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-40 transition-all duration-200"
                              onClick={(e) => toggleVideoPlay(idx, e)}
                            >
                              <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                                <Play className="h-6 w-6 text-gray-800 ml-0.5" />
                              </div>
                            </div>
                          )}
                          {videoPlaying[idx] && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                <Pause className="h-3 w-3 inline mr-1" />
                                Đang phát
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <img
                          src={previews[idx] || "/placeholder.svg"}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-contain rounded-lg shadow-sm"
                        />
                      )}
                      {!disabled && previews[idx] && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute cursor-pointer -top-1 -right-1 h-5 w-5 rounded-full shadow-md opacity-90 hover:opacity-100 transition-all z-10 bg-red-500 hover:bg-red-600 hover:scale-110"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                        >
                          <X className="h-3 w-3 text-white" />
                        </Button>
                      )}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                          {files[idx]?.name ||
                            `${fileTypes[idx] === "video" ? "Video" : "Ảnh"} ${
                              idx + 1
                            }`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center h-32 transition-transform ${
                        !disabled
                          ? "cursor-pointer group-hover:scale-105"
                          : "cursor-not-allowed"
                      }`}
                      onClick={(e) => triggerFileInput(idx, e)}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                          Chọn ảnh {idx + 1}{" "}
                        {required && idx < minFiles && (
                          <span className="text-destructive">*</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                          PNG, JPG, JPEG (≤ 1MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description input below each image */}
              <div>
                <Label
                  htmlFor={`description-${idx}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Mô tả ảnh {idx + 1}{" "}
                  {required && previews[idx] && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Textarea
                  id={`description-${idx}`}
                  value={descriptions[idx]}
                  onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                  placeholder={`Mô tả cho ảnh ${idx + 1}...`}
                  className={`mt-1 text-sm resize-none ${
                    errors[idx] || (showValidation && validationErrors[idx])
                      ? "border-destructive focus:border-destructive bg-destructive/10"
                      : ""
                  }`}
                  disabled={!previews[idx] || disabled}
                  rows={2}
                />

                {(errors[idx] || (showValidation && validationErrors[idx])) && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors[idx] || validationErrors[idx]}
                  </p>
                )}
              </div>
            </div>
          ))}

          {files.length < maxFiles && (
            <div className="space-y-3">
              <div
                className={`border-2 border-dashed border-border rounded-xl p-4 transition-all duration-200 hover:border-primary hover:bg-accent ${
                  !disabled
                    ? "cursor-pointer group"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={handleAdd}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center justify-center h-32 group-hover:scale-105 transition-transform">
                  <div className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors flex items-center justify-center">
                    <span className="text-2xl font-bold">+</span>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    Thêm ảnh
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Tối đa {maxFiles} ảnh
                  </p>
                </div>
              </div>
              <div className="h-[calc(2rem+1px)]"></div>{" "}
              {/* Spacer to align with description inputs */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadWithDescriptions;
