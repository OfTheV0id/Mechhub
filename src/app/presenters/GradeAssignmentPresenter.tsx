import { useGradeAssignmentState, type AssignmentStudentSubmission } from "@hooks";
import { GradeAssignmentView } from "@views/assignment";

interface GradeAssignmentPresenterProps {
    assignmentTitle: string;
    students: AssignmentStudentSubmission[];
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
    const gradeState = useGradeAssignmentState({ students, onSaveGrade });

    return (
        <GradeAssignmentView
            assignmentTitle={assignmentTitle}
            currentStudentIndex={gradeState.currentStudentIndex}
            totalStudents={students.length}
            currentStudent={gradeState.currentStudent}
            score={gradeState.score}
            maxScore={gradeState.maxScore}
            feedback={gradeState.feedback}
            onFeedbackChange={gradeState.handleFeedbackChange}
            onScoreChange={gradeState.handleScoreChange}
            onPrevStudent={gradeState.handlePrevStudent}
            onNextStudent={gradeState.handleNextStudent}
            onSaveGrade={gradeState.handleSaveGrade}
            onCancel={onCancel}
            students={students}
            isLoading={gradeState.isLoading}
        />
    );
};
