import React from "react";
import { Database } from "lucide-react";

export const ProfileHeader: React.FC = () => {
    return (
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6 select-none">
            <Database className="h-6 w-6 text-emerald-400" />
            <div>
                <h1 className="text-lg font-bold tracking-wider">
                    SEC_REGISTRY // ARCHIVE_INDEX
                </h1>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                    Persistent Historic Audit Trail Ledger
                </p>
            </div>
        </div>
    );
};
