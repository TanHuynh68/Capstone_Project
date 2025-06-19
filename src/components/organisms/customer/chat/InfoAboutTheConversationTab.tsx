"use client"

import { useState, useEffect } from "react"
import type { TimelineItemData } from "../../../molecules/timeline/TimelineItem"
import TimelineTemplate from "@/components/templates/timeline/TimelineTemplate"
import PostCard from "./PostCard"

interface InfoAboutTheConversationTabProps {
  posts: OfferDetail[]
  value: string
  fetchOfferPhase: any
  setOffersPhase: any
  offersPhase: any
  fetchOffers: any
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

      // Start exit animation
      setTimeout(() => {
        setCurrentValue(value)
        setAnimationKey((prev) => prev + 1)

        // Start enter animation
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 200) // Half of transition duration
    }
  }, [value, currentValue])

  // Initialize currentValue
  useEffect(() => {
    setCurrentValue(value)
  }, [])

  const renderContent = () => {
    switch (currentValue) {
      case "timeline":
        return (
          <div
            key={`timeline-${animationKey}`}
            className={`transition-all duration-300 ease-in-out transform ${
              isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <div className="space-y-4">
              <TimelineTemplate items={mockTimelineData} />
            </div>
          </div>
        )

      case "viewPost":
        return (
          <div
            key={`viewPost-${animationKey}`}
            className={`transition-all duration-300 ease-in-out transform ${
              isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <div className="space-y-4">
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
          <div
            key={`offerPhase-${animationKey}`}
            className={`transition-all duration-300 ease-in-out transform ${
              isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <div className="space-y-4">
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium mb-2">Xem đề xuất</div>
                <div className="text-sm">Nội dung đề xuất sẽ hiển thị ở đây</div>
                {/* Mock content để test scroll */}
                <div className="mt-4 space-y-2 text-left">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="p-3 bg-white rounded border">
                      <div className="font-medium">Đề xuất #{i + 1}</div>
                      <div className="text-sm text-gray-600 mt-1">
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
          <div
            key={`default-${animationKey}`}
            className={`transition-all duration-300 ease-in-out transform ${
              isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="text-lg font-medium mb-2">Chọn một mục</div>
              <div className="text-sm">Vui lòng chọn một mục từ menu bên trái</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col justify-center gap-2 py-3">
        {/* Content Container with Animation */}
        <div className="relative">
          {/* Background Animation */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-in-out rounded-lg ${
              isTransitioning ? "bg-gray-50" : "bg-transparent"
            }`}
          />

          {/* Content with Staggered Animation */}
          <div className="relative z-10">{renderContent()}</div>

          {/* Loading Overlay */}
          {isTransitioning && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 rounded-lg">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoAboutTheConversationTab

const mockTimelineData: TimelineItemData[] = [
  {
    id: "1",
    date: "2024-01-17",
    title: "Pending Task",
    description: "This task is pending start.",
    type: "pending",
  },
  {
    id: "2",
    date: "2024-01-16",
    title: "In Progress Task",
    description: "This task is currently in progress.",
    type: "progress",
  },
  {
    id: "3",
    date: "2024-01-15",
    title: "Completed Task",
    description: "This task has been completed successfully.",
    type: "completed",
  },
  {
    id: "4",
    date: "2024-01-14",
    title: "Project Meeting",
    description: "Team meeting to discuss project requirements and timeline.",
    type: "user",
  },
  {
    id: "5",
    date: "2024-01-13",
    title: "Deadline Warning",
    description: "Important deadline approaching for project milestone.",
    type: "warning",
  },
  {
    id: "6",
    date: "2024-01-12",
    title: "Task Cancelled",
    description: "This task was cancelled due to changing requirements.",
    type: "cancelled",
  },
  // Thêm nhiều items để test scroll
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `extra-${i + 7}`,
    date: `2024-01-${11 - i}`,
    title: `Additional Task ${i + 1}`,
    description: `This is additional timeline item ${i + 1} to test scrolling functionality.`,
    type: "completed" as const,
  })),
]
