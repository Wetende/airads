from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, QuestionBankEntry, QuestionBank, Rubric
from .serializers import (
    QuizSerializer, QuestionSerializer, QuestionBankEntrySerializer, 
    QuestionBankSerializer, RubricSerializer
)
from .question_bank_service import QuestionBankService
from apps.curriculum.models import CurriculumNode
from apps.core.models import Program
from inertia import render
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from apps.assessments.services import RubricService
from django.contrib import messages


def _api_error(
    message: str,
    *,
    status_code: int = 400,
    code: str = "request_failed",
):
    return Response(
        {
            "code": code,
            "message": message,
            "error": message,
        },
        status=status_code,
    )


@login_required
def rubric_list(request):
    """
    Inertia view for listing rubrics.
    """
    service = RubricService()
    rubrics = service.get_accessible_rubrics(request.user)
    
    return render(request, 'Assessments/Rubrics/Index', {
        'rubrics': RubricSerializer(rubrics, many=True).data,
        'can_create': True,  # Permissions are handled by service, but UI might need a toggle
    })


@login_required
def rubric_create(request):
    """
    Inertia view for creating a rubric.
    """
    if request.method == 'POST':
        # Inertia submits JSON, so we use request.body via DRF serializer or manually
        # Standard Django request.POST handles form data, but Inertia sends JSON.
        # However, with inertia-django, if content type is json, it's parsed.
        # For complex nested JSON like 'dimensions', using the Serializer is easiest.
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return _api_error(
                "We could not read your request. "
                "Please refresh and try again.",
                status_code=400,
                code="invalid_request",
            )
        
        # Security Check: Scope Permissions
        scope = data.get('scope', 'course')
        if scope == 'global' and not request.user.is_superuser:
            return _api_error(
                "Only superadmins can create global rubrics.",
                status_code=403,
                code="permission_denied",
            )
        
        if scope == 'program':
            if not (request.user.is_staff or request.user.is_superuser):
                return _api_error(
                    "Only admins can create program rubrics.",
                    status_code=403,
                    code="permission_denied",
                )
            
            # For admins, ensure they provide a program (optional check)
            program_id = data.get('program')
            if not program_id:
                return _api_error(
                    "Please select a program for this rubric.",
                    status_code=400,
                    code="program_required",
                )

        serializer = RubricSerializer(data=data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            messages.success(request, 'Rubric created successfully.')
            return redirect('assessments:rubric_list')
        
        # Return errors
        return render(request, 'Assessments/Rubrics/Create', {
            'errors': serializer.errors,
            'old_input': data
        })

    return render(request, 'Assessments/Rubrics/Create', {})


@login_required
def rubric_edit(request, pk):
    """
    Inertia view for editing a rubric.
    """
    service = RubricService()
    # Ensure user can access this rubric
    rubric = get_object_or_404(service.get_accessible_rubrics(request.user), pk=pk)
    
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
             return _api_error(
                 "We could not read your request. Please refresh and try again.",
                 status_code=400,
                 code="invalid_request",
             )

        # Security Check: Scope Modification
        new_scope = data.get('scope', rubric.scope)
        if new_scope != rubric.scope:
             # Validate permission to change to new scope
            if new_scope == 'global' and not request.user.is_superuser:
                return _api_error(
                    "Only superadmins can create global rubrics.",
                    status_code=403,
                    code="permission_denied",
                )
            if new_scope == 'program' and not (request.user.is_staff or request.user.is_superuser):
                return _api_error(
                    "Only admins can create program rubrics.",
                    status_code=403,
                    code="permission_denied",
                )

        serializer = RubricSerializer(rubric, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            messages.success(request, 'Rubric updated successfully.')
            return redirect('assessments:rubric_list')
            
        return render(request, 'Assessments/Rubrics/Edit', {
            'rubric': RubricSerializer(rubric).data,
            'errors': serializer.errors
        })

    return render(request, 'Assessments/Rubrics/Edit', {
        'rubric': RubricSerializer(rubric).data
    })


class QuizViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Quizzes.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter by node_id if provided.
        """
        queryset = super().get_queryset()
        node_id = self.request.query_params.get('node_id')
        if node_id:
            queryset = queryset.filter(node_id=node_id)
        return queryset

    def perform_create(self, serializer):
        # Additional validation or logic could go here
        serializer.save()


class QuestionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Questions.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        quiz_id = self.request.query_params.get('quiz_id')
        if quiz_id:
            queryset = queryset.filter(quiz_id=quiz_id)
        return queryset

    @decorators.action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder questions for a quiz.
        Expects: { "quiz_id": 1, "order": [q1_id, q2_id, ...] }
        """
        quiz_id = request.data.get('quiz_id')
        order = request.data.get('order', [])
        
        if not quiz_id:
            return _api_error(
                "Please choose a quiz before reordering questions.",
                status_code=400,
                code="quiz_required",
            )
            
        questions = Question.objects.filter(quiz_id=quiz_id)
        q_map = {q.id: q for q in questions}
        
        updated = []
        for idx, q_id in enumerate(order):
            if q_id in q_map:
                question = q_map[q_id]
                question.position = idx
                updated.append(question)
                
        Question.objects.bulk_update(updated, ['position'])
        return Response({"status": "reordered"})


class QuestionBankViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Question Bank.
    """
    serializer_class = QuestionBankEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuestionBankEntry.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @decorators.action(detail=True, methods=['post'])
    def add_to_quiz(self, request, pk=None):
        """
        Copy a bank question to a specific quiz.
        Expects: { "quiz_id": 1 }
        """
        entry = self.get_object()
        quiz_id = request.data.get('quiz_id')
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        # Clone question logic (simplified)
        original_q = entry.question
        new_q = Question.objects.create(
            quiz=quiz,
            question_type=original_q.question_type,
            text=original_q.text,
            points=original_q.points,
            position=quiz.questions.count(),
            answer_data=original_q.answer_data
        )
        
        # Clone related objects
        for opt in original_q.options.all():
            opt.pk = None
            opt.question = new_q
            opt.save()
            
        for pair in original_q.matching_pairs.all():
            pair.pk = None
            pair.question = new_q
            pair.save()
            
        for gap in original_q.gap_answers.all():
            gap.pk = None
            gap.question = new_q
            gap.save()
            
        entry.usage_count += 1
        entry.save()
        
        return Response(QuestionSerializer(new_q).data, status=201)


class ProgramQuestionLibraryViewSet(viewsets.ViewSet):
    """
    API endpoint for program-scoped Question Library.
    All instructors on a program can access and share questions.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, program_id=None):
        """
        Search questions in a program's library.
        Query params: query, category, bank_id, question_type
        """
        program = get_object_or_404(Program, pk=program_id)

        # Verify instructor access
        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to access this question library.",
                status_code=403,
                code="permission_denied",
            )
        
        # Get query params
        query = request.query_params.get('query', '')
        category = request.query_params.get('category', '')
        bank_id = request.query_params.get('bank_id')
        question_type = request.query_params.get('question_type', '')
        
        service = QuestionBankService()
        entries = service.search_program_library(
            program=program,
            query=query if query else None,
            category=category if category else None,
            bank_id=int(bank_id) if bank_id else None,
            question_type=question_type if question_type else None
        )
        
        serializer = QuestionBankEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    @decorators.action(detail=False, methods=['get'])
    def banks(self, request, program_id=None):
        """
        List all question banks for a program.
        """
        program = get_object_or_404(Program, pk=program_id)

        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to access this question library.",
                status_code=403,
                code="permission_denied",
            )
        service = QuestionBankService()
        banks = service.get_program_banks(program)
        serializer = QuestionBankSerializer(banks, many=True)
        return Response(serializer.data)
    
    @decorators.action(detail=False, methods=['post'])
    def create_bank(self, request, program_id=None):
        """
        Create a new question bank for a program.
        Expects: { "name": "Bank Name", "description": "...", "category": "..." }
        """
        program = get_object_or_404(Program, pk=program_id)

        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to create a question bank for this program.",
                status_code=403,
                code="permission_denied",
            )
        
        name = request.data.get('name', '').strip()
        if not name:
            return _api_error(
                "Please enter a question bank name.",
                status_code=400,
                code="name_required",
            )
        
        service = QuestionBankService()
        bank = service.create_bank(
            program=program,
            owner=request.user,
            name=name,
            description=request.data.get('description', ''),
            category=request.data.get('category', '')
        )
        
        return Response(QuestionBankSerializer(bank).data, status=201)
    
    @decorators.action(detail=False, methods=['get'])
    def categories(self, request, program_id=None):
        """
        Get all unique categories for a program's questions.
        """
        program = get_object_or_404(Program, pk=program_id)

        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to access this question library.",
                status_code=403,
                code="permission_denied",
            )
        service = QuestionBankService()
        categories = service.get_categories(program)
        return Response({"categories": categories})
    
    @decorators.action(detail=True, methods=['post'], url_path='add-to-quiz')
    def add_to_quiz(self, request, program_id=None, pk=None):
        """
        Copy a question from the library to a quiz.
        Expects: { "quiz_id": 1 }
        """
        program = get_object_or_404(Program, pk=program_id)
        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to add questions to this quiz.",
                status_code=403,
                code="permission_denied",
            )

        entry = get_object_or_404(QuestionBankEntry, pk=pk, bank__program=program)
        quiz_id = request.data.get('quiz_id')
        
        if not quiz_id:
            return _api_error(
                "Please choose a quiz before adding this question.",
                status_code=400,
                code="quiz_required",
            )
        
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        if quiz.node.program_id != program.id:
            return _api_error(
                "You do not have permission to add questions to this quiz.",
                status_code=403,
                code="permission_denied",
            )
        
        service = QuestionBankService()
        new_question = service.copy_from_bank(entry, quiz)
        
        return Response(QuestionSerializer(new_question).data, status=201)
    
    @decorators.action(detail=False, methods=['post'], url_path='save-to-library')
    def save_to_library(self, request, program_id=None):
        """
        Save a question to the program's library.
        Expects: { "question_id": 1, "bank_id": 1, "category": "..." }
        """
        program = get_object_or_404(Program, pk=program_id)
        from apps.progression.models import InstructorAssignment
        if not (
            InstructorAssignment.objects.filter(instructor=request.user, program=program).exists()
            or request.user.is_staff
        ):
            return _api_error(
                "You do not have permission to save questions for this program.",
                status_code=403,
                code="permission_denied",
            )
        question_id = request.data.get('question_id')
        bank_id = request.data.get('bank_id')
        category = request.data.get('category', '')
        
        if not question_id:
            return _api_error(
                "Please select a question to save.",
                status_code=400,
                code="question_required",
            )
        
        question = get_object_or_404(Question, pk=question_id)
        if question.quiz.node.program_id != program.id:
            return _api_error(
                "You do not have permission to save questions for this program.",
                status_code=403,
                code="permission_denied",
            )
        bank = get_object_or_404(QuestionBank, pk=bank_id, program=program) if bank_id else None
        
        service = QuestionBankService()
        entry = service.add_to_bank(
            question=question,
            user=request.user,
            bank=bank,
            category=category,
            difficulty=request.data.get('difficulty', 'medium'),
            tags=request.data.get('tags', [])
        )
        
        return Response(QuestionBankEntrySerializer(entry).data, status=201)
