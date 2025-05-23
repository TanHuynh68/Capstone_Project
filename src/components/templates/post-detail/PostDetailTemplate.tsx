import PostDetailHeader from "@/components/organisms/post/post-detail/PostDetailHeader"
import PostDetailContent from "@/components/organisms/post/post-detail/PostDetailContent"
import PostDetailActions from "@/components/organisms/post/post-detail/PostDetailActions"

interface PostDetailTemplateProps {
  post: Post
  onBack?: () => void
  className?: string
}

export default function PostDetailTemplate({ post, onBack, className = "" }: PostDetailTemplateProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung chính */}
          <div className="lg:col-span-2 space-y-6">
            <PostDetailHeader post={post} onBack={onBack} />
            <PostDetailContent post={post} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PostDetailActions post={post} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
