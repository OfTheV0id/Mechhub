import { MechHubLogo } from "../../shared/MechHubLogo";
import { LandingActions } from "./LandingActions";

interface LandingHeaderProps {
    onLogin: () => void;
}

export const LandingHeader = ({ onLogin }: LandingHeaderProps) => {
    return (
        <header className="">
            <div className="flex w-full items-center justify-between py-3 px-12 ">
                <MechHubLogo className="origin-left" />
                <LandingActions onLogin={onLogin} />
            </div>
        </header>
    );
};
