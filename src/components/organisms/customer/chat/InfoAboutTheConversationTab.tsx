"use client"

import { useState, useEffect } from "react"
// import type { TimelineItemData } from "../../../molecules/timeline/TimelineItem"
// import TimelineTemplate from "@/components/templates/timeline/TimelineTemplate"
import PostCard from "./PostCard"
interface InfoAboutTheConversationTabProps {
  posts: OfferDetail[]
  value: string
  fetchOfferPhase: (offerID: string) => Promise<void>
  setOffersPhase: (phases: any[]) => void
  offersPhase: any[]
  fetchOffers: () => Promise<void>
}

const InfoAboutTheConversationTab = ({
  posts,
  value,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
  fetchOffers,
}: InfoAboutTheConversationTabProps) => {
  const [currentValue, setCurrentValue] = useState(value)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // Handle value changes with animation
  useEffect(() => {
    if (value !== currentValue) {
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setCurrentValue(value)
        setAnimationKey((prev) => prev + 1)

        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [value, currentValue])

  // Initialize currentValue
  useEffect(() => {
    setCurrentValue(value)
  }, [])

  const renderContent = () => {
    const baseClasses = `transition-all duration-300 ease-in-out transform ${
      isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
    }`

    switch (currentValue) {
      // case "timeline":
      //   return (
      //     <div key={`timeline-${animationKey}`} className={baseClasses}>
      //       <div className="space-y-4">
      //         <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
      //         <TimelineTemplate items={mockTimelineData} />
      //       </div>
      //     </div>
      //   )

      case "viewPost":
        return (
          <div key={`viewPost-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài đăng ({posts?.length || 0})</h3>
              <PostCard
                fetchOffers={fetchOffers}
                offersPhase={offersPhase}
                setOffersPhase={setOffersPhase}
                fetchOfferPhase={fetchOfferPhase}
                posts={posts}
              />
            </div>
          </div>
        )

      case "offerPhase":
        return (
          <div key={`offerPhase-${animationKey}`} className={baseClasses}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem đề xuất</h3>
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium mb-2">Danh sách đề xuất</div>
                <div className="text-sm mb-4">Nội dung đề xuất sẽ hiển thị ở đây</div>

                {/* Mock content for testing scroll */}
                <div className="space-y-3 text-left max-h-96 overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border shadow-sm">
                      <div className="font-medium text-gray-800">Đề xuất #{i + 1}</div>
                      <div className="text-sm text-gray-600 mt-2">
                        Đây là nội dung mô tả chi tiết cho đề xuất số {i + 1}. Nội dung này có thể rất dài và cần scroll
                        để xem hết.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div key={`default-${animationKey}`} className={baseClasses}>
            <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="text-lg font-medium mb-2">Chọn một mục</div>
              <div className="text-sm">Vui lòng chọn một mục từ menu bên trái</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div className="h-full overflow-y-auto">
        {/* Content Container with Animation */}
        <div className="relative">
          {/* Background Animation */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out rounded-lg ${
              isTransitioning ? "bg-gray-50" : "bg-transparent"
            }`}
          />

          {/* Content with Staggered Animation */}
          <div className="relative z-10 p-4">{renderContent()}</div>

          {/* Loading Overlay */}
          {isTransitioning && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 rounded-lg">
              <div className="flex space-x-1">
                {[0, 150, 300].map((delay, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoAboutTheConversationTab

// const mockTimelineData: TimelineItemData[] = [
//   {
//     id: "1",
//     date: "2024-01-17",
//     title: "Pending Task",
//     description: "This task is pending start.",
//     type: "pending",
//   },
//   {
//     id: "2",
//     date: "2024-01-16",
//     title: "In Progress Task",
//     description: "This task is currently in progress.",
//     type: "progress",
//   },
//   {
//     id: "3",
//     date: "2024-01-15",
//     title: "Completed Task",
//     description: "This task has been completed successfully.",
//     type: "completed",
//   },
//   {
//     id: "4",
//     date: "2024-01-14",
//     title: "Project Meeting",
//     description: "Team meeting to discuss project requirements and timeline.",
//     type: "user",
//   },
//   {
//     id: "5",
//     date: "2024-01-13",
//     title: "Deadline Warning",
//     description: "Important deadline approaching for project milestone.",
//     type: "warning",
//   },
//   {
//     id: "6",
//     date: "2024-01-12",
//     title: "Task Cancelled",
//     description: "This task was cancelled due to changing requirements.",
//     type: "cancelled",
//   },
// ]
