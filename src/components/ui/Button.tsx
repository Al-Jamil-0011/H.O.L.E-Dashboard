"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "primary";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Note: Simple asChild implementation. In a real project with Radix, 
    // we would use Slot. Here we'll just handle the common case of Link.
    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(
          buttonVariants({ variant, size }),
          className,
          child.props.className
        ),
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

function buttonVariants({ 
  variant = "default", 
  size = "default" 
}: { 
  variant?: ButtonProps["variant"]; 
  size?: ButtonProps["size"] 
}) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  const variants = {
    default: "bg-primary text-background shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]",
    primary: "bg-primary text-background shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]",
    outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground",
    ghost: "hover:bg-muted hover:text-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-10 text-base",
    icon: "h-11 w-11",
  };

  return cn(base, variants[variant as keyof typeof variants] || variants.default, sizes[size as keyof typeof sizes] || sizes.default);
}

export { Button, buttonVariants };
