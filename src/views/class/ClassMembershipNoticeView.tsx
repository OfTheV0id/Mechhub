import { AlertCircle } from "lucide-react";

interface ClassMembershipNoticeViewProps {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

export const ClassMembershipNoticeView = ({
    title,
    description,
    actionLabel,
    onAction,
}: ClassMembershipNoticeViewProps) => {
    return (
        <div className="flex h-full items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <AlertCircle size={24} />
                </div>

                <h2 className="font-serif-heading mt-5 text-4xl font-bold text-slate-900">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
                    {description}
                </p>

                <button
                    type="button"
                    onClick={onAction}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85"
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
};
