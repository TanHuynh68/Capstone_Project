import TimelineIcon, {
  type TimelineIconType,
} from "@/components/atoms/customer/chat/timeline/TimelineIcon";
import TimelineDate from "@/components/atoms/customer/chat/timeline/TimelineDate";

export interface TimelineItemData {
  id: string;
  date: string;
  title: string;
  description: string;
  type: TimelineIconType;
}

interface TimelineItemProps {
  item: TimelineItemData;
  isLast?: boolean;
  className?: string;
}

export default function TimelineItem({
  item,
  isLast = false,
  className = "",
}: TimelineItemProps) {
  return (
    <div className={`relative flex gap-4 ${className}`}>
      {/* Date */}
      <div className="flex-shrink-0 w-20">
        <TimelineDate date={item.date} />
      </div>

      {/* Icon and Line */}
      <div className="flex flex-col items-center">
        <TimelineIcon type={item.type} />
        {!isLast && <div className="w-px h-10 bg-gray-700 mt-2" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}
