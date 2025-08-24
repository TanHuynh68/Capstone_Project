"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChatImage from "@/components/atoms/customer/chat/chat-show-data/ChatImage";
import CanvasService from "@/services/CanvasService";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";
import { USER_ROUTES } from "@/routes/path";

interface CopyCanvasProps {
  canvasId: string;
  canvasTitle: string;
  imageUrl: string;
  canvasDescription?: string; // Thêm dòng này
  isCurrentUser?: boolean;
}

interface CopyCanvasError {
  response?: { data?: string };
}

interface CopiedCanvasData {
  canvasId: string;
  canvasTitle: string;
  canvasDescription?: string;
  isCopied: boolean;
}

export default function CopyCanvas({
  canvasId,
  canvasTitle,
  imageUrl,
  canvasDescription, // Thêm dòng này
  isCurrentUser = false,
}: CopyCanvasProps) {
  const [copyLoading, setCopyLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCanvasData, setCopiedCanvasData] =
    useState<CopiedCanvasData | null>(null);

  const { copyCanvas } = CanvasService();

  useEffect(() => {
    // Lấy thông tin canvas đã copy từ localStorage khi component mount
    const storedData = localStorage.getItem(`copied_canvas_${canvasId}`);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCopiedCanvasData(parsedData);
        setCopied(true);
      } catch (error) {
        console.error("Error parsing stored canvas data:", error);
      }
    }
  }, [canvasId]);

  useEffect(() => {
    if (copiedCanvasData) {
      // Lưu thông tin canvas đã copy vào localStorage
      localStorage.setItem(
        `copied_canvas_${canvasId}`,
        JSON.stringify(copiedCanvasData)
      );
      console.log("Copied canvas data updated:", copiedCanvasData);
    }
  }, [copiedCanvasData, canvasId]);

  const handleCopy = async () => {
    setCopyLoading(true);
    const generatedTitle = `${canvasTitle}_${Math.floor(
      1000 + Math.random() * 9000
    )}_copy`;

    try {
      const res = await copyCanvas({
        canvasInfoId: canvasId,
        canvasTitle: generatedTitle,
      });

      console.log("Copy canvas response:", res);

      const newCanvasId = res?.responseRequestModel?.canvasInfoId;
      const newCanvasTitle = res?.responseRequestModel?.canvasTitle;
      const newCanvasDescription = res?.responseRequestModel?.canvasDescription;

      console.log("Extracted canvas data:", {
        newCanvasId,
        newCanvasTitle,
        hasDescription: !!newCanvasDescription,
        descriptionLength: newCanvasDescription?.length,
      });

      if (res?.statusCode === 200 && newCanvasId) {
        const newCanvasData: CopiedCanvasData = {
          canvasId: newCanvasId,
          canvasTitle: newCanvasTitle || generatedTitle,
          canvasDescription: newCanvasDescription,
          isCopied: true,
        };

        console.log("Setting new canvas data:", newCanvasData);
        setCopiedCanvasData(newCanvasData);
        toast.success("Sao chép canvas thành công!");
        setCopied(true);
      } else {
        console.error("Copy canvas failed - invalid response:", res);
        toast.error("Sao chép canvas thất bại!");
      }
    } catch (err: unknown) {
      console.error("Copy canvas error:", err);
      const msg =
        (err as CopyCanvasError)?.response?.data || "Sao chép canvas thất bại!";
      toast.error(msg);
    } finally {
      setCopyLoading(false);
    }
  };

  // Xác định canvas data để hiển thị link
  const getCanvasDataForLink = () => {
    if (copiedCanvasData) {
      // Nếu đã copy, sử dụng thông tin canvas đã copy
      const data = {
        canvasId: copiedCanvasData.canvasId,
        canvasTitle: copiedCanvasData.canvasTitle,
        canvasDescription: copiedCanvasData.canvasDescription,
        isCopied: true,
      };
      console.log("Using copied canvas data for link:", data);
      return data;
    } else if (isCurrentUser) {
      // Nếu là canvas của user hiện tại, sử dụng thông tin gốc
      const data = {
        canvasId: canvasId,
        canvasTitle: canvasTitle,
        canvasDescription: canvasDescription, // Sử dụng props
        isCopied: false,
      };
      console.log("Using original canvas data for link:", data);
      return data;
    }
    console.log("No canvas data available for link");
    return null;
  };

  const canvasDataForLink = getCanvasDataForLink();

  return (
    <div>
      <ChatImage
        src={imageUrl}
        alt={canvasTitle}
        className="max-w-xs max-h-48 object-cover rounded-lg mb-2"
      />
      <div className="font-semibold flex flex-col gap-2 mt-1">
        {canvasDataForLink ? (
          <Link
            to={{
              pathname: `/${USER_ROUTES.CANVAS_PAGE}/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
            }}
            state={{
              canvasId: canvasDataForLink.canvasId,
              canvasTitle: canvasDataForLink.canvasTitle,
              canvasDescription: canvasDataForLink.canvasDescription,
              isCopied: canvasDataForLink.isCopied,
            }}
            className="break-words text-blue-600 hover:text-blue-800 transition-colors font-semibold"
          >
            {canvasDataForLink.canvasTitle}
          </Link>
        ) : (
          <span className="break-words text-gray-500 font-semibold">
            {canvasTitle}
          </span>
        )}

        {!isCurrentUser && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-200 flex items-center text-sm self-end"
            disabled={copyLoading || copied}
          >
            {copyLoading ? (
              <Player
                src="/lottiefiles/Animation_Copy_Loading.json"
                style={{ height: 24, width: 24 }}
                loop
                autoplay
              />
            ) : copied ? (
              <Player
                src="/lottiefiles/Animation_Copy_Success.json"
                style={{ height: 24, width: 24 }}
                autoplay
              />
            ) : (
              <>
                <Player
                  src="/lottiefiles/Animation_Copy_Success.json"
                  style={{ height: 24, width: 24 }}
                  // autoplay
                />
              </>
            )}
            {copied ? "Đã tạo bản sao" : "Tạo bản sao"}
          </button>
        )}
      </div>
    </div>
  );
}
