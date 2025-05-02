"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CarouselImage {
  src: string
  alt: string
}

interface FullScreenCarouselProps {
  images: CarouselImage[]
  autoPlayInterval?: number // in milliseconds, set to 0 to disable
  transitionDuration?: number // in milliseconds
}

export function FullScreenCarousel({
  images,
  autoPlayInterval = 5000, // 5 seconds default
  transitionDuration = 500, // 0.5 seconds default
}: FullScreenCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const goToNext = useCallback(() => {
    if (isTransitioning) return

    setDirection("right")
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      setIsTransitioning(false)
    }, transitionDuration)
  }, [images.length, isTransitioning, transitionDuration])

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return

    setDirection("left")
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
      setIsTransitioning(false)
    }, transitionDuration)
  }, [images.length, isTransitioning, transitionDuration])

  // Auto play functionality
  useEffect(() => {
    if (!autoPlayInterval) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlayInterval, goToNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrevious])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Calculate previous and next indices
  const prevIndex = (currentIndex - 1 + images.length) % images.length
  const nextIndex = (currentIndex + 1) % images.length

  // Transition styles based on direction and state
  const getImageStyle = (index: number) => {
    const transitionStyle = {
      transition: `transform ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`,
    }

    if (index === currentIndex) {
      return {
        ...transitionStyle,
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning
          ? `scale(0.95) translateX(${direction === "right" ? "-5%" : "5%"})`
          : "scale(1) translateX(0)",
        zIndex: 10,
      }
    }

    if (index === prevIndex && direction === "left" && isTransitioning) {
      return {
        ...transitionStyle,
        opacity: 1,
        transform: "scale(1) translateX(0)",
        zIndex: 20,
      }
    }

    if (index === nextIndex && direction === "right" && isTransitioning) {
      return {
        ...transitionStyle,
        opacity: 1,
        transform: "scale(1) translateX(0)",
        zIndex: 20,
      }
    }

    return {
      ...transitionStyle,
      opacity: 0,
      transform: index < currentIndex ? "scale(0.95) translateX(-5%)" : "scale(0.95) translateX(5%)",
      zIndex: 0,
    }
  }

  if (!images.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">No images to display</div>
    )
  }

  return (
    <div
      className="relative h-[90vh] w-full overflow-hidden bg-black "
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}

    >
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 h-full w-full"
          style={getImageStyle(index)}
          aria-hidden={index !== currentIndex}
        >
          <img src={image.src || "/placeholder.svg"} alt={image.alt} className="object-center h-[100vh] w-full  " />
        </div>
      ))}

      {/* Navigation controls */}
      <button
        onClick={goToPrevious}
        className="group absolute left-0 top-0 z-30 flex h-full w-1/5 items-center justify-start px-4 focus:outline-none"
        aria-label="Previous image"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 group-hover:bg-black/50 group-focus:bg-black/50">
          <ChevronLeft className="h-8 w-8" />
        </div>
      </button>

      <button
        onClick={goToNext}
        className="group absolute right-0 top-0 z-30 flex h-full w-1/5 items-center justify-end px-4 focus:outline-none"
        aria-label="Next image"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 group-hover:bg-black/50 group-focus:bg-black/50">
          <ChevronRight className="h-8 w-8" />
        </div>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return
              setDirection(index > currentIndex ? "right" : "left")
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, transitionDuration)
            }}
            className={cn(
              "mx-1 h-2 w-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80",
            )}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}
