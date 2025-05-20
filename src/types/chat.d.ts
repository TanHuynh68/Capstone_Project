interface UserChat {
  id: string;
  fullName: string;
  avatar: string;
  color: string;
  status?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
}

interface Chat {
  id: string;
  users: UserChat[];
  messages: Message[];
  lastMessage?: string;
  typing?: boolean;
}
