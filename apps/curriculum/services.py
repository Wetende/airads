"""
Curriculum services - Node properties handling and validation.
"""
import os
from typing import Dict, Any
from django.conf import settings

from .models import CurriculumNode


class NodePropertiesService:
    """Service for handling node properties."""

    def merge_properties(self, node: CurriculumNode, new_properties: Dict[str, Any]) -> Dict[str, Any]:
        """
        Merge new properties with existing properties.
        Existing keys not in the update are preserved.
        
        Args:
            node: The curriculum node to update
            new_properties: New properties to merge
            
        Returns:
            The merged properties dictionary
        """
        existing = node.properties or {}
        merged = {**existing, **new_properties}
        node.properties = merged
        return merged

    def get_required_properties(self, node_type: str) -> list:
        """
        Get required properties for a node type.
        Configured in Django settings.
        """
        required_props = getattr(settings, 'CURRICULUM_NODE_REQUIRED_PROPERTIES', {})
        return required_props.get(node_type, [])

    def validate_required_properties(self, node: CurriculumNode) -> bool:
        """
        Validate that a node has all required properties for its type.
        
        Raises:
            ValidationError: If required properties are missing
        """
        from django.core.exceptions import ValidationError
        
        required = self.get_required_properties(node.node_type)
        properties = node.properties or {}
        
        missing = [prop for prop in required if prop not in properties]
        
        if missing:
            raise ValidationError(
                f"Missing required properties for {node.node_type}: {missing}"
            )
        
        return True


