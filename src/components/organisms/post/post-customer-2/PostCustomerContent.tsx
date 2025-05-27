import PriceDisplay from "@/components/atoms/post/post-detail/PriceDisplay";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";

interface PostCustomerContentProps {
  post: Post;
  className?: string;
}

export default function PostCustomerContent({
  post,
  className = "",
}: PostCustomerContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mô tả */}
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>
        </div>
      </div>

      {/* Thông tin giá */}
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Thông tin giá</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <PriceDisplay value={post.itemValue} label="Giá trị sản phẩm" />
          </div>

          <div className="bg-primary/10 text-priceHighlight-foreground rounded-lg p-4">
            <PriceDisplay value={post.suggestedPrice} label="Giá đề xuất" />
          </div>
        </div>
      </div>

      {/* Hình ảnh gốc */}
      {post.originalImages && post.originalImages.length > 0 && (
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
          <ImageGallery images={post.originalImages} title="Hình ảnh gốc" />
        </div>
      )}

      {/* Hình ảnh yêu cầu */}
      {post.requestedImages && post.requestedImages.length > 0 && (
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
          <ImageGallery
            images={post.requestedImages}
            title="Hình ảnh yêu cầu"
          />
        </div>
      )}
    </div>
  );
}
