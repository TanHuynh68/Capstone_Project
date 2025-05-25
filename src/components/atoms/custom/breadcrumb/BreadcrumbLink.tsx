
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BreadcrumbLinkProps {
  href: string;
  title: string;
  isLast?: boolean;
}

export const BreadcrumbLink = ({ href, title, isLast }: BreadcrumbLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors",
        isLast ? "text-muted-foreground pointer-events-none" : "text-primary hover:underline"
      )}
      aria-current={isLast ? "page" : undefined}
    >
      {title}
    </Link>
  );
};
