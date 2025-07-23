interface Feedback {
    feedbackID: string
    orderID: string
    rating: number
    comment: string
    image?: string
    createdAt: string
    customerName: string
    customerAvatar?: string
    response?: FeedbackResponse
}

interface FeedbackResponse {
    responseID: string
    feedbackID: string
    response: string
    createdAt: string
    designerName: string
    designerAvatar?: string
}

interface CreateFeedbackData {
    orderID: string
    rating: number
    comment: string
    image?: File
}

interface CreateFeedbackResponseData {
    feedbackID: string
    response: string
}
