interface ProfileFieldsProps {
    name: string;
    role: string;
    isEditing: boolean;
    onNameChange: (value: string) => void;
}

export const ProfileFields = ({
    name,
    role,
    isEditing,
    onNameChange,
}: ProfileFieldsProps) => {
    return (
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    姓名
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-[1.5rem] border bg-white text-slate-900 transition-all shadow-sm font-medium ${
                        isEditing
                            ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    职业 / 学位
                </label>
                <input
                    type="text"
                    value={role}
                    disabled
                    className="w-full px-4 py-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 text-slate-600 transition-all shadow-sm font-medium"
                />
            </div>
        </div>
    );
};
