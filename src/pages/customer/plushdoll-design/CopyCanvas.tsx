"use client";

import { useEffect, useState } from "react";
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
  isCurrentUser?: boolean;
}

interface CopyCanvasError {
  response?: { data?: string };
}

export default function CopyCanvas({
  canvasId,
  canvasTitle,
  imageUrl,
  canvasDescription,
  isCurrentUser = false,
}: CopyCanvasProps) {
  const [copyLoading, setCopyLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [idCanvas, setIdCanvas] = useState<string | null>(null);
  const [uniqueTitleHeader, setUniqueTitleHeader] = useState<string | null>(
    null
  );
  const [uniqueTitle, setUniqueTitle] = useState<string | null>(null);

  const { copyCanvas } = CustomerService();

  useEffect(() => {
    // Lấy idCanvas từ localStorage khi component mount
    const storedId = localStorage.getItem(`copied_canvas_${canvasId}`);
    if (storedId) {
      setIdCanvas(storedId);
      setCopied(true);
    }
  }, [canvasId]);

  useEffect(() => {
    if (idCanvas) {
      // Lưu idCanvas vào localStorage khi có id mới
      localStorage.setItem(`copied_canvas_${canvasId}`, idCanvas);
      console.log("idCanvas updated:", idCanvas);
      // Maybe redirect or do something with the new canvas
    }
  }, [idCanvas, canvasId]);

  const handleCopy = async () => {
    setCopyLoading(true);
    const generatedTitle = `${canvasTitle}_${Math.floor(
      1000 + Math.random() * 9000
    )}_copy`;
    setUniqueTitle(generatedTitle);

    try {
      const res = await copyCanvas({
        canvasInfoId: canvasId,
        canvasTitle: generatedTitle,
      });

      const newId = res?.responseRequestModel?.canvasInfoId;
      setIdCanvas(newId);

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
        {idCanvas ? (
          <Link
            to={{
              pathname: `/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
            }}
            state={{
              canvasId: idCanvas,
            }}
            className="break-words text-blue-600 hover:text-blue-800 transition-colors font-semibold"
          >
            {canvasTitle}
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
        {/* <button
          onClick={() =>
            console.log(
              canvasId,
              // canvasTitle,
              // canvasDescription,
              // imageUrl,
              "asdasd"
            )
          }
        >
          asdasd
        </button> */}
      </div>
    </div>
  );
}
