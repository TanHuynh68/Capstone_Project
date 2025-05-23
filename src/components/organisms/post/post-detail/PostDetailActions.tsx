
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, Star } from "lucide-react"

interface PostDetailActionsProps {
  post: Post
  className?: string
}

export default function PostDetailActions({ className = "" }: PostDetailActionsProps) {
  const handleContact = () => {
    // Xử lý liên hệ
    console.log("Liên hệ với người đăng")
  }

  const handleCall = () => {
    // Xử lý gọi điện
    console.log("Gọi điện cho người đăng")
  }

  const handleEmail = () => {
    // Xử lý gửi email
    console.log("Gửi email cho người đăng")
  }

  const handleRate = () => {
    // Xử lý đánh giá
    console.log("Đánh giá bài đăng")
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Hành động</h2>

      <div className="space-y-3">
        <Button onClick={handleContact} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
          <MessageCircle className="mr-2 h-5 w-5" />
          Liên hệ ngay
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleCall} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
            <Phone className="mr-2 h-4 w-4" />
            Gọi điện
          </Button>

          <Button
            onClick={handleEmail}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>

        <Button
          onClick={handleRate}
          variant="outline"
          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          <Star className="mr-2 h-4 w-4" />
          Đánh giá bài đăng
        </Button>
      </div>
    </div>
  )
}
