import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Extended variants for each status to have distinct colors
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        // Custom variants per status for visual clarity and appeal
        dealed:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 focus-visible:ring-green-300",
        deposited:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus-visible:ring-yellow-300",
        done: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus-visible:ring-blue-300",
        notStarted:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300",
        withdrawed:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus-visible:ring-red-300",

        accepted:
          "border-transparent bg-green-200 text-green-900 hover:bg-green-300 focus-visible:ring-green-400",
        dealing:
          "border-transparent bg-yellow-200 text-yellow-900 hover:bg-yellow-300 focus-visible:ring-yellow-400",
        pending:
          "border-transparent bg-orange-200 text-orange-900 hover:bg-orange-300 focus-orange:ring-orange-400",
        rejected:
          "border-transparent bg-red-200 text-red-900 hover:bg-red-300 focus-visible:ring-red-400",
                          warning: "border-transparent bg-yellow-200 text-yellow-800",
        success: "border-transparent bg-green-200 text-green-800 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function CustomBadge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { CustomBadge, badgeVariants };
