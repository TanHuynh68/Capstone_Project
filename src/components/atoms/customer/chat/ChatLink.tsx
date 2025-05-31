"use client"

import type React from "react"

import { ExternalLink, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatLinkProps {
  url: string
  text?: string
  isCurrentUser?: boolean
  className?: string
}

export default function ChatLink({ url, text, isCurrentUser = false, className = "" }: ChatLinkProps) {
  // Hàm để lấy domain từ URL
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  // Hàm để validate URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  // Thêm protocol nếu thiếu
  const formatUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`
    }
    return url
  }

  const formattedUrl = formatUrl(url)
  const displayText = text || url
  const domain = getDomain(formattedUrl)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isValidUrl(formattedUrl)) {
      window.open(formattedUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md",
        isCurrentUser
          ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
          : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <LinkIcon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{displayText}</div>
        <div className={cn("text-xs truncate", isCurrentUser ? "text-blue-100" : "text-gray-500")}>{domain}</div>
      </div>

      <div className="flex-shrink-0">
        <ExternalLink className="w-3 h-3 opacity-60" />
      </div>
    </div>
  )
}
