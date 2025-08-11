import { useState, useEffect } from "react";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  messageId: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, content: string) => void;
  className?: string;
  messageType: string;
}

export default function MessageActions({
  messageType,
  messageId,
  content,
  timestamp,
  isCurrentUser,
  onDelete,
  onEdit,
  className,
}: MessageActionsProps) {
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const messageTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const diffInMs = currentTime - messageTime;
    // Đổi ra số phút
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    console.log("diffInMinutes: ", diffInMinutes);
    setIsEditable(diffInMinutes - 420 <= 5);
    console.log(diffInMinutes - 420 <= 5);
  }, [timestamp]);

  if (!isCurrentUser || !isEditable) {
    return null;
  }

  return (
    <div>
      {(messageType.toLowerCase() === "text" ||
        messageType.toLowerCase() === "image" ||
        messageType.toLowerCase() === "json" ||
        messageType.toLowerCase() === "link") && (
        <div
          className={cn(
            "  opacity-0 group-hover:opacity-100 transition-opacity",
            // isCurrentUser ? "left-0 translate-x-2" : "left-0 translate-x-2", // luôn ở bên trái
            className
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>
                <MoreVertical className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-gray-900 border-gray-800 text-gray-300"
            >
              {messageType.toLowerCase() === "text" && (
                <DropdownMenuItem
                  className="flex items-center cursor-pointer hover:bg-gray-800 hover:text-white"
                  onClick={() => onEdit(messageId, content)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex items-center cursor-pointer text-red-500 hover:bg-gray-800 hover:text-red-400"
                onClick={() => onDelete(messageId)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Xóa</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
