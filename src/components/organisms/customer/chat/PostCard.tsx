import ChatPostCardList from "@/components/molecules/customer/chat/ChatPostCardList";

interface PostCard {
  posts: OfferDetail[];
  fetchOfferPhase: any;
  setOffersPhase: any;
  offersPhase: any;
  fetchOffers: any;
}
const PostCard = ({
  posts,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
  fetchOffers,
}: PostCard) => {
  return (
    <div>
      <ChatPostCardList
        fetchOfferPhase={fetchOfferPhase}
        fetchOffers={fetchOffers}
        setOffersPhase={setOffersPhase}
        offersPhase={offersPhase}
        data={posts}
      />
    </div>
  );
};

export default PostCard;
