import React, { useState } from "react";

interface DualLogoProps {
  logo1Src?: string;
  logo2Src?: string;
  logo1Alt?: string;
  logo2Alt?: string;
  logo1Size?: { width: number; height: number };
  logo2Size?: { width: number; height: number };
  spacing?: number;
  className?: string;
}

const DualLogo: React.FC<DualLogoProps> = ({
  logo1Src = "/images/logo.png",
  logo2Src = "/images/logo-text.png",
  logo1Alt = "Logo 1",
  logo2Alt = "Logo 2",
  logo1Size = { width: 60, height: 60 },
  logo2Size = { width: 200, height: 60 },
  spacing = 8,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      style={{ gap: `${spacing}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <video
          src="/images/test2.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: `${logo1Size.width}px`,
            height: `${logo1Size.height}px`,
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <img
          src={logo1Src}
          alt={logo1Alt}
          className="object-contain"
          style={{
            width: `${logo1Size.width}px`,
            height: `${logo1Size.height}px`,
            display: "block",
          }}
        />
      )}
      <img
        src={logo2Src}
        alt={logo2Alt}
        className="object-contain"
        style={{
          width: `${logo2Size.width}px`,
          height: `${logo2Size.height}`,
          display: "block",
        }}
      />
    </div>
  );
};

export default DualLogo;
