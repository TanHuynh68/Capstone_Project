interface UserChat {
  id: string;
  chatRoomID: string;
  account1: account;
  account2: account;
  updatedAt: string;
  lastMessage: string;
  messageType: string;
  senderID: string;
}
interface account {
  accountID: string;
  accountName: string;
  avatar: string;
  role: string;
}
interface Message {
  senderID: string;
  messageID: string;
  content: string;
  messageType: string;
  sentAt: string;
}

interface ChatPostCard {
  projectPostID: string;
  title: string;
  description: string;
  suggestedPrice: number;
  offerID: string;
  designerID: string;
  designerName: string;
  avatar: string;
  initPrice: number;
  finalPrice: number | null;
  designerDepositPrice: number | null;
  note: string;
  sampleImage: string;
  isAcceptedByCus: boolean;
  isAcceptedByDes: boolean;
  offerStatus: "Pending" | "Accepted" | "Rejected" | string; // extend if needed
  deadlineEndAt: string; // ISO format, consider converting to Date if needed
  createdAt: string; // same here
}
