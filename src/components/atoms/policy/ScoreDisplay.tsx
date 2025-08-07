import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export default function ScoreDisplay({ score, className }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-600 bg-green-50";
    if (score < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getScorePrefix = (score: number) => {
    if (score > 0) return "+";
    return "";
  };

  return (
    <div className={cn(
      "inline-flex items-center justify-center px-2 py-1 rounded-md text-sm font-medium",
      getScoreColor(score),
      className
    )}>
      {getScorePrefix(score)}{score}
    </div>
  );
}
