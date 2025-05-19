import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StatusBadge from "@/components/atoms/post/post-list/StatusBadge"
import DateDisplay from "@/components/atoms/post/post-list/DateDisplay"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  // Tạo chữ cái đầu cho avatar fallback
  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase()
  }

  // Tạo random color cho avatar fallback
  const getRandomColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
    ]
    const index = id.charCodeAt(id.length - 1) % colors.length
    return colors[index]
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <StatusBadge status={post.postStatus} />
          <DateDisplay date={post.createdAt} format="short" className="text-xs text-gray-500" />
        </div>

        <Link to={`/post/${post.projectPostID}`} className="block mb-2 hover:text-blue-600">
          <h3 className="font-medium text-lg line-clamp-2">{post.title}</h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.avatar || "/placeholder.svg"} alt="Avatar" />
              <AvatarFallback className={getRandomColor(post.projectPostID)}>{getInitials(post.title)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Giá: {post.suggestedPrice.toLocaleString()}đ</p>
              <p className="text-gray-500">Giá trị: {post.itemValue.toLocaleString()}đ</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-end">
        <Link
          to={`/post/${post.projectPostID}`}
          className="text-blue-600 text-sm font-medium flex items-center hover:underline"
        >
          Xem chi tiết
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
