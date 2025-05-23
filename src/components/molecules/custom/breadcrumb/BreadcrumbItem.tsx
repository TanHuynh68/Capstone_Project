import { Separator } from "@/components/ui/separator";
import { BreadcrumbLink } from "@/components/atoms/custome/breadcrumb/BreadcrumbLink";

interface BreadcrumbItemProps {
  href: string;
  title: string;
  isLast: boolean;
}

export const BreadcrumbItem = ({ href, title, isLast }: BreadcrumbItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <BreadcrumbLink href={href} title={title} isLast={isLast} />
      {!isLast && <Separator orientation="vertical" className="h-4" />}
    </div>
  );
};
