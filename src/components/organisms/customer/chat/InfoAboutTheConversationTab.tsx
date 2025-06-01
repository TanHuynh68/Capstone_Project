import { TimelineItemData } from "../../../molecules/timeline/TimelineItem";
import SidebarCollapses from "@/components/molecules/custom/sidebar-collapse/SidebarCollapses";
import { SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse";
import ChatCreateOfferPhase from "@/components/atoms/customer/chat/chat-form/ChatCreateOfferPhase";
import { useState } from "react";
import TimelineTemplate from "@/components/templates/timeline/TimelineTemplate";

const InfoAboutTheConversationTab = () => {
  const [value, setValue] = useState<string>("");
  const handleSetTabsContent = (valueItem: any) => {
    setValue(valueItem);
  };
  return (
    <div>
      <div className="flex-1 flex flex-col justify-center gap-2 py-3 px-8">
        <SidebarCollapses onClick={handleSetTabsContent} items={items} />
        {
          value === 'offerPhase' && <ChatCreateOfferPhase />
        }
        {
          value === 'timeline' && <TimelineTemplate items={mockTimelineData} />
        }
      </div>
    </div>
  );
};

export default InfoAboutTheConversationTab;

const items: SidebarCollapseProps[] = [
  {
    title: "Thông tin về đoạn chat",
    subItem: [
      { title: "Xem đề xuất", tabName: "offerPhase" },
      { title: "Timeline", tabName: "timeline" },
    ],
  },
  // { title: "File", subItem: ["File phương tiện", "File"] },
];

const mockTimelineData: TimelineItemData[] = [
  {
    id: "1",
    date: "2024-01-17",
    title: "Pending Task",
    description: "This task is pending start.",
    type: "pending",
  },
  {
    id: "2",
    date: "2024-01-16",
    title: "In Progress Task",
    description: "This task is currently in progress.",
    type: "progress",
  },
  {
    id: "3",
    date: "2024-01-15",
    title: "Completed Task",
    description: "This task has been completed successfully.",
    type: "completed",
  },
  {
    id: "4",
    date: "2024-01-14",
    title: "Project Meeting",
    description: "Team meeting to discuss project requirements and timeline.",
    type: "user",
  },
  {
    id: "5",
    date: "2024-01-13",
    title: "Deadline Warning",
    description: "Important deadline approaching for project milestone.",
    type: "warning",
  },
  {
    id: "6",
    date: "2024-01-12",
    title: "Task Cancelled",
    description: "This task was cancelled due to changing requirements.",
    type: "cancelled",
  },
];
