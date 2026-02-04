import { useState, useCallback, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { Box } from "@mui/material";
import LessonHeader from "./LessonHeader";
import SessionControl from "./SessionControl";
import BlockRenderer from "../Renderers/BlockRenderer";
import VideoRenderer from "../Renderers/VideoRenderer";
import TextRenderer from "../Renderers/TextRenderer";
import QuizRenderer from "../Renderers/QuizRenderer";
import AssignmentRenderer from "../Renderers/AssignmentRenderer";

const Whiteboard = ({
    node,
    prevNode,
    nextNode,
    courseId,
    isCompleted = false,
    onVideoProgress,
}) => {
    const nodeId = node?.id;
    const [videoRequirementMet, setVideoRequirementMet] = useState(false);
    const completionInFlightRef = useRef(false);

    const handleNavigate = (destination) => {
        router.visit(
            `/student/programs/${courseId}/session/${destination.id}/`,
        );
    };

    const handleComplete = () => {
        if (isCompleted || completionInFlightRef.current) return;
        completionInFlightRef.current = true;

        // POST to mark complete
        router.post(
            `/student/programs/${courseId}/session/${nodeId}/`,
            {
                mark_complete: true,
            },
            {
                preserveScroll: true,
                only: ["isCompleted", "curriculum"],
                onFinish: () => {
                    completionInFlightRef.current = false;
                },
            },
        );
    };

    const handleVideoRequirementMet = useCallback(() => {
        setVideoRequirementMet(true);
    }, []);

    useEffect(() => {
        setVideoRequirementMet(false);
        completionInFlightRef.current = false;
    }, [nodeId]);

    if (!node) return null;

    // Check if node has content blocks (new multi-block model) - memoized for performance
    const blocks = node?.blocks || [];
    const hasBlocks = blocks.length > 0;

    // Check if there's a video block with required progress
    const hasVideoRequirement = (() => {
        if (!node) return false;
        if (!hasBlocks) {
            const lessonType = (
                node.properties?.lesson_type ||
                node.lessonType ||
                ""
            ).toLowerCase();
            return (
                (lessonType === "video" || lessonType === "video_lesson") &&
                node.properties?.required_progress > 0
            );
        }
        return blocks.some(
            (b) =>
                b.type?.toUpperCase() === "VIDEO" &&
                b.data?.required_progress > 0,
        );
    })();

    const requiredProgress = (() => {
        if (!node) return 0;
        if (!hasBlocks) return node.properties?.required_progress || 0;
        const videoBlock = blocks.find(
            (b) =>
                b.type?.toUpperCase() === "VIDEO" &&
                b.data?.required_progress > 0,
        );
        return videoBlock?.data?.required_progress || 0;
    })();

    const renderBlocks = () => {
        return blocks.map((block) => (
            <BlockRenderer
                key={block.id}
                block={block}
                enrollmentId={courseId}
                nodeId={nodeId}
                onComplete={handleComplete}
                onVideoProgress={onVideoProgress}
                onVideoRequirementMet={handleVideoRequirementMet}
            />
        ));
    };

    const renderLegacyContent = () => {
        // Fallback: Normalize type from various property sources
        const type = (node.type || node.nodeType || "lesson").toLowerCase();
        const lessonType = (
            node.properties?.lesson_type ||
            node.lessonType ||
            ""
        ).toLowerCase();

        // 1. Quiz
        if (type === "quiz" || lessonType === "quiz") {
            return (
                <QuizRenderer
                    node={node}
                    enrollmentId={courseId}
                    onComplete={handleComplete}
                />
            );
        }

        // 2. Assignment
        if (type === "assignment" || lessonType === "assignment") {
            return (
                <AssignmentRenderer
                    node={node}
                    enrollmentId={courseId}
                    onSubmit={handleComplete}
                />
            );
        }

        // 3. Video
        if (
            type === "video_lesson" ||
            lessonType === "video" ||
            lessonType === "video_lesson"
        ) {
            return (
                <VideoRenderer
                    url={node.properties?.video_url}
                    onProgress={onVideoProgress}
                    requiredProgress={node.properties?.required_progress || 0}
                    onRequirementMet={handleVideoRequirementMet}
                />
            );
        }

        // 4. Text (Default) - render HTML content
        return (
            <TextRenderer
                title={node.title}
                content={node.properties?.content || node.contentHtml || ""}
            />
        );
    };

    // Determine if completion is allowed
    const canComplete =
        !hasVideoRequirement || videoRequirementMet || isCompleted;
    const completionTooltip =
        hasVideoRequirement && !videoRequirementMet && !isCompleted
            ? `Watch at least ${requiredProgress}% of the video to mark complete`
            : "";

    if (!node) return null;

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
        >
            {/* Header: Type Label + Title */}
            <LessonHeader title={node.title} node={node} />

            {/* Content Area */}
            <Box sx={{ flexGrow: 1 }}>
                {hasBlocks ? renderBlocks() : renderLegacyContent()}
            </Box>

            {/* Footer Navigation */}
            <SessionControl
                prevNode={prevNode}
                nextNode={nextNode}
                isCompleted={isCompleted}
                onComplete={handleComplete}
                onNavigate={handleNavigate}
                canComplete={canComplete}
                completionTooltip={completionTooltip}
            />
        </Box>
    );
};

export default Whiteboard;
