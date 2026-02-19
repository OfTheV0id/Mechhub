const CURRENT_YEAR = new Date().getFullYear();

export const LandingFooter = () => {
    return (
        <footer className="py-12 font-bold font-['courier_new']">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <p className="text-sm text-slate-400">
                    {`(c) ${CURRENT_YEAR} MechHub AI. All rights reserved.`}
                </p>
                <div className="flex gap- ">
                    <span className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-slate-600 ">
                        Privacy Policy
                    </span>
                    <span className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-slate-600">
                        Terms of Service
                    </span>
                </div>
            </div>
        </footer>
    );
};
