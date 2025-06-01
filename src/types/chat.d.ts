interface UserChat {
  id: string;
  chatRoomID: string;
  account1ID: string;
  account1Name: string;
  account2ID: string;
  account2Name: string;
  updatedAt: string;
  avatar1: string;
  avatar2: string;
}

interface Message {
  senderID: string;
  messageID: string;
  content: string;
  messageType: string;
  sentAt: string;
}

