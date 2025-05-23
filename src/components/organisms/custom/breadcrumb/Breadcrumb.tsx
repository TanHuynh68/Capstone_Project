import { BreadcrumbItem } from "@/components/molecules/custom/breadcrumb/BreadcrumbItem";

export interface BreadcrumbData {
  href: string;
  title: string;
}

interface BreadcrumbProps {
  items: BreadcrumbData[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={item.href}
          href={item.href}
          title={item.title}
          isLast={index === items.length - 1}
        />
      ))}
    </nav>
  );
};
