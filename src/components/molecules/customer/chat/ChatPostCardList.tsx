import { ChatPostCard} from "@/components/atoms/customer/chat/offer-card/ChatPostCard"

interface ChatPostCardsProps{
    data: OfferDetail[]
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