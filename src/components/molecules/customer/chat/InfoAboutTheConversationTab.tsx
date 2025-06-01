import TimelineTemplate from "@/components/templates/timeline/TimelineTemplate";
import { TimelineItemData } from "../../timeline/TimelineItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatCreateOfferPhase from "@/components/atoms/customer/chat/chat-form/ChatCreateOfferPhase";
const InfoAboutTheConversationTab = () => {
  return (
    <div>
      <div className="flex-1 flex flex-col justify-center gap-2 py-3 px-8">
        <Tabs orientation="vertical" defaultValue="offerPhase">
          <TabsList>
            <TabsTrigger value="offer">Xem đề xuất</TabsTrigger>
            <TabsTrigger value="offerPhase">Tạo giai đoạn đề xuất</TabsTrigger>
            <TabsTrigger value="timeline">Xem Timeline</TabsTrigger>
            <TabsTrigger value="order"> Tạo đơn hàng</TabsTrigger>
          </TabsList>
          <TabsContent value="offerPhase">
            <ChatCreateOfferPhase/>
          </TabsContent>
          <TabsContent value="timeline">
            <div className="flex-5 overflow-y-auto">
              <TimelineTemplate
                title="Project Timeline"
                items={mockTimelineData}
              />
            </div>
          </TabsContent>
        </Tabs>
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
