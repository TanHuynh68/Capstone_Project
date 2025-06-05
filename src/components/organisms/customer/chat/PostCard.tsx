import ChatPostCardList from "@/components/molecules/customer/chat/ChatPostCardList"

interface PostCard{
    posts: OfferDetail[]
}
const PostCard = ({posts}: PostCard) => {
  return (
    <div>
        <ChatPostCardList
        data={posts}
        />
    </div>
  )
}

export default PostCard