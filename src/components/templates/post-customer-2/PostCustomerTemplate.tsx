import PostCustomerHeader from "@/components/organisms/post/post-customer-2/PostCustomerHeader";
import PostCustomerContent from "@/components/organisms/post/post-customer-2/PostCustomerContent";

interface PostCustomerTemplateProps {
  post: Post;
  onBack?: () => void;
  className?: string;
  onViewOffers?: () => void;
  isSelected?: boolean;
  postNumber: number;
}

export default function PostCustomerTemplate({
  post,
  onBack,
  onViewOffers,
  isSelected = false,
  postNumber,
}: PostCustomerTemplateProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bài đăng của tôi ({postNumber})</h2>
      </div>

      {/* <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button> */}
      {/* Nội dung chính */}
      <div className="lg:col-span-2 space-y-6">
        <PostCustomerHeader
          post={post}
          onBack={onBack}
          onViewOffers={onViewOffers}
          isSelected={isSelected}
        />
        <PostCustomerContent post={post} />
      </div>

      {/* Sidebar */}
      {/* <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PostCustomerActions post={post} />
            </div>
          </div> */}
    </div>
  );
}
