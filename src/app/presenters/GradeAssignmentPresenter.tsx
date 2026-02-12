import { useState } from "react";
import { GradeAssignmentView } from "@views/assignment";

interface StudentSubmission {
    id: string;
    studentName: string;
    submittedDate: string;
    status: "pending" | "graded";
    submission: string;
}

interface GradeAssignmentPresenterProps {
    assignmentTitle: string;
    students: StudentSubmission[];
    onSaveGrade: (
        studentId: string,
        score: number,
        feedback: string,
    ) => Promise<void>;
    onCancel: () => void;
}

export const GradeAssignmentPresenter = ({
    assignmentTitle,
    students,
    onSaveGrade,
    onCancel,
}: GradeAssignmentPresenterProps) => {
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const currentStudent = students[currentStudentIndex];
    const maxScore = 100; // Default, could be passed as prop

    const handleScoreChange = (score: number) => {
        setScores({
            ...scores,
            [currentStudent.id]: Math.min(score, maxScore),
        });
    };

    const handleFeedbackChange = (feedback: string) => {
        setFeedbacks({
            ...feedbacks,
            [currentStudent.id]: feedback,
        });
    };

    const handleSaveGrade = async () => {
        try {
            setIsLoading(true);
            await onSaveGrade(
                currentStudent.id,
                scores[currentStudent.id] || 0,
                feedbacks[currentStudent.id] || "",
            );
            // Move to next student if available
            if (currentStudentIndex < students.length - 1) {
                setCurrentStudentIndex(currentStudentIndex + 1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevStudent = () => {
        if (currentStudentIndex > 0) {
            setCurrentStudentIndex(currentStudentIndex - 1);
        }
    };

    const handleNextStudent = () => {
        if (currentStudentIndex < students.length - 1) {
            setCurrentStudentIndex(currentStudentIndex + 1);
        }
    };

    return (
        <GradeAssignmentView
            assignmentTitle={assignmentTitle}
            currentStudentIndex={currentStudentIndex}
            totalStudents={students.length}
            studentName={currentStudent.studentName}
            studentSubmission={currentStudent.submission}
            submissionDate={currentStudent.submittedDate}
            score={scores[currentStudent.id] || 0}
            maxScore={maxScore}
            feedback={feedbacks[currentStudent.id] || ""}
            onFeedbackChange={handleFeedbackChange}
            onScoreChange={handleScoreChange}
            onPrevStudent={handlePrevStudent}
            onNextStudent={handleNextStudent}
            onSaveGrade={handleSaveGrade}
            students={students}
            isLoading={isLoading}
        />
    );
};
