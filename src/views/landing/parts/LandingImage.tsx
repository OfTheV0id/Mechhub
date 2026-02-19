import { motion } from "framer-motion";

export const LandingImage = () => {
    return (
        <div className="flex-1 flex items-center justify-center w-full min-h-[25rem]">
            <motion.div
                animate={{
                    y: [0, -24, 0, 12, 0],
                    rotate: [0, 1.8, 0, -1.8, 0],
                }}
                transition={{
                    y: {
                        duration: 5.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    rotate: {
                        duration: 6.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
                className="w-full max-w-[28.125rem] aspect-square relative"
            >
                <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F31b33db0871d4fe191b620f6b8c8dbda%2F5b0b4634fb5e430086e8d0a8803c7279"
                    alt="Gyroscope"
                    className="h-full w-full object-contain"
                />
            </motion.div>
        </div>
    );
};
