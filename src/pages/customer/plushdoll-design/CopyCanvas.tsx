"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ChatImage from "@/components/atoms/customer/chat/chat-show-data/ChatImage";
import CustomerService from "@/services/CustomerService";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";
import { USER_ROUTES } from "@/routes/path";

interface CopyCanvasProps {
  canvasId: string;
  canvasTitle: string;
  imageUrl: string;
  canvasDescription: string;
}

interface CopyCanvasError {
  response?: { data?: string };
}

export default function CopyCanvas({
  canvasId,
  canvasTitle,
  imageUrl,
  canvasDescription,
}: CopyCanvasProps) {
  const [copyLoading, setCopyLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const { copyCanvas } = CustomerService();

  const handleCopy = async () => {
    setCopyLoading(true);
    const uniqueTitle = `${canvasTitle}_${Math.floor(
      1000 + Math.random() * 9000
    )}_copy`;

    try {
      const res = await copyCanvas({
        canvasInfoId: canvasId,
        canvasTitle: uniqueTitle,
      });

      if (res?.statusCode === 200) {
        toast.success("Sao chép canvas thành công!");
        setCopied(true);
      } else {
        toast.error("Sao chép canvas thất bại!");
      }
    } catch (err: unknown) {
      const msg =
        (err as CopyCanvasError)?.response?.data || "Sao chép canvas thất bại!";
      toast.error(msg);
    } finally {
      setCopyLoading(false);
    }
  };

  return (
    <div>
      <ChatImage
        src={imageUrl}
        alt={canvasTitle}
        className="max-w-xs max-h-48 object-cover rounded-lg mb-2"
      />
      <div className="font-semibold flex flex-col gap-2 mt-1">
        <Link
          to={{
            pathname: `/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
          }}
          state={{
            canvasId,
            canvasTitle,
            canvasDescription,
            imageUrl,
          }}
          className="break-words hover:text-blue-600 transition-colors"
        >
          {canvasTitle}
        </Link>

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
      </div>
    </div>
  );
}
