"""
Curriculum services - Node properties handling and validation.
"""
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
        
        # Get all curriculum nodes for this program
        nodes = CurriculumNode.objects.filter(program=program)
        
        # Count node types
        lessons = nodes.filter(node_type='lesson')
        quizzes = nodes.filter(node_type='quiz')
        assignments = nodes.filter(node_type='assignment')
        
        details['lesson_count'] = lessons.count()
        details['quiz_count'] = quizzes.count()
        details['assignment_count'] = assignments.count()
        
        # Basic content check
        if lessons.count() == 0:
            errors.append({
                'type': 'missing_content',
                'message': 'Course must have at least 1 lesson',
                'node_id': None,
                'node_title': None
            })
        
        # Assessment requirements
        total_assessments = quizzes.count() + assignments.count()
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
            weight = (assignment.properties or {}).get('weight', 0)
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
        
        total_weight = sum(a['weight'] for a in assignment_weights)
        details['assignment_weights'] = assignment_weights
        details['total_assignment_weight'] = total_weight
        
        # Check mode-specific requirements
        mode = getattr(program, 'mode', None) or 'online'
        details['mode'] = mode
        
        if mode in ('theology', 'tvet'):
            # Theology/TVET modes require weights to sum to 100%
            if assignments.count() > 0 and total_weight != 100:
                errors.append({
                    'type': 'invalid_weight_sum',
                    'message': f'Assignment weights must sum to 100% (currently {total_weight}%)',
                    'node_id': None,
                    'node_title': None
                })
        else:
            # Online mode - just warn if weights don't sum to 100
            if assignments.count() > 0 and total_weight != 100:
                warnings.append({
                    'type': 'weight_recommendation',
                    'message': f'Assignment weights total {total_weight}% (recommended: 100%)',
                    'node_id': None,
                    'node_title': None
                })
        
        # Check for incomplete quizzes (no questions)
        incomplete_quizzes = []
        for quiz in quizzes:
            questions = (quiz.properties or {}).get('questions', [])
            if len(questions) == 0:
                incomplete_quizzes.append({'id': quiz.id, 'title': quiz.title})
                errors.append({
                    'type': 'empty_quiz',
                    'message': f'Quiz has no questions',
                    'node_id': quiz.id,
                    'node_title': quiz.title
                })
        
        details['incomplete_quizzes'] = incomplete_quizzes
        
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


