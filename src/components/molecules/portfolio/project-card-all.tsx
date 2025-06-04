import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import { formatVietnamDateHours } from "@/components/utils/date";
// import { Heart, Eye } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  createdAt?: string;
  onEditSuccess?: () => void;
}

export function ProjectCardAll({
  title,
  image,
  createdAt,
}: ProjectCardProps) {
  return (
    <div className="group cursor-pointer flex justify-center">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] w-[250px] h-[250px] flex items-center justify-center">
        <SingleImageGallery
          imageUrl={image}
          title=""
          className="!w-[250px] !h-[250px] flex items-center justify-center"
          alt={title}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end justify-start opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="text-white p-4 text-left">
            <p className="text-sm mb-1">{title}</p>
            {createdAt && (
              <p className="text-xs">{formatVietnamDateHours(createdAt)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
