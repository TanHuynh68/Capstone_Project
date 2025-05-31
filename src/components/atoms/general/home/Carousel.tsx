import { useEffect, useState } from "react";

interface CarouselProps {
  images: { src: string; alt: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden">
      <div className="relative flex w-full max-w-[90vw] h-[60vh] justify-center items-center">
        {images.map((image, index) => {
 
          const isCenter = index === currentIndex;
          const isLeft = index === (currentIndex - 1 + images.length) % images.length;
          const isRight = index === (currentIndex + 1) % images.length;

          return (
            <div
              key={index}
              className={`absolute flex flex-col items-center p-5 transition-all duration-700 ease-in-out
                w-[600px] h-[400px] opacity-90
                ${isCenter ? "scale-115 z-20 opacity-100" : "scale-100 z-10"}
                ${isLeft ? "-translate-x-[600px]" : ""}
                ${isRight ? "translate-x-[600px]" : ""}`}
              
            >
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover rounded-2xl shadow-xl" />

              {/* Indicators */}
              {isCenter && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-gray-800/30 text-white rounded-full"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-gray-800/30 text-white rounded-full"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
