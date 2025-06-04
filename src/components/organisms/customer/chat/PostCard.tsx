import ChatPostCardList from "@/components/molecules/customer/chat/ChatPostCardList"

interface PostCard{
    posts: ChatPostCard[]
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