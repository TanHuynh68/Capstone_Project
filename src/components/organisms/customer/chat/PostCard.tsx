import ChatPostCardList from "@/components/molecules/customer/chat/ChatPostCard"

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