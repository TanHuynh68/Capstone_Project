import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export default function ScoreDisplay({ score, className }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-600 bg-green-50 border-green-200";
    if (score < 0) return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getScorePrefix = (score: number) => {
    if (score > 0) return "+";
    return "";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold border",
        getScoreColor(score),
        className
      )}
    >
      {getScorePrefix(score)}
      {score}
    </div>
  );
}
