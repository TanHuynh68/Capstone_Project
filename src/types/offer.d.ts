// export interface Offer {
//     offerID: string
//     projectPostID: string
//     freelancerName: string
//     freelancerAvatar: string
//     initPrice: number
//     note: string
//     deadlineEndAt: string
//     createdAt: string
//     status: "pending" | "accepted" | "rejected"
//     sampleImage?: string
// }

 interface OfferPhase {
  offerPhaseID: string;
  phase: number;
  phaseName: string;
  phaseDescription: string;
  offerPhasePrice: number;
  offerPhaseStatus: string;
  startDate: string;
  endDate: string;
  modifyDate: string;
}
interface Offer {
  offerID: string;
  projectPostID: string;
  designerID: string;
  avatar: string;
  fullName: string;
  initPrice: number;
  finalPrice: number | null;
  designerDepositPrice: number | null;
  note: string;
  sampleImage: string;
  isAcceptedByCus: boolean;
  isAcceptedByDes: boolean;
  offerStatus: number;
  createdAt: string;
  deadlineEndAt: string;
  // Additional properties for profile card
  image1?: string;
  image2?: string;
  image3?: string;
  location?: string;
  appreciations?: string;
  followers?: string;
  views?: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  responseRequestModel: {
    responseList: {
      pageIndex: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      items: T[];
    };
  };
}

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
  imageType: "Original" | "Requested";
  createdBy: string;
}
