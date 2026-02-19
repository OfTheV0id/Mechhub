import { motion } from "framer-motion";
import { Button } from "../../shared/ui/button";

interface LandingHeroProps {
    onStart: () => void;
}

export const LandingHero = ({ onStart }: LandingHeroProps) => {
    return (
        <div className="my-12 flex-1 flex-col justify-center md:my-0 md:flex">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10 font-['Abhaya_Libre'] text-5xl leading-[1.1] font-bold tracking-tight text-[#0f172a] md:text-6xl lg:text-7xl"
            >
                Theoretical Mechanics,
                <br />
                Reimagined by AI.
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    onClick={onStart}
                    size="xl"
                    className="hover:scale-105 font-['courier_new'] font-extrabold"
                >
                    Start
                </Button>
            </motion.div>
        </div>
    );
};