class CoursePublishValidationService:
    """
    Service for validating course readiness for publishing.
    Checks assessments, weights, and mode-specific requirements.
    """
    
    def validate_for_publish(self, program) -> Dict[str, Any]:
        """
        Comprehensive validation for course publishing.
        
        Returns dict with:
            - is_valid: bool
            - errors: list of error dicts with {type, message, node_id, node_title}
            - warnings: list of warning dicts with {type, message, node_id, node_title}
            - details: detailed validation results
        """
        errors = []
        warnings = []
        details = {}

        def _normalize_assignment_mode(props):
            if not isinstance(props, dict):
                return "submission_only"
            explicit_mode = str(props.get("assignment_mode") or "").strip().lower()
            if explicit_mode in {"submission_only", "question_only", "mixed"}:
                return explicit_mode
            questions = props.get("questions", [])
            has_questions = isinstance(questions, list) and len(questions) > 0
            return "mixed" if has_questions else "submission_only"

        def _normalize_submission_type(raw_value):
            normalized = str(raw_value or "").strip().lower()
            mapping = {
                "file": "file",
                "file_upload": "file",
                "text": "text",
                "text_entry": "text",
                "both": "both",
                "external_link": "text",
                "media_recording": "text",
            }
            return mapping.get(normalized, "file")

        def _normalize_typed_response_mode(raw_value):
            normalized = str(raw_value or "").strip().lower()
            if normalized == "short_answer_question":
                return "short_answer_question"
            return "submission_text"

        def _assignment_requires_questions(mode, typed_response_mode):
            return mode in {"question_only", "mixed"} or (
                mode == "submission_only"
                and typed_response_mode == "short_answer_question"
            )

        def _assignment_requires_submission(mode, typed_response_mode):
            return mode == "mixed" or (
                mode == "submission_only"
                and typed_response_mode == "submission_text"
            )
        
        # Get all curriculum nodes for this program
        nodes = list(CurriculumNode.objects.filter(program=program))

        # Count node types (supports both explicit node_type and lesson_type payloads)
        lessons = [n for n in nodes if str(n.node_type or "").lower() == 'lesson']
        quizzes = [
            n
            for n in nodes
            if str(n.node_type or "").lower() == 'quiz'
            or str((n.properties or {}).get("lesson_type") or "").lower() == 'quiz'
        ]
        assignments = [
            n
            for n in nodes
            if str(n.node_type or "").lower() == 'assignment'
            or str((n.properties or {}).get("lesson_type") or "").lower() == 'assignment'
        ]

        details['lesson_count'] = len(lessons)
        details['quiz_count'] = len(quizzes)
        details['assignment_count'] = len(assignments)
        
        # Basic content check
        if len(lessons) == 0:
            errors.append({
                'type': 'missing_content',
                'message': 'Course must have at least 1 lesson',
                'node_id': None,
                'node_title': None
            })
        
        # Assessment requirements
        total_assessments = len(quizzes) + len(assignments)
        details['total_assessments'] = total_assessments
        
        if total_assessments == 0:
            errors.append({
                'type': 'missing_assessment',
                'message': 'Course must have at least 1 quiz or assignment',
                'node_id': None,
                'node_title': None
            })
        
        # Weight validation for assignments (theology mode requirement)
        assignment_weights = []
        for assignment in assignments:
            props = assignment.properties if isinstance(assignment.properties, dict) else {}
            weight = props.get('weight', 0)
            assignment_weights.append({
                'id': assignment.id,
                'title': assignment.title,
                'weight': weight
            })
            # Check individual assignment has weight set
            if weight == 0:
                warnings.append({
                    'type': 'missing_weight',
                    'message': f'Assignment has no weight set',
                    'node_id': assignment.id,
                    'node_title': assignment.title
                })

            assignment_mode = _normalize_assignment_mode(props)
            typed_response_mode = _normalize_typed_response_mode(
                props.get("typed_response_mode")
            )
            questions = props.get("questions", [])
            has_questions = isinstance(questions, list) and len(questions) > 0
            quiz_id = props.get("quiz_id")
            assignment_id = props.get("assignment_id")
            assessment_prompt = str(props.get("assessment_prompt") or "").strip()

            if not assessment_prompt:
                errors.append(
                    {
                        "type": "missing_assessment_prompt",
                        "message": "Assignment requires an assessment prompt",
                        "node_id": assignment.id,
                        "node_title": assignment.title,
                    }
                )

            raw_submission_type = str(props.get("submission_type") or "").strip().lower()
            normalized_submission_type = _normalize_submission_type(raw_submission_type)
            if (
                _assignment_requires_submission(assignment_mode, typed_response_mode)
                and raw_submission_type
                and raw_submission_type != normalized_submission_type
            ):
                errors.append(
                    {
                        "type": "invalid_submission_type_mapping",
                        "message": (
                            f"Assignment submission type '{raw_submission_type}' must be canonical "
                            f"({normalized_submission_type})"
                        ),
                        "node_id": assignment.id,
                        "node_title": assignment.title,
                    }
                )

            if _assignment_requires_questions(assignment_mode, typed_response_mode):
                if not has_questions:
                    errors.append(
                        {
                            "type": "invalid_assignment_mode_config",
                            "message": "Assignment mode requires questions, but no questions were found",
                            "node_id": assignment.id,
                            "node_title": assignment.title,
                        }
                    )
                if not quiz_id:
                    errors.append(
                        {
                            "type": "missing_assignment_question_link",
                            "message": "Assignment has questions but no linked question engine record",
                            "node_id": assignment.id,
                            "node_title": assignment.title,
                        }
                    )

            if _assignment_requires_submission(assignment_mode, typed_response_mode):
                if not assignment_id:
                    errors.append(
                        {
                            "type": "invalid_assignment_mode_config",
                            "message": "Assignment mode requires assignment submission settings, but assignment link is missing",
                            "node_id": assignment.id,
                            "node_title": assignment.title,
                        }
                    )
                if normalized_submission_type not in {"file", "text", "both"}:
                    errors.append(
                        {
                            "type": "invalid_submission_type_mapping",
                            "message": "Assignment submission type must be one of file/text/both",
                            "node_id": assignment.id,
                            "node_title": assignment.title,
                        }
                    )
        
        total_weight = sum(a['weight'] for a in assignment_weights)
        details['assignment_weights'] = assignment_weights
        details['total_assignment_weight'] = total_weight
        
        # Check mode-specific requirements
        mode = getattr(program, 'mode', None) or 'online'
        details['mode'] = mode
        
        if mode in ('theology', 'tvet'):
            # Theology/TVET modes require weights to sum to 100%
            if len(assignments) > 0 and total_weight != 100:
                errors.append({
                    'type': 'invalid_weight_sum',
                    'message': f'Assignment weights must sum to 100% (currently {total_weight}%)',
                    'node_id': None,
                    'node_title': None
                })
        else:
            # Online mode - just warn if weights don't sum to 100
            if len(assignments) > 0 and total_weight != 100:
                warnings.append({
                    'type': 'weight_recommendation',
                    'message': f'Assignment weights total {total_weight}% (recommended: 100%)',
                    'node_id': None,
                    'node_title': None
                })
        
        # Check for incomplete quizzes (no questions)
        incomplete_quizzes = []
        unlinked_quizzes = []
        for quiz in quizzes:
            quiz_props = quiz.properties or {}
            questions = quiz_props.get('questions', [])
            quiz_id = quiz_props.get('quiz_id')
            if len(questions) == 0:
                incomplete_quizzes.append({'id': quiz.id, 'title': quiz.title})
                errors.append({
                    'type': 'empty_quiz',
                    'message': f'Quiz has no questions',
                    'node_id': quiz.id,
                    'node_title': quiz.title
                })
            elif not quiz_id:
                unlinked_quizzes.append({'id': quiz.id, 'title': quiz.title})
                errors.append({
                    'type': 'missing_quiz_link',
                    'message': 'Quiz has questions but no linked assessment record',
                    'node_id': quiz.id,
                    'node_title': quiz.title
                })
        
        details['incomplete_quizzes'] = incomplete_quizzes
        details['unlinked_quizzes'] = unlinked_quizzes
        
        # Check for incomplete assignments (no instructions)
        incomplete_assignments = []
        for assignment in assignments:
            instructions = (assignment.properties or {}).get('instructions', '')
            if len(instructions) < 100:
                incomplete_assignments.append({'id': assignment.id, 'title': assignment.title})
                warnings.append({
                    'type': 'short_instructions',
                    'message': f'Assignment has short instructions ({len(instructions)}/100 chars)',
                    'node_id': assignment.id,
                    'node_title': assignment.title
                })
        
        details['incomplete_assignments'] = incomplete_assignments

        # Check document lessons (primary document + strict tracking readiness)
        media_root_abs = os.path.abspath(settings.MEDIA_ROOT)
        document_lessons = []
        invalid_document_lessons = []
        for lesson in nodes:
            lesson_props = lesson.properties if isinstance(lesson.properties, dict) else {}
            lesson_type = str(lesson_props.get("lesson_type") or "").lower()
            if lesson_type != "document":
                continue

            document_lessons.append({"id": lesson.id, "title": lesson.title})
            document = lesson_props.get("document")
            if not isinstance(document, dict):
                errors.append(
                    {
                        "type": "missing_document",
                        "message": "Document lesson has no primary document uploaded",
                        "node_id": lesson.id,
                        "node_title": lesson.title,
                    }
                )
                invalid_document_lessons.append(
                    {"id": lesson.id, "title": lesson.title, "reason": "missing_document"}
                )
                continue

            primary_document_url = str(document.get("original_url") or "").strip()
            primary_document_path = str(document.get("original_path") or "").strip()
            if not primary_document_url and not primary_document_path:
                errors.append(
                    {
                        "type": "missing_document",
                        "message": "Document lesson has no primary document uploaded",
                        "node_id": lesson.id,
                        "node_title": lesson.title,
                    }
                )
                invalid_document_lessons.append(
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "reason": "missing_primary_document",
                    }
                )
                continue

            strict_value = document.get("strict_completion", True)
            if isinstance(strict_value, str):
                strict_completion = strict_value.strip().lower() in {"true", "1", "yes", "on"}
            else:
                strict_completion = bool(strict_value)
            if not strict_completion:
                continue

            conversion_status = str(document.get("conversion_status") or "").lower()
            viewer_pdf_path = str(document.get("viewer_pdf_path") or "").strip()
            page_count_raw = document.get("page_count")
            try:
                page_count = int(page_count_raw)
            except (TypeError, ValueError):
                page_count = 0

            if conversion_status != "ready":
                errors.append(
                    {
                        "type": "document_conversion_not_ready",
                        "message": "Document lesson conversion is not ready for strict completion",
                        "node_id": lesson.id,
                        "node_title": lesson.title,
                    }
                )
                invalid_document_lessons.append(
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "reason": "conversion_not_ready",
                    }
                )

            if not viewer_pdf_path:
                errors.append(
                    {
                        "type": "document_pdf_missing",
                        "message": "Document lesson is missing a tracked PDF file",
                        "node_id": lesson.id,
                        "node_title": lesson.title,
                    }
                )
                invalid_document_lessons.append(
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "reason": "viewer_pdf_missing",
                    }
                )
            else:
                pdf_abs_path = os.path.abspath(
                    os.path.join(settings.MEDIA_ROOT, viewer_pdf_path.lstrip("/"))
                )
                try:
                    pdf_in_media_root = (
                        os.path.commonpath([media_root_abs, pdf_abs_path]) == media_root_abs
                    )
                except ValueError:
                    pdf_in_media_root = False

                if not pdf_in_media_root:
                    errors.append(
                        {
                            "type": "document_pdf_invalid_path",
                            "message": "Document lesson tracked PDF path is outside media storage",
                            "node_id": lesson.id,
                            "node_title": lesson.title,
                        }
                    )
                    invalid_document_lessons.append(
                        {
                            "id": lesson.id,
                            "title": lesson.title,
                            "reason": "viewer_pdf_path_outside_media_root",
                        }
                    )
                elif not os.path.exists(pdf_abs_path):
                    errors.append(
                        {
                            "type": "document_pdf_not_found",
                            "message": "Document lesson tracked PDF file is missing on disk",
                            "node_id": lesson.id,
                            "node_title": lesson.title,
                        }
                    )
                    invalid_document_lessons.append(
                        {
                            "id": lesson.id,
                            "title": lesson.title,
                            "reason": "viewer_pdf_not_found",
                        }
                    )

            if page_count <= 0:
                errors.append(
                    {
                        "type": "document_page_count_invalid",
                        "message": "Document lesson has invalid page count for strict completion",
                        "node_id": lesson.id,
                        "node_title": lesson.title,
                    }
                )
                invalid_document_lessons.append(
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "reason": "invalid_page_count",
                    }
                )

        details["document_lessons"] = document_lessons
        details["invalid_document_lessons"] = invalid_document_lessons
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'details': details
        }
    
    def get_publish_summary(self, program) -> str:
        """
        Get a human-readable summary of publish readiness.
        """
        result = self.validate_for_publish(program)
        
        if result['is_valid']:
            return f"✓ Ready to publish ({result['details']['lesson_count']} lessons, {result['details']['total_assessments']} assessments)"
        else:
            first_error = result['errors'][0]
            return f"✗ Not ready: {first_error['message']}"
