import React from "react";
import { Settings } from "lucide-react";

interface MechHubLogoProps {
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    onIconClick?: (e: React.MouseEvent) => void;
}

export const MechHubLogo: React.FC<MechHubLogoProps> = ({
    className = "",
    onClick,
    onIconClick,
}) => {
    // Standardize to Landing Page style
    const iconSize = 24;
    const paddingClass = "p-2";
    const bgClass = "bg-black text-white rounded-lg";

    // Both use 32px font size effectively
    const textClass = "text-[32px] font-bold tracking-tight";

    return (
        <div
            className={`flex items-center gap-3 select-none ${className}`}
            onClick={onClick}
        >
            <div
                className={`${bgClass} ${paddingClass} cursor-pointer hover:opacity-90 transition-all flex-shrink-0`}
                onClick={onIconClick}
            >
                <Settings
                    className="animate-[spin_10s_linear_infinite]"
                    size={iconSize}
                    strokeWidth={2.5}
                />
            </div>
            <span
                className={textClass}
                style={{ fontFamily: "Courier New, monospace" }}
            >
                MechHub
            </span>
        </div>
    );
};
