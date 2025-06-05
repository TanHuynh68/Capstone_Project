import ChatPostCardList from "@/components/molecules/customer/chat/ChatPostCardList"

interface PostCard{
    posts: OfferDetail[]
    fetchOfferPhase: any
    setOffersPhase: any
    offersPhase: any
}
const PostCard = ({posts, fetchOfferPhase, setOffersPhase, offersPhase}: PostCard) => {
  return (
    <div>
        <ChatPostCardList
        fetchOfferPhase={fetchOfferPhase}
        setOffersPhase={setOffersPhase}
        offersPhase={offersPhase}
        data={posts}
        />
    </div>
  )
}

export default PostCard