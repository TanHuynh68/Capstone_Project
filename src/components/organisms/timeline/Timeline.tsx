import TimelineItem, {
  type TimelineItemData,
} from "@/components/molecules/timeline/TimelineItem";

interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
}

export default function Timeline({ items, className = "" }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có dữ liệu timeline</p>
      </div>
    );
  }

  return (
    <div className={`space-y-0 bg-white overflow-y-auto ${className}`}>
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
