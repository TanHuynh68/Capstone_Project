"use client";
import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Ruler, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CanvasListInPage from "@/pages/customer/plushdoll-design/get-canvas/CanvasListInPage";
import { USER_ROUTES } from "@/routes/path";
import CanvasService from "@/services/CanvasService";
import ChatAIHomePage from "@/pages/customer/chat-ai-homepage";

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
  suggestedCanvas: {
    width: number;
    height: number;
  };
}

type Unit = "px" | "cm" | "mm";

export default function CanvasPage() {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageWidth, setImageWidth] = useState<number[]>([1000]);
  const [imageHeight, setImageHeight] = useState<number[]>([1000]);
  const [canvasWidth, setCanvasWidth] = useState<number>(1200);
  const [canvasHeight, setCanvasHeight] = useState<number>(1200);
  const [unit, setUnit] = useState<Unit>("px");
  const [dpi] = useState(300); // Standard print DPI
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folderNameInput, setFolderNameInput] = useState("");
  const { postFolderCanvas, postCanvas } = CanvasService();

  // Canvas selection state
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>("");

  // Unit conversion functions
  const pxToCm = (px: number): number => {
    return Math.round(((px * 2.54) / dpi) * 10) / 10;
  };

  const pxToMm = (px: number): number => {
    return Math.round(((px * 25.4) / dpi) * 10) / 10;
  };

  const cmToPx = (cm: number): number => {
    return Math.round((cm * dpi) / 2.54);
  };

  const mmToPx = (mm: number): number => {
    return Math.round((mm * dpi) / 25.4);
  };

  const convertValue = (
    value: number,
    fromUnit: Unit,
    toUnit: Unit
  ): number => {
    if (fromUnit === toUnit) return value;

    // Convert to px first
    let pxValue = value;
    if (fromUnit === "cm") pxValue = cmToPx(value);
    if (fromUnit === "mm") pxValue = mmToPx(value);

    // Convert from px to target unit
    if (toUnit === "cm") return pxToCm(pxValue);
    if (toUnit === "mm") return pxToMm(pxValue);
    return pxValue;
  };

  const formatDimension = (px: number, unit: Unit): string => {
    const value = convertValue(px, "px", unit);
    return `${value}${unit}`;
  };

  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const calculateCanvasSize = (imgWidth: number, imgHeight: number) => {
    // Canvas should be larger than image to provide workspace
    const padding = 200; // 200px padding around image
    const newCanvasWidth = imgWidth + padding;
    const newCanvasHeight = imgHeight + padding;

    setCanvasWidth(newCanvasWidth);
    setCanvasHeight(newCanvasHeight);
  };

  // Update canvas size when image dimensions change
  useEffect(() => {
    const currentImageWidthPx =
      unit === "px"
        ? imageWidth[0]
        : unit === "cm"
        ? cmToPx(imageWidth[0])
        : mmToPx(imageWidth[0]);
    const currentImageHeightPx =
      unit === "px"
        ? imageHeight[0]
        : unit === "cm"
        ? cmToPx(imageHeight[0])
        : mmToPx(imageHeight[0]);

    calculateCanvasSize(currentImageWidthPx, currentImageHeightPx);
  }, [imageWidth, imageHeight, unit]);

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = calculateAspectRatio(img.width, img.height);
        const suggestedCanvas = {
          width: img.width + 200,
          height: img.height + 200,
        };

        setImageDimensions({
          width: img.width,
          height: img.height,
          aspectRatio,
          suggestedCanvas,
        });

        // Set initial image dimensions to original size
        setImageWidth([img.width]);
        setImageHeight([img.height]);

        // Calculate initial canvas size
        calculateCanvasSize(img.width, img.height);
      };
      img.src = e.target?.result as string;
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (imageFile) {
        handleImageLoad(imageFile);
      }
    },
    [handleImageLoad]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageLoad(file);
      }
    },
    [handleImageLoad]
  );

  const resetUpload = () => {
    setUploadedImage(null);
    setImageDimensions(null);
    setImageWidth([1000]);
    setImageHeight([1000]);
    setCanvasWidth(1200);
    setCanvasHeight(1200);
    setFolderNameInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createCanvas = async () => {
    console.log("createCanvas");
    const finalImageWidthPx =
      unit === "px"
        ? imageWidth[0]
        : unit === "cm"
        ? cmToPx(imageWidth[0])
        : mmToPx(imageWidth[0]);
    const finalImageHeightPx =
      unit === "px"
        ? imageHeight[0]
        : unit === "cm"
        ? cmToPx(imageHeight[0])
        : mmToPx(imageHeight[0]);

    try {
      console.log("CanvasService", CanvasService);
      // Create a new folder with input name or default name
      const defaultFolderName = `Thư mục thiết kế ${new Date().toLocaleDateString()}`;
      const folderName = folderNameInput.trim() || defaultFolderName;
      console.log("Trước khi gọi CanvasService");

      // 1. Tạo folder
      const response = await postFolderCanvas({
        folderName: folderName,
      });
      console.log("response", response);

      if (
        response?.statusCode === 200 &&
        response?.responseRequestModel?.canvasFolderId
      ) {
        const newFolderId = response.responseRequestModel.canvasFolderId;

        // 2. Tạo canvas đầu tiên trong folder
        const canvasResponse = await postCanvas({
          canvasFolderId: newFolderId,
          canvasTitle: "Thiết kế 1",
          canvasDescription: JSON.stringify({
            version: "5.5.2",
            objects: [],
            background: "#ffffff",
            width: canvasWidth,
            height: canvasHeight,
            imageWidth: finalImageWidthPx,
            imageHeight: finalImageHeightPx,
          }),
        });
        if (
          canvasResponse?.isSuccess &&
          canvasResponse?.responseRequestModel?.canvasInfoId
        ) {
          // Navigate to plushdoll design with the new folder
          navigate(USER_ROUTES.PLUSHDOLL_DESIGN, {
            state: {
              canvasId: canvasResponse.responseRequestModel.canvasInfoId,
              canvasTitle:
                canvasResponse.responseRequestModel.canvasTitle || "Thiết kế 1",
              canvasDescription:
                canvasResponse.responseRequestModel.canvasDescription ||
                JSON.stringify({
                  version: "5.5.2",
                  objects: [],
                  background: "#ffffff",
                  width: canvasWidth,
                  height: canvasHeight,
                  imageWidth: finalImageWidthPx,
                  imageHeight: finalImageHeightPx,
                }),
              // Các trường khác nếu cần
            },
          });
        } else {
          // toast.error("Tạo canvas đầu tiên thất bại!");
        }
      } else {
        // toast.error("Không thể tạo thư mục mới");
      }
    } catch (error) {
      console.error("Error creating folder or canvas:", error);
      // toast.error("Có lỗi xảy ra khi tạo thư mục hoặc canvas");
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    const currentImageWidthPx =
      unit === "px"
        ? imageWidth[0]
        : unit === "cm"
        ? cmToPx(imageWidth[0])
        : mmToPx(imageWidth[0]);
    const currentImageHeightPx =
      unit === "px"
        ? imageHeight[0]
        : unit === "cm"
        ? cmToPx(imageHeight[0])
        : mmToPx(imageHeight[0]);

    setUnit(newUnit);
    setImageWidth([
      Math.round(convertValue(currentImageWidthPx, "px", newUnit) * 10) / 10,
    ]);
    setImageHeight([
      Math.round(convertValue(currentImageHeightPx, "px", newUnit) * 10) / 10,
    ]);
  };

  const getCurrentImageWidthPx = () => {
    return unit === "px"
      ? imageWidth[0]
      : unit === "cm"
      ? cmToPx(imageWidth[0])
      : mmToPx(imageWidth[0]);
  };

  const getCurrentImageHeightPx = () => {
    return unit === "px"
      ? imageHeight[0]
      : unit === "cm"
      ? cmToPx(imageHeight[0])
      : mmToPx(imageHeight[0]);
  };

  // Định nghĩa giá trị tối đa theo cm, px, mm
  const MAX_WIDTH_CM = 100;
  const MAX_HEIGHT_CM = 150;
  const MAX_WIDTH_PX = cmToPx(MAX_WIDTH_CM);
  const MAX_HEIGHT_PX = cmToPx(MAX_HEIGHT_CM);
  const MAX_WIDTH_MM = MAX_WIDTH_CM * 10;
  const MAX_HEIGHT_MM = MAX_HEIGHT_CM * 10;

  const getSliderMax = () => {
    switch (unit) {
      case "cm":
        return MAX_WIDTH_CM;
      case "mm":
        return MAX_WIDTH_MM;
      default:
        return MAX_WIDTH_PX;
    }
  };

  const getSliderMaxHeight = () => {
    switch (unit) {
      case "cm":
        return MAX_HEIGHT_CM;
      case "mm":
        return MAX_HEIGHT_MM;
      default:
        return MAX_HEIGHT_PX;
    }
  };

  const getSliderMin = () => {
    switch (unit) {
      case "cm":
        return 1;
      case "mm":
        return 10;
      default:
        return 50;
    }
  };

  const getSliderStep = () => {
    switch (unit) {
      case "cm":
        return 0.1;
      case "mm":
        return 1;
      default:
        return 10;
    }
  };

  const handleCanvasSelect = (
    canvasDescription: string,
    canvasTitle: string,
    canvasId: string,
    folderId?: string
  ) => {
    setSelectedCanvasId(canvasId);
    console.log("Selected canvas:", {
      canvasId,
      canvasTitle,
      canvasDescription,
      folderId,
    });

    // Navigate to plushdoll design with the selected folder and canvas info
    navigate(USER_ROUTES.PLUSHDOLL_DESIGN, {
      state: {
        canvasFolderId: folderId || canvasId, // Use folderId if available, otherwise use canvasId
        selectedCanvasId: canvasId,
        canvasDescription: canvasDescription, // Pass canvas description to load
        canvasTitle: canvasTitle, // Pass canvas title
        hasExistingCanvas: !!canvasDescription, // Flag to indicate if there's existing canvas data
      },
    });
  };

  const handlePresetSelect = ({
    width,
    height,
    imageUrl,
  }: {
    width: number;
    height: number;
    imageUrl?: string;
  }) => {
    setUploadedImage(imageUrl || "_preset_");
    setImageDimensions({
      width,
      height,
      aspectRatio: calculateAspectRatio(width, height),
      suggestedCanvas: { width: width + 200, height: height + 200 },
    });
    setImageWidth([width]);
    setImageHeight([height]);
    setCanvasWidth(width + 200);
    setCanvasHeight(height + 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100">
      {/* Header */}
      {/* <header className="flex justify-end p-4">
        <Button
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <Crown className="w-4 h-4 mr-2" />
          Nâng cấp gói đăng ký
        </Button>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-0">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Upload ảnh Labubu để tạo canvas
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Điều chỉnh kích thước ảnh, canvas sẽ tự động thay đổi theo
          </p>
        </div>

        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto">
            {/* Labubu Size Presets */}
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Charm nhỏ */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white hover:bg-orange-50 border-2 hover:border-orange-300"
                  onClick={() => {
                    handlePresetSelect({
                      width: 600,
                      height: 600,
                      imageUrl: "/images/labubu-moc-khoa.png",
                    });
                  }}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-28 h-28 mx-auto mb-2">
                      <img
                        src="/images/labubu-moc-khoa.png"
                        alt="Móc khóa Labubu"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">
                      Móc khóa Labubu
                    </h4>
                    <p className="text-xs text-gray-600">600×600px</p>
                    <p className="text-xs text-gray-500">~21×21cm (8.3×8.3")</p>
                  </CardContent>
                </Card>

                {/* Plush trung */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white hover:bg-purple-50 border-2 hover:border-purple-300"
                  onClick={() => {
                    handlePresetSelect({
                      width: 1400,
                      height: 1400,
                      imageUrl: "/images/labubu-vua.png",
                    });
                  }}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-28 h-28 mx-auto mb-2">
                      <img
                        src="/images/labubu-vua.png"
                        alt="Labubu vừa"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">
                      Labubu vừa
                    </h4>
                    <p className="text-xs text-gray-600">1400×1400px</p>
                    <p className="text-xs text-gray-500">
                      ~49×49cm (19.3×19.3")
                    </p>
                  </CardContent>
                </Card>

                {/* Labubu 400% */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white hover:bg-blue-50 border-2 hover:border-blue-300"
                  onClick={() => {
                    handlePresetSelect({
                      width: 1008,
                      height: 1008,
                      imageUrl: "/images/labubu-400%.png",
                    });
                  }}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-28 h-28 mx-auto mb-2">
                      <img
                        src="/images/labubu-400%.png"
                        alt="Labubu 400%"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">
                      Labubu 400%
                    </h4>
                    <p className="text-xs text-gray-600">1008×1008px</p>
                    <p className="text-xs text-gray-500">
                      ~35.6×35.6cm (14×14")
                    </p>
                  </CardContent>
                </Card>

                {/* Labubu 1000% */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white hover:bg-pink-50 border-2 hover:border-pink-300"
                  onClick={() => {
                    handlePresetSelect({
                      width: 2268,
                      height: 2268,
                      imageUrl: "/images/labubu-1000%.png",
                    });
                  }}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-28 h-28 mx-auto mb-2">
                      <img
                        src="/images/labubu-1000%.png"
                        alt="Labubu 1000%"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">
                      Labubu 1000%
                    </h4>
                    <p className="text-xs text-gray-600">2268×2268px</p>
                    <p className="text-xs text-gray-500">
                      ~80×80cm (31.2×31.2")
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upload Area */}
            <Card>
              <CardContent className="p-2">
                <div
                  className={`border-2 border-dashed rounded-lg p-3 text-center transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Kéo thả hoặc click để chọn ảnh Labubu
                  </h3>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ: PNG, JPG, JPEG • Tối đa 1MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Image Analysis & Canvas Setup */
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Original Image Info + Image Size Controls */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Ảnh Labubu của bạn
                    </h3>
                    <Button variant="ghost" size="icon" onClick={resetUpload}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={
                        uploadedImage && uploadedImage !== "_preset_"
                          ? uploadedImage
                          : imageDimensions && imageDimensions.width === 600
                          ? "/images/labubu-moc-khoa.png"
                          : imageDimensions && imageDimensions.width === 1400
                          ? "/images/labubu-vua.png"
                          : imageDimensions && imageDimensions.width === 1008
                          ? "/images/labubu-400%.png"
                          : imageDimensions && imageDimensions.width === 2268
                          ? "/images/labubu-1000%.png"
                          : "/placeholder.svg"
                      }
                      alt="Uploaded Labubu"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </div>

                  {/* Original Image Dimensions */}
                  {imageDimensions && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        Kích thước ảnh gốc
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {imageDimensions.width} × {imageDimensions.height}px
                        </p>
                        <p>
                          {formatDimension(imageDimensions.width, "cm")} ×{" "}
                          {formatDimension(imageDimensions.height, "cm")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image Size Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">
                        🖼️ Kích thước ảnh mong muốn
                      </h4>
                      <Select value={unit} onValueChange={handleUnitChange}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="mm">mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Width Controls */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiều rộng ({unit})
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={imageWidth[0]}
                            onChange={(e) => {
                              const value =
                                Number.parseFloat(e.target.value) || 0;
                              const max = getSliderMax();
                              setImageWidth([value > max ? max : value]);
                            }}
                            min={getSliderMin()}
                            max={getSliderMax()}
                            step={getSliderStep()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            {unit}
                          </span>
                        </div>
                        <div className="flex-1">
                          <Slider
                            value={imageWidth}
                            onValueChange={(val) => {
                              const max = getSliderMax();
                              setImageWidth([val[0] > max ? max : val[0]]);
                            }}
                            max={getSliderMax()}
                            min={getSliderMin()}
                            step={getSliderStep()}
                            className="w-full"
                          />
                        </div>
                      </div>
                      {unit !== "px" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {getCurrentImageWidthPx()}px
                        </p>
                      )}
                    </div>

                    {/* Height Controls */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiều cao ({unit})
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={imageHeight[0]}
                            onChange={(e) => {
                              const value =
                                Number.parseFloat(e.target.value) || 0;
                              const max = getSliderMaxHeight();
                              setImageHeight([value > max ? max : value]);
                            }}
                            min={getSliderMin()}
                            max={getSliderMaxHeight()}
                            step={getSliderStep()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            {unit}
                          </span>
                        </div>
                        <div className="flex-1">
                          <Slider
                            value={imageHeight}
                            onValueChange={(val) => {
                              const max = getSliderMaxHeight();
                              setImageHeight([val[0] > max ? max : val[0]]);
                            }}
                            max={getSliderMaxHeight()}
                            min={getSliderMin()}
                            step={getSliderStep()}
                            className="w-full"
                          />
                        </div>
                      </div>
                      {unit !== "px" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {getCurrentImageHeightPx()}px
                        </p>
                      )}
                    </div>

                    {/* Quick Actions - Right aligned */}
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (imageDimensions) {
                            const originalWidth = convertValue(
                              imageDimensions.width,
                              "px",
                              unit
                            );
                            const originalHeight = convertValue(
                              imageDimensions.height,
                              "px",
                              unit
                            );
                            setImageWidth([
                              Math.round(originalWidth * 10) / 10,
                            ]);
                            setImageHeight([
                              Math.round(originalHeight * 10) / 10,
                            ]);
                          }
                        }}
                      >
                        Kích thước gốc
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (imageDimensions) {
                            // Keep aspect ratio, fit to current width
                            const aspectRatio =
                              imageDimensions.width / imageDimensions.height;
                            const newHeight = imageWidth[0] / aspectRatio;
                            setImageHeight([Math.round(newHeight * 10) / 10]);
                          }
                        }}
                      >
                        Giữ tỉ lệ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Canvas Preview */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Canvas sẽ được tạo
                    </h3>
                  </div>

                  {imageDimensions && (
                    <div className="space-y-6">
                      {/* Canvas Size Display */}
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-3">
                          📐 Thông tin Canvas
                        </h4>
                        <div className="space-y-2 text-sm text-purple-700">
                          <div className="flex justify-between">
                            <span>Kích thước ảnh:</span>
                            <span className="font-medium">
                              {imageWidth[0]}
                              {unit} × {imageHeight[0]}
                              {unit}
                              {unit !== "px" && (
                                <span className="text-purple-600 ml-2">
                                  ({getCurrentImageWidthPx()} ×{" "}
                                  {getCurrentImageHeightPx()}px)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kích thước Canvas:</span>
                            <span className="font-medium">
                              {formatDimension(canvasWidth, unit)} ×{" "}
                              {formatDimension(canvasHeight, unit)}
                              {unit !== "px" && (
                                <span className="text-purple-600 ml-2">
                                  ({canvasWidth} × {canvasHeight}px)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vùng làm việc:</span>
                            <span className="font-medium text-green-600">
                              {formatDimension(200, unit)} padding
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Folder Name Input */}
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-sm font-medium text-gray-700"
                          htmlFor="folderNameInput"
                        >
                          Tên thư mục thiết kế
                        </label>
                        <input
                          id="folderNameInput"
                          type="text"
                          value={folderNameInput}
                          onChange={(e) => setFolderNameInput(e.target.value)}
                          placeholder="Nhập tên thư mục (tuỳ chọn)"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Canvas Visual Preview */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3">
                          👁️ Xem trước Canvas
                        </h4>
                        <div
                          className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto"
                          style={{
                            aspectRatio: `${canvasWidth}/${canvasHeight}`,
                            maxWidth: "100%",
                            width: "100%",
                            height: "min(320px, 60vw)", // Giới hạn chiều cao, tự động co theo tỉ lệ
                            display: "block",
                          }}
                        >
                          <div
                            className="absolute bg-blue-100 border border-blue-300 rounded"
                            style={{
                              left: "50%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              width: `${
                                (getCurrentImageWidthPx() / canvasWidth) * 100
                              }%`,
                              height: `${
                                (getCurrentImageHeightPx() / canvasHeight) * 100
                              }%`,
                              minWidth: "20px",
                              minHeight: "20px",
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center text-xs text-blue-600 font-medium">
                              Ảnh
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                            Canvas
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Vùng xanh là vị trí ảnh trên canvas
                        </p>
                      </div>

                      {/* Create Canvas Button */}
                      <Button
                        onClick={createCanvas}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                        size="lg"
                      >
                        Tạo Canvas & Bắt đầu thiết kế
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recent Designs Section */}
        <div className="mt-8 mb-4 px-10">
          <div className="flex items-center justify-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thiết kế gần đây
            </h2>
          </div>
          <CanvasListInPage
            onSelect={handleCanvasSelect}
            selectedCanvasId={selectedCanvasId}
          />
        </div>
      </main>
      <ChatAIHomePage />
    </div>
  );
}
