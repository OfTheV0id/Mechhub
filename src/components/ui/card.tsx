import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva("border", {
    variants: {
        variant: {
            surface: "border-border-soft bg-surface",
            glass: "border-white/50 bg-surface-glass",
        },
        radius: {
            lg: "rounded-lg",
            xl: "rounded-xl",
            "3xl": "rounded-3xl",
            hero: "rounded-hero",
        },
        shadow: {
            sm: "shadow-sm",
            lg: "shadow-lg",
            xl: "shadow-2xl",
        },
        padding: {
            none: "",
            lg: "p-(--space-8)",
        },
    },
    defaultVariants: {
        variant: "surface",
        radius: "xl",
        shadow: "sm",
        padding: "none",
    },
});

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, radius, shadow, padding, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                cardVariants({ variant, radius, shadow, padding }),
                className,
            )}
            {...props}
        />
    ),
);

Card.displayName = "Card";

export { Card, cardVariants };
