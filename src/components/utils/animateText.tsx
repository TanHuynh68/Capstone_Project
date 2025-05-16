import { useEffect, useState } from "react";
import "../../index.css";
interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number; // tốc độ gõ từng ký tự (ms)
  loop?: boolean;
  eraseSpeed?: number; // tốc độ xóa từng ký tự (ms)
  delayBetweenLoops?: number; // delay trước khi xóa/gõ lại (ms)
}

export default function AnimatedText({
  text,
  className = "",
  speed = 80,
  loop = false,
  eraseSpeed = 40,
  delayBetweenLoops = 1500,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!erasing && index < text.length) {
      // Gõ từng ký tự
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
    } else if (!erasing && index === text.length && loop) {
      // Tạm dừng trước khi bắt đầu xóa
      timeout = setTimeout(() => setErasing(true), delayBetweenLoops);
    } else if (erasing && index > 0) {
      // Xóa từng ký tự
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, eraseSpeed);
    } else if (erasing && index === 0 && loop) {
      // Sau khi xóa xong thì bắt đầu gõ lại
      timeout = setTimeout(() => setErasing(false), delayBetweenLoops);
    }

    return () => clearTimeout(timeout);
  }, [index, erasing, text, speed, eraseSpeed, loop, delayBetweenLoops]);

  return (
    <h2 className={className} style={{ minHeight: "1em" }}>
      {displayedText}
      <span className="inline-block w-[1px] bg-black animate-blink ml-1" />
    </h2>
  );
}
