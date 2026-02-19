import React from "react";
import type { ActiveView } from "../shared/types";

interface MainLayoutViewProps {
    activeView: ActiveView;
    sidebar: React.ReactNode;
    home: React.ReactNode;
    chat: React.ReactNode;
    profile: React.ReactNode;
    classHub?: React.ReactNode;
    submitAssignment?: React.ReactNode;
    viewFeedback?: React.ReactNode;
    publishAssignment?: React.ReactNode;
    gradeAssignment?: React.ReactNode;
}

export const MainLayoutView = ({
    activeView,
    sidebar,
    home,
    chat,
    profile,
    classHub,
    submitAssignment,
    viewFeedback,
    publishAssignment,
    gradeAssignment,
}: MainLayoutViewProps) => {
    return (
        <div className="flex h-screen">
            {sidebar}

            <main className="flex-1 relative ">
                {activeView === "home" && home}
                {activeView === "chat" && chat}
                {activeView === "profile" && profile}
                {activeView === "classHub" && classHub}
                {activeView === "submitAssignment" && submitAssignment}
                {activeView === "viewFeedback" && viewFeedback}
                {activeView === "publishAssignment" && publishAssignment}
                {activeView === "gradeAssignment" && gradeAssignment}
            </main>
        </div>
    );
};
