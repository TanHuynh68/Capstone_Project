"use client"

import { useState, useCallback } from "react"
import OfferService from "@/services/OfferService"
import { ApiResponse, Offer } from "@/types/offer"

export function useOffers() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { getAllOffersInPost } = OfferService()

    const fetchOffers = useCallback(
        async (postId?: string) => {
            console.log(postId, "postId")

            if (!postId) {
                setOffers([])
                return
            }

            try {
                setLoading(true)
                setError(null)

                const response: ApiResponse<Offer> = await getAllOffersInPost({ projectPostID: postId, page: 1, size: 10 })

                if (response?.isSuccess && response.responseRequestModel?.responseList?.items) {
                    setOffers(response.responseRequestModel.responseList.items)
                } else {
                    setOffers([])
                }
            } catch (err) {
                setError("Không thể tải danh sách offers")
                console.error("Error fetching offers:", err)
                setOffers([])
            } finally {
                setLoading(false)
            }
        },
        [getAllOffersInPost],
    )

    const updateOfferStatus = useCallback((offerId: string, status: number) => {
        setOffers((prev) => prev.map((offer) => (offer.offerID === offerId ? { ...offer, offerStatus: status } : offer)))
    }, [])

    return {
        offers,
        loading,
        error,
        fetchOffers,
        updateOfferStatus,
    }
}
