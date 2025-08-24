"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CanvasService from "@/services/CanvasService";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";
import { USER_ROUTES } from "@/routes/path";
import ChatMessage3D from "@/components/atoms/customer/chat/chat-show-data/ChatMessage3D";

interface CopyCanvas3DProps {
    canvasId: string;
    canvasTitle: string;
    canvas3DData: string;
    isCurrentUser?: boolean;
}

interface CopyCanvas3DError {
    response?: { data?: string };
}

interface CopiedCanvas3DData {
    canvasId: string;
    canvasTitle: string;
    isCopied: boolean;
}

export default function CopyCanvas3D({
    canvasId,
    canvasTitle,
    canvas3DData,
    isCurrentUser = false,
}: CopyCanvas3DProps) {
    const [copyLoading, setCopyLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedCanvasData, setCopiedCanvasData] =
        useState<CopiedCanvas3DData | null>(null);

    const { copyCanvas } = CanvasService();

    useEffect(() => {
        // Lấy thông tin canvas đã copy từ localStorage khi component mount
        const storedData = localStorage.getItem(`copied_canvas_3d_${canvasId}`);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setCopiedCanvasData(parsedData);
                setCopied(true);
            } catch (error) {
                console.error("Error parsing stored 3D canvas data:", error);
            }
        }
    }, [canvasId]);

    useEffect(() => {
        if (copiedCanvasData) {
            // Lưu thông tin canvas đã copy vào localStorage
            localStorage.setItem(
                `copied_canvas_3d_${canvasId}`,
                JSON.stringify(copiedCanvasData)
            );
            console.log("Copied 3D canvas data updated:", copiedCanvasData);
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

            console.log("Copy 3D canvas response:", res);

            const newCanvasId = res?.responseRequestModel?.canvasInfoId;
            const newCanvasTitle = res?.responseRequestModel?.canvasTitle;

            console.log("Extracted 3D canvas data:", {
                newCanvasId,
                newCanvasTitle,
            });

            if (res?.statusCode === 200 && newCanvasId) {
                const newCanvasData: CopiedCanvas3DData = {
                    canvasId: newCanvasId,
                    canvasTitle: newCanvasTitle || generatedTitle,
                    isCopied: true,
                };

                console.log("Setting new 3D canvas data:", newCanvasData);
                setCopiedCanvasData(newCanvasData);
                toast.success("Sao chép thiết kế 3D thành công!");
                setCopied(true);
            } else {
                console.error("Copy 3D canvas failed - invalid response:", res);
                toast.error("Sao chép thiết kế 3D thất bại!");
            }
        } catch (err: unknown) {
            console.error("Copy 3D canvas error:", err);
            const msg =
                (err as CopyCanvas3DError)?.response?.data || "Sao chép thiết kế 3D thất bại!";
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
                isCopied: true,
            };
            console.log("Using copied 3D canvas data for link:", data);
            return data;
        } else if (isCurrentUser) {
            // Nếu là canvas của user hiện tại, sử dụng thông tin gốc
            const data = {
                canvasId: canvasId,
                canvasTitle: canvasTitle,
                isCopied: false,
            };
            console.log("Using original 3D canvas data for link:", data);
            return data;
        }
        console.log("No 3D canvas data available for link");
        return null;
    };

    const canvasDataForLink = getCanvasDataForLink();

    return (
        <div>
            {/* Display the 3D design card */}
            <ChatMessage3D
                canvas3DData={canvas3DData}
                title={canvasTitle}
                id={canvasId}
                isOwnMessage={isCurrentUser}
                timestamp={new Date().toISOString()}
            />

                         {/* Copy functionality below the card */}
             <div className="font-semibold flex items-center justify-between mt-3">
                 <div>
                     {canvasDataForLink ? (
                         <Link
                             to={{
                                 pathname: `/${USER_ROUTES.CANVAS_PAGE}/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
                             }}
                             state={{
                                 canvas3DData: canvas3DData,
                                 title: canvasDataForLink.canvasTitle,
                                 id: canvasDataForLink.canvasId,
                                 fromChat: true,
                                 openIn3DMode: true,
                                 openCanvas3DList: true,
                                 selectedCanvas3D: {
                                     canvas3D: canvas3DData,
                                     title: canvasDataForLink.canvasTitle,
                                     id: canvasDataForLink.canvasId,
                                 },
                             }}
                             className="break-words text-white-600 hover:text-blue-800 transition-colors font-semibold truncate max-w-[200px]"
                         >
                             {canvasDataForLink.canvasTitle}
                         </Link>
                     ) : (
                         <span className="break-words text-gray-500 font-semibold truncate max-w-[200px]">
                             {canvasTitle}
                         </span>
                     )}
                 </div>

                 {!isCurrentUser && (
                     <button
                         type="button"
                         onClick={handleCopy}
                         className="p-1 rounded hover:bg-gray-200 flex items-center text-sm"
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
