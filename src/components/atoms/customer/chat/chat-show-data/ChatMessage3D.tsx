"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, Calendar, Rotate3d } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatVietnamDateHours } from "@/utils/date"

interface ChatMessage3DProps {
  canvas3DData: string
  title: string
  id: string
  isOwnMessage?: boolean
  timestamp?: string
}

export default function ChatMessage3D({
  canvas3DData,
  title,
  id,
  isOwnMessage = false,
  timestamp
}: ChatMessage3DProps) {
  const navigate = useNavigate()

  // Parse canvas3D data to extract information
  const parseCanvas3DData = () => {
    try {
      const data = JSON.parse(canvas3DData)
      return {
        modelName: data.modelName || "Unknown Model",
        isDefaultModel: data.isDefaultModel || false,
        savedAt: data.savedAt || timestamp || new Date().toISOString(),
        sceneInfo: data.sceneInfo || {
          texturesCount: 0,
          accessoriesCount: 0,
          textsCount: 0,
          hasCurrentTexture: false
        },
        preview: data.preview || {
          modelId: "unknown",
          hasTexture: false,
          hasText: false,
          elementsCount: 0
        }
      }
    } catch (error) {
      console.error("Error parsing canvas3D data:", error)
      return {
        modelName: "Unknown Model",
        isDefaultModel: false,
        savedAt: timestamp || new Date().toISOString(),
        sceneInfo: {
          texturesCount: 0,
          accessoriesCount: 0,
          textsCount: 0,
          hasCurrentTexture: false
        },
        preview: {
          modelId: "unknown",
          hasTexture: false,
          hasText: false,
          elementsCount: 0
        }
      }
    }
  }

  const parsedData = parseCanvas3DData()

  const handleOpenIn3DEditor = () => {
    try {

      // Navigate đến /canvas/plushdoll-design với state để mở trực tiếp trong is3DMode
      // và tự động mở sidebar Canvas3DList với canvas đã chọn
      navigate('/canvas/plushdoll-design', {
        state: {
          canvas3DData,
          title,
          id,
          fromChat: true,
          openIn3DMode: true,
          openCanvas3DList: true,  // Tự động mở sidebar Canvas3DList
          selectedCanvas3D: {       // Dữ liệu canvas đã chọn từ chat
            canvas3D: canvas3DData,
            title,
            id
          }
        }
      })
    } catch (error) {
      console.error('Error opening 3D design in editor:', error)
    }
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`w-[300px] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <Card className={`${isOwnMessage ? 'bg-card border-border' : 'bg-muted border-border'} hover:shadow-md transition-shadow cursor-pointer`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
                <Box className="h-4 w-4 text-primary" />
                {title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                3D
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Basic Info */}
            {/* Action Buttons */}
            <div className="flex gap-2 ">
              <Button
                onClick={handleOpenIn3DEditor}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                <Rotate3d className="h-3 w-3 mr-1" />
                Mở trong thiết kế 3D
              </Button>
            </div>
            <div className="space-y-2 text-xs mt-3">
              <div className="flex items-center justify-end gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Lưu lúc: {formatVietnamDateHours(parsedData.savedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
