import { ChatPostCard } from "@/components/atoms/customer/chat/offer-card/ChatPostCard";

interface ChatPostCardsProps {
  data: OfferDetail[];
  setOffersPhase: any;
  fetchOfferPhase: any;
  offersPhase: any;
}
const ChatPostCardList = ({
  data,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase
}: ChatPostCardsProps) => {
  return (
    <div className="space-y-2">
      {data?.map((item) => (
        <ChatPostCard
          offersPhase={offersPhase}
          fetchOfferPhase={fetchOfferPhase}
          setOffersPhase={setOffersPhase}
          post={item}
        />
      ))}
    </div>
  );
};

export default ChatPostCardList;
