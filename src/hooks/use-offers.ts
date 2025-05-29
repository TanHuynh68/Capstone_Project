"use client"

import { useState, useCallback } from "react"
import OfferService from "@/services/OfferService"

export function useOffers() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { getAllOffersInPost } = OfferService()

    const fetchOffers = useCallback(async (postId?: string) => {
        if (!postId) {
            setOffers([])
            return
        }
        setLoading(true)
        setError(null)
        try {
            const response = await getAllOffersInPost({ projectPostID: postId, page: 1, size: 10 })
            if (response?.isSuccess && response.responseRequestModel?.responseList?.items) {
                setOffers(response.responseRequestModel.responseList.items)
            } else {
                setOffers([])
            }
        } catch (err) {
            setError("Failed to fetch offers")
            console.error(err)
            setOffers([])
        } finally {
            setLoading(false)
        }
    }, [getAllOffersInPost])

    const resetOffers = useCallback(() => {
        setOffers([])
        setError(null)
    }, [])

    const updateOfferStatus = useCallback(async (offerId: string, status: number) => {
        try {
            // Update local state first for immediate feedback
            setOffers(prev => prev.map(offer =>
                offer.offerID === offerId ? { ...offer, offerStatus: status } : offer
            ))
            // Refresh offers to ensure consistency with server
            const currentPostId = offers[0]?.projectPostID
            if (currentPostId) {
                await fetchOffers(currentPostId)
            }
        } catch (err) {
            setError("Failed to update offer status")
            console.error(err)
        }
    }, [offers, fetchOffers])

    return {
        offers,
        loading,
        error,
        fetchOffers,
        updateOfferStatus,
        resetOffers,
    }
}
