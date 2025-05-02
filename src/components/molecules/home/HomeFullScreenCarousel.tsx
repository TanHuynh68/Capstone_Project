import { CarouselImage, FullScreenCarousel } from "@/components/atoms/home/FullScreenCarousel"
import Variant4 from '@/assets/Variant4.png';
import Variant5 from '@/assets/Variant5.png';
import Variant6 from '@/assets/Variant6.png';

// Sample images for demonstration
const images: CarouselImage[] = [
  {
    src: Variant4,
    alt: "Scenic mountain landscape with a lake",
  },
  {
    src: Variant5,
    alt: "Beach sunset with palm trees",
  },
  {
    src: Variant6,
    alt: "Urban cityscape at night",
  },
]

export default function HomeFullScreenCarousel() {
  return (
    <div className="flex flex-col min-h-screen">
      <FullScreenCarousel images={images} />
    </div>
  )
}
