import Timeline from "@/components/organisms/timeline/Timeline";
import type { TimelineItemData } from "@/components/molecules/timeline/TimelineItem";

interface TimelineTemplateProps {
  title?: string;
  items: TimelineItemData[];
  className?: string;
}

export default function TimelineTemplate({
  title = "Timeline",
  items,
  className = "",
}: TimelineTemplateProps) {
  return (
    <div className={`h-ful text-black p-3 px-8 ${className}`}>
      <div className="w-full flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-8 text-center">{title}</h1>
        <Timeline items={items} />
      </div>
    </div>
  );
}
