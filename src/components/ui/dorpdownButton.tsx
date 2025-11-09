import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const dropdownButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none hover:bg-accent dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        ghost: "bg-transparent",
      },
      size: {
        default: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
);

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof dropdownButtonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(dropdownButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

DropdownButton.displayName = "DropdownButton";
