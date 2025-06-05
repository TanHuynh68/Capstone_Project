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
  const [idCanvas, setIdCanvas] = useState<string | null>(null);
  const { copyCanvas } = CustomerService();

  useEffect(() => {
    if (idCanvas) {
      console.log("idCanvas updated:", idCanvas);
      // Maybe redirect or do something with the new canvas
    }
  }, [idCanvas]);

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

      const newId = res?.responseRequestModel?.canvasInfoId;
      setIdCanvas(newId);
      console.log(newId, "newly created canvas ID");
      console.log(idCanvas, "idCanvas");

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
        {copied && idCanvas && (
          <Link
            to={{
              pathname: `/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
            }}
            state={{
              canvasId: idCanvas,
              canvasTitle,
              canvasDescription,
              imageUrl,
            }}
            className="break-words hover:text-blue-600 transition-colors"
          >
            {canvasTitle}
          </Link>
        )}

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
