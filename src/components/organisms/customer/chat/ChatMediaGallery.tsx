
import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import ImageGalleryModal from "@/components/molecules/customer/order-detail/ImageGalleryModal"

interface ChatMediaGalleryProps {
  mediaItems: ChatMediaItem[]
  type: "images" | "designs"
}

export default function ChatMediaGallery({ mediaItems, type }: ChatMediaGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<ChatMediaGroup | null>(null)

  // Group media items by month and year
  const groupedMedia = mediaItems.reduce((groups: ChatMediaGroup[], item) => {
    const date = new Date(item.sentAt)
    const year = date.getFullYear()
    const month = format(date, "MMMM", { locale: vi })

    let group = groups.find((g) => g.month === month && g.year === year)
    if (!group) {
      group = { month, year, items: [] }
      groups.push(group)
    }
    group.items.push(item)
    return groups
  }, [])

  // Sort groups by year and month (newest first)
  groupedMedia.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    const monthOrder = [
      "tháng 12",
      "tháng 11",
      "tháng 10",
      "tháng 9",
      "tháng 8",
      "tháng 7",
      "tháng 6",
      "tháng 5",
      "tháng 4",
      "tháng 3",
      "tháng 2",
      "tháng 1",
    ]
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  })

  const handleImageClick = (group: ChatMediaGroup, index: number) => {
    setSelectedGroup(group)
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  if (mediaItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg">
        <div className="text-lg font-medium mb-2">Chưa có {type === "images" ? "ảnh" : "thiết kế"} nào</div>
        <div className="text-sm">{type === "images" ? "Ảnh" : "Thiết kế"} sẽ hiển thị ở đây khi có</div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {groupedMedia.map((group) => (
          <div key={`${group.month}-${group.year}`} className="space-y-3">
            {/* Month Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2">
              <h4 className="text-lg font-semibold text-gray-800 capitalize">
                {group.month} {group.year}
              </h4>
              <div className="h-px bg-gray-200 mt-2" />
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-3 gap-2">
              {group.items.map((item, index) => (
                <div
                  key={item.messageID}
                  className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => handleImageClick(group, index)}
                >
                  <img
                    src={item.content || "/placeholder.svg"}
                    alt={`${type === "images" ? "Ảnh" : "Thiết kế"} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className=" inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

                  {/* Date overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="truncate">{item.senderName}</div>
                    <div className="text-xs opacity-75">{format(new Date(item.sentAt), "dd/MM/yyyy HH:mm")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image Gallery Modal */}
      {selectedGroup && (
        <ImageGalleryModal
          isOpen={isImageModalOpen}
          onClose={() => {
            setIsImageModalOpen(false)
            setSelectedGroup(null)
          }}
          images={selectedGroup.items.map((item) => ({
            url: item.content || "/placeholder.svg",
            alt: `${type === "images" ? "Ảnh" : "Thiết kế"} từ ${item.senderName}`,
            description: `Gửi bởi ${item.senderName} - ${format(new Date(item.sentAt), "dd/MM/yyyy HH:mm")}`,
          }))}
          initialIndex={selectedImageIndex}
        />
      )}
    </>
  )
}
