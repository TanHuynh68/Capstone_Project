import PriceDisplay from "@/components/atoms/post/post-detail/PriceDisplay"
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery"

interface PostDetailContentProps {
  post: Post
  className?: string
}

export default function PostDetailContent({ post, className = "" }: PostDetailContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mô tả */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
        </div>
      </div>

      {/* Thông tin giá */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin giá</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <PriceDisplay value={post.itemValue} label="Giá trị sản phẩm" />
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <PriceDisplay value={post.suggestedPrice} label="Giá đề xuất" />
          </div>
        </div>
      </div>

      {/* Hình ảnh gốc */}
      {post.originalImage && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ImageGallery images={[post.originalImage]} title="Hình ảnh gốc" />
        </div>
      )}

      {/* Hình ảnh yêu cầu */}
      {post.requestedImages && post.requestedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ImageGallery images={post.requestedImages} title="Hình ảnh yêu cầu" />
        </div>
      )}
    </div>
  )
}
