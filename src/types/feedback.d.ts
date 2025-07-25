// Re-export types from the schema file to maintain consistency
export type {
    CreateFeedbackFormData,
    CreateFeedbackResponseFormData,
    FeedbackData,
} from "@/schemas/feedbackSchema"

// Additional types that might be needed for API responses
interface CreateFeedbackResponse {
    feedbackID: string
    rating: number
    comment: string
    imageURL: string
    createdAt: string
}

interface FeedbackResponseData {
    feedbackID: string
    response: string
    responseAt: string
}
