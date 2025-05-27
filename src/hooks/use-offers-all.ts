"use client"

import { useEffect } from "react"
import { useOffers } from "./use-offers"

export function useOffersAll(postId: string) {
    const { offers, loading, error, fetchOffers } = useOffers()

    useEffect(() => {
        fetchOffers(postId)
    }, [postId, fetchOffers])

    const refetch = () => fetchOffers(postId)

    return {
        offers,
        loading,
        error,
        refetch
    }
} 