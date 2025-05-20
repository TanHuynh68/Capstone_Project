interface UserChat {
  id: string;
  chatRoomID: string;
  account1ID: string;
  account1Name: string;
  account2ID: string;
  account2Name: string;
  updatedAt?: string;
  avatar?: string;
}

interface Message {
  senderID: string;
  content: string;
  messageType: string;
  sentAt: string;
}

