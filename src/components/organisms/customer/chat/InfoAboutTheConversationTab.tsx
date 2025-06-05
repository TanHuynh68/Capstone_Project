import { TimelineItemData } from "../../../molecules/timeline/TimelineItem";
import TimelineTemplate from "@/components/templates/timeline/TimelineTemplate";
import PostCard from "./PostCard";
interface InfoAboutTheConversationTab {
  posts: OfferDetail[];
  value: string;
}
const InfoAboutTheConversationTab = ({
  posts,
  value,
}: InfoAboutTheConversationTab) => {
  return (
    <div>
      <div className="flex flex-col justify-center gap-2 py-3 ">
        <div className="">
          {value === "timeline" && (
            <div>
              <TimelineTemplate items={mockTimelineData} />
            </div>
          )}
          {value === "viewPost" && (
            <div>
              <PostCard posts={posts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoAboutTheConversationTab;

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
