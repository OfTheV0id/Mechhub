import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { cn } from "../../shared/utils";

interface LandingSectionMotionProps extends PropsWithChildren {
    className?: string;
    delay?: number;
}

export const LandingSectionMotion = ({
    children,
    className,
    delay = 0,
}: LandingSectionMotionProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 52, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
                delay,
            }}
            className={cn(className)}
        >
            {children}
        </motion.section>
    );
};
