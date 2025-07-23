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
