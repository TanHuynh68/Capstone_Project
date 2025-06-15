import type { ReactNode } from "react";
import Heading from "@/components/atoms/general/about/Heading";
import Paragraph from "@/components/atoms/general/about/Paragraph";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <Heading level={3} className="text-xl mb-2 text-foreground">
        {title}
      </Heading>
      <Paragraph size="md" className="text-muted-foreground">
        {description}
      </Paragraph>
    </div>
  );
}
