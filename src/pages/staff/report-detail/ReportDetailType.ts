
export interface DeliveryImage {
    deliveryImageID: string;
    imageUrl: string;
    uploadType: string;
}

export interface ShippingTargetDetail {
    deliveryID: string;
    orderID: string;
    senderID: string;
    senderName: string;
    receiverID: string;
    receiverName: string;
    orderCode: string;
    senderAddress: string;
    senderPhoneNumber: string;
    receiverAddress: string;
    receiverPhoneNumber: string;
    deliveryPrice: number;
    length: string;
    width: string;
    height: string;
    weight: string;
    note: string;
    deliveryStatus: string;
    createdAt: string;
    deliveredAt?: string;
    isConfirm: boolean;
    images: DeliveryImage[];
}

export interface ProjectImage {
    projectImageID: string;
    imageUrl: string;
    imageType: string;
    createdBy: string;
}

export interface PostTargetDetail {
    projectPostID: string;
    accountID: string;
    accountName: string;
    title: string;
    description: string;
    postStatus: string;
    itemValue: number;
    suggestedPrice: number;
    createdAt: string;
    endAt: string;
    finishDate: string;
    isActive: boolean;
    originalImages: ProjectImage[];
    requestedImages: ProjectImage[];
}

export interface Order {
    orderID: string;
    customerID: string;
    customerName: string;
    designerID: string;
    designerName: string;
    totalPrice: number;
    orderStatus: string;
    requiredDepositAmount: number;
    designerDepositAmount: number;
    note: string;
    deadlineAt: string;
    startDate: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Offer {
    offerID: string;
    projectPostID: string;
    itemValue: number;
    initPrice: number;
    finalPrice: number;
    designerDepositPrice: number;
    note: string;
    sampleImage: string;
    offerStatus: string;
    createdAt: string;
    deadlineEndAt: string;
}

export interface OfferPhase {
    offerPhaseID: string;
    phase: number;
    phaseName: string;
    phaseDescription: string;
    offerPhasePrice: number;
    offerPhaseStatus: string;
    progressCount: number;
    startDate: string;
    endDate: string;
    modifyDate: string;
}

export interface OrderTargetDetail {
    order: Order;
    offer: Offer;
    offerPhases: OfferPhase[];
}

export interface ReportImage {
    reportImageID: string;
    imageURL: string;
    imageNote?: string;
}

export interface ReportDetail {
    reportID: string;
    reporter: string;
    targetID: string;
    title: string;
    content: string;
    reportType: string;
    reportStatus: string;
    createdAt: string;
    resolver?: string;
    processNote?: string;
    resolvedAt?: string;
    reportImages: ReportImage[];
    targetDetail?:
    | ShippingTargetDetail
    | PostTargetDetail
    | OrderTargetDetail
    | null;
}