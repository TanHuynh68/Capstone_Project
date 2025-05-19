import { useEffect, useState } from "react";
import "../../index.css";

interface AnimatedTextProps {
  texts: string[]; // Mảng các đoạn text
  className?: string;
  speed?: number; // tốc độ gõ
  eraseSpeed?: number; // tốc độ xóa
  delayBetweenLoops?: number; // delay giữa các vòng
  delayBetweenTexts?: number; // delay giữa khi gõ xong và bắt đầu xóa
}

export default function AnimatedText({
  texts,
  className = "",
  speed = 80,
  eraseSpeed = 40,
  delayBetweenLoops = 1500,
  delayBetweenTexts = 1000,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[textIndex];

    if (!isErasing && charIndex < currentText.length) {
      // Gõ từng ký tự
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, speed);
    } else if (!isErasing && charIndex === currentText.length) {
      // Đợi trước khi xóa
      timeout = setTimeout(() => setIsErasing(true), delayBetweenTexts);
    } else if (isErasing && charIndex > 0) {
      // Xóa từng ký tự
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, eraseSpeed);
    } else if (isErasing && charIndex === 0) {
      // Sau khi xóa xong, chuyển sang đoạn tiếp theo
      timeout = setTimeout(() => {
        setIsErasing(false);
        setTextIndex((prev) => (prev + 1) % texts.length); // Lặp lại
      }, delayBetweenLoops);
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    isErasing,
    texts,
    textIndex,
    speed,
    eraseSpeed,
    delayBetweenTexts,
    delayBetweenLoops,
  ]);

  return (
    <h2 className={className} style={{ minHeight: "1em" }}>
      {displayedText}
      <span className="inline-block w-[1px] bg-black animate-blink ml-1" />
    </h2>
  );
}
