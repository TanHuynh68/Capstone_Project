import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  logoSize?: { width: number; height: number };
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  logoSize = { width: 280, height: 40 },
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        width: `${logoSize.width}px`,
        height: `${logoSize.height}px`,
      }}
    >
      <img
        src={
          isHovered ? "/images/animation_logo.gif" : "/images/logo_and_text.png"
        }
        alt="Logo"
        className="object-contain"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

export default Logo;
