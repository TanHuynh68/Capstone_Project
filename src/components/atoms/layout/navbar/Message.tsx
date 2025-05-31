import { Button } from '@/components/ui/button'
import { USER_ROUTES } from '@/routes/path'
import { MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

const Message = () => {
  return (
    <Button variant="ghost" size="icon" className="hidden md:flex">
        <Link to={USER_ROUTES.CHAT}>
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Chat</span>
        </Link>
      </Button>
  )
}

export default Message