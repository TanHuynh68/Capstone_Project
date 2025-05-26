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


export interface Offer {
    offerID: string
    projectPostID: string
    designerID: string
    avatar: string
    fullName: string
    initPrice: number
    finalPrice: number | null
    designerDepositPrice: number | null
    note: string
    sampleImage: string
    isAcceptedByCus: boolean
    isAcceptedByDes: boolean
    offerStatus: number
    createdAt: string
    deadlineEndAt: string
}

export interface ApiResponse<T> {
    isSuccess: boolean
    message: string
    statusCode: number
    responseRequestModel: {
        responseList: {
            pageIndex: number
            pageSize: number
            totalItems: number
            totalPages: number
            items: T[]
        }
    }
}


export interface ProjectImage {
    projectImageID: string
    imageUrl: string
    imageType: "Original" | "Requested"
    createdBy: string
}
