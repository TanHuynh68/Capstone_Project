"use client"

import { Button } from "@/components/ui/button"
import { Share2, Heart, Flag } from "lucide-react"
import DateDisplay from "@/components/atoms/post/post-detail/DateDisplay"
import UserInfo from "@/components/molecules/post/post-detail/UserInfo"
import StatusBadge from "@/components/atoms/post/post-list/StatusBadge"
import { Breadcrumb } from "../../custom/breadcrumb/Breadcrumb"

interface PostDetailHeaderProps {
  post: Post
  onBack?: () => void
  className?: string
}

export default function PostDetailHeader({ post, className = "" }: PostDetailHeaderProps) {
  const items = [
  { href: "/", title: "Trang chủ" },
  { href: "/post", title: "Bài đăng" },
  { href: "", title: "Bài đăng chi tiết" },
];
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Navigation và Actions */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb  items={items}/>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thông tin chính */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <StatusBadge status={post.postStatus} />
          </div>
        </div>

        {/* Thông tin người đăng */}
        <UserInfo fullName={post.fullName} avatar={post.avatar} accountID={post.accountID} />

        {/* Thông tin thời gian */}
        <div className="flex flex-wrap gap-6">
          <DateDisplay date={post.createdAt} label="Ngày tạo" icon="calendar" />
          <DateDisplay date={post.endAt} label="Ngày kết thúc" icon="clock" />
        </div>
      </div>
    </div>
  )
}
