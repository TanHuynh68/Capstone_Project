"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, ChevronDown, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatJsonProps {
  data: any
  className?: string
  maxHeight?: number
  showCopyButton?: boolean
}

export default function ChatJson({ data, className = "", maxHeight = 300, showCopyButton = true }: ChatJsonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)
  const isLargeJson = jsonString.split("\n").length > 10

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy JSON:", error)
    }
  }

  const renderJsonValue = (value: any, depth = 0) => {

    if (value === null) {
      return <span className="text-gray-500">null</span>
    }

    if (typeof value === "boolean") {
      return <span className="text-blue-600">{value.toString()}</span>
    }

    if (typeof value === "number") {
      return <span className="text-purple-600">{value}</span>
    }

    if (typeof value === "string") {
      return <span className="text-green-600">"{value}"</span>
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-600">[]</span>
      }

      return (
        <div>
          <span className="text-gray-600">[</span>
          {value.map((item, index) => (
            <div key={index} className="ml-4">
              {renderJsonValue(item, depth + 1)}
              {index < value.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
          <span className="text-gray-600">]</span>
        </div>
      )
    }

    if (typeof value === "object") {
      const keys = Object.keys(value)
      if (keys.length === 0) {
        return <span className="text-gray-600">{"{}"}</span>
      }

      return (
        <div>
          <span className="text-gray-600">{"{"}</span>
          {keys.map((objKey, index) => (
            <div key={objKey} className="ml-4">
              <span className="text-red-600">"{objKey}"</span>
              <span className="text-gray-600">: </span>
              {renderJsonValue(value[objKey], depth + 1)}
              {index < keys.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
          <span className="text-gray-600">{"}"}</span>
        </div>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <div className={cn("bg-gray-900 rounded-lg border border-gray-700", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">JSON</span>
          {isLargeJson && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span className="ml-1 text-xs">{isExpanded ? "Thu gọn" : "Mở rộng"}</span>
            </Button>
          )}
        </div>

        {showCopyButton && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2 text-gray-400 hover:text-white">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="ml-1 text-xs">{copied ? "Đã sao chép" : "Sao chép"}</span>
          </Button>
        )}
      </div>

      {/* Content */}
      <div
        className={cn("p-4 overflow-auto text-sm font-mono", !isExpanded && isLargeJson && "max-h-32")}
        style={{ maxHeight: isExpanded ? maxHeight : undefined }}
      >
        <div className="text-white whitespace-pre-wrap">{renderJsonValue(data)}</div>
      </div>

      {/* Raw JSON fallback (hidden by default) */}
      <details className="border-t border-gray-700">
        <summary className="p-3 text-xs text-gray-400 cursor-pointer hover:text-white">Xem JSON thô</summary>
        <div className="p-4 bg-gray-950 text-xs font-mono text-gray-300 overflow-auto max-h-40">
          <pre>{jsonString}</pre>
        </div>
      </details>
    </div>
  )
}
