import AssessmentRenderer from "./AssessmentRenderer";

const AssignmentRenderer = ({ node, enrollmentId, onSubmit }) => {
    return (
        <AssessmentRenderer
            node={node}
            enrollmentId={enrollmentId}
            onComplete={onSubmit}
            forceType="assignment"
        />
    );
};

export default AssignmentRenderer;
