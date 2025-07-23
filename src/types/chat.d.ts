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

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
  imageType: "Original" | "Requested";
  createdBy: string;
}

interface Post {
  projectPostID: string;
  accountID: string;
  fullName: string;
  avatar: string;
  title: string;
  description: string;
  postStatus: number;
  itemValue: number;
  suggestedPrice: number;
  createdAt: string;
  endAt: string;
  finishDate: string;
  isActive: boolean;
  originalImages: ProjectImage[];
  requestedImages: ProjectImage[];
}

type OfferStatus = "Pending" | "Dealing" | "Accepted" | "Rejected";

interface OfferOfPost {
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
  offerStatus: OfferStatus;
  deadlineEndAt: string;
  createdAt: string;
}

interface OfferDetail {
  post: Post;
  offer: OfferOfPost;
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


interface ChatMediaItem {
    messageID: string
    senderName: string
    content: string
    messageType: "Image" | "Design"
    sentAt: string
}

interface ChatMediaGroup {
    month: string
    year: number
    items: ChatMediaItem[]
}

interface ChatMediaResponse {
    responseRequestModel: {
        responseList: ChatMediaItem[]
    }
}
