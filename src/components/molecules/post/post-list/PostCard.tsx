import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DateDisplay from "@/components/atoms/post/post-list/DateDisplay";
import { formatCurrencyVND } from "@/components/utils";
import { PATH } from "@/routes/path";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Tạo chữ cái đầu cho avatar fallback
  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

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
    ];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  return (
    <div>
      <Link to={`${PATH.POST_DETAIL}/${post.projectPostID}`}>
        <Card className="overflow-hidden transition-all hover:shadow-md p-0">
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img
              src={post.originalImage.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <CardContent className="p-">
            <div className="flex justify-between items-start mb-2">
              <div className="text-3xl font-semibold">
                {formatCurrencyVND(post.suggestedPrice)}
              </div>
            </div>

            <Link
              to={`/post/${post.projectPostID}`}
              className="block mb-2 hover:text-blue-600"
            >
              <h3 className="font-medium text-lg line-clamp-2">{post.title}</h3>
            </Link>
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 flex items-center mb-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={post.avatar || "/placeholder.svg"}
                      alt="Avatar"
                    />
                    <AvatarFallback
                      className={getRandomColor(post.projectPostID)}
                    >
                      {getInitials(post.title)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-md col-span-9">
                  <p className="text-gray-500 ">{post.fullName}</p>
                  <div className="">
                    <DateDisplay
                      date={post.createdAt}
                      format="short"
                      className="text-xs text-gray-500 mb-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
