import { ChatPostCard} from "@/components/atoms/customer/chat/chat-post-card/ChatPostCard"

interface ChatPostCardsProps{
    data: ChatPostCard[]
}
const ChatPostCardList = ({data}: ChatPostCardsProps) => {
  return (
    <div className="space-y-2">
        {
            data?.map((item)=>(
                <ChatPostCard post={item}/>
            ))
        }
    </div>
  )
}

export default ChatPostCardList