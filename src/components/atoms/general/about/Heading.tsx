import type { ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

export default function Heading({
  level,
  children,
  className = "",
}: HeadingProps) {
  const baseStyles = "font-bold text-foreground";

  const sizeStyles = {
    1: "text-4xl md:text-5xl mb-6",
    2: "text-3xl md:text-4xl mb-5",
    3: "text-2xl md:text-3xl mb-4",
    4: "text-xl md:text-2xl mb-3",
    5: "text-lg md:text-xl mb-2",
    6: "text-base md:text-lg mb-2",
  };

  const props = {
    className: `${baseStyles} ${sizeStyles[level]} ${className}`,
    children,
  };

  switch (level) {
    case 1:
      return <h1 {...props} />;
    case 2:
      return <h2 {...props} />;
    case 3:
      return <h3 {...props} />;
    case 4:
      return <h4 {...props} />;
    case 5:
      return <h5 {...props} />;
    case 6:
      return <h6 {...props} />;
    default:
      return <h1 {...props} />;
  }
}
