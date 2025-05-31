import ChatSidebar from "@/components/organisms/customer/chat/ChatSidebar";
import ChatHeader from "@/components/organisms/customer/chat/ChatHeader";
import MessageList from "@/components/organisms/customer/chat/MessageList";
import MessageComposer from "@/components/molecules/chat/MessageComposer";
import TimelineTemplate from "../timeline/TimelineTemplate";
import { TimelineItemData } from "@/components/molecules/timeline/TimelineItem";
import { Button } from "@/components/ui/button";

interface ChatTemplateProps {
  setShouldScroll: any;
  message: Message[];
  users: UserChat[];
  chatRoomID: string;
  onSelectChat: any;
  onSendMessage: (message: string) => void;
  shouldScrollToBottom: boolean;
  loadingMessage: boolean;
  onDeletMessage: any;
  onEditMessage: any;
}

export default function ChatTemplate({
  message,
  users,
  chatRoomID,
  onSelectChat,
  onSendMessage,
  onDeletMessage,
  onEditMessage,
}: ChatTemplateProps) {
  const currentChatUser = users[0];
  return (
    <div className="bg-gray-200 py-3 px-1 h-screen">
      <div className=" flex w-full h-full overflow-hidden gap-4 p-3">
        <div className="flex-2 border border-solid rounded-xl bg-white">
          <ChatSidebar
            users={users}
            messages={message}
            activeChat={chatRoomID}
            onSelectChat={onSelectChat}
          />
        </div>

        <div className="flex flex-4 flex-col bg-white rounded-xl">
          <div className="sticky top-0 z-10">
            {currentChatUser && (
              <ChatHeader
                user={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            )}
          </div>
          {currentChatUser && (
            <div className="flex-1 overflow-y-auto">
              <MessageList
                onDeleteMessage={onDeletMessage}
                onEditMessage={onEditMessage}
                messages={message}
                users={users.filter((item) => item.chatRoomID === chatRoomID)}
              />
            </div>
          )}
          {currentChatUser ? (
            <div className="sticky bottom-0 z-10">
              <MessageComposer onSendMessage={onSendMessage} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              Chưa có ai để trò chuyện
            </div>
          )}
        </div>
        <div className="flex flex-2 flex-col rounded-xl bg-white">
          <div className="flex-1 flex flex-col gap-2 py-3 px-8">
              <Button>Xem đề xuất</Button>
              <Button>Tạo giai đoạn đề xuất</Button>
              <Button>Tạo đơn hàng</Button>
          </div>
          <div className="flex-5 overflow-y-auto">
            <TimelineTemplate
              title="Project Timeline"
              items={mockTimelineData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
