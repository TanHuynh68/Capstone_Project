import { ChatPostCard } from "@/components/atoms/customer/chat/offer-card/ChatPostCard";

interface ChatPostCardsProps {
  data: OfferDetail[];
  setOffersPhase: any;
  fetchOfferPhase: any;
  offersPhase: any;
  fetchOffers: any;
}
const ChatPostCardList = ({
  data,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
  fetchOffers,
}: ChatPostCardsProps) => {
  return (
    <div className="space-y-2">
      {data?.map((item) => (
        <ChatPostCard
          fetchOffers={fetchOffers}
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
