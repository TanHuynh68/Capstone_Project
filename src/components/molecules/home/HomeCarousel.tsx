import Carousel from "@/components/atoms/home/Carousel";
import labubu1 from '@/assets/labubu1.png';
import labubu2 from '@/assets/labubu2.png';
import labubu3 from '@/assets/labubu3.png';
// Sử dụng component
const images = [
  {
    src: labubu1,
    alt: "Banner 1",
  },
  {
    src: labubu2,
    alt: "Banner 2",
  },
  {
    src: labubu3,
    alt: "Banner 3",
  },
];

const HomeCarousel = () => {
  return (
    <div className="mt-5">
      <Carousel images={images} />
    </div>
  );
};

export default HomeCarousel;
