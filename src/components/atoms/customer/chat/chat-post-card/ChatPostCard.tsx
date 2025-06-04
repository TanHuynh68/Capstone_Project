import {
  Card,
} from "@/components/ui/card"

export interface ChatPostCardProps{
   post: ChatPostCard
}
export function ChatPostCard({post}: ChatPostCardProps) {
    console.log('post: ', post)
  return (
    <Card className="w-full max-w-sm grid grid-cols-2 gap-2 p-2">
      <div className="border border-solid rounded-lg">
        {post.sampleImage}
      </div>
    </Card>
  )
}
