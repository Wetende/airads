from django.db.models import Q
from apps.core.models import User, Program
from .models import Question, QuestionBankEntry, QuestionBank, Quiz, QuestionOption, QuestionMatchingPair, QuestionGapAnswer

class QuestionBankService:
    """
    Service for managing reusable question library.
    Questions are scoped to programs for sharing among instructors.
    """
    
    def create_bank(self, program: Program, owner: User, name: str, description: str = '', category: str = '') -> QuestionBank:
        """
        Create a new question bank for a program.
        """
        return QuestionBank.objects.create(
            program=program,
            owner=owner,
            name=name,
            description=description,
            category=category
        )
    
    def get_program_banks(self, program: Program):
        """
        Get all question banks for a program.
        """
        return QuestionBank.objects.filter(program=program).order_by('name')
    
    def add_to_bank(
        self,
        question: Question,
        user: User,
        bank: QuestionBank | None = None,
        tags: list | None = None,
        subject_area: str = '',
        category: str = '',
        difficulty: str = 'medium',
    ) -> QuestionBankEntry:
        """
        Add a question to user's bank within a program.
        """
        entry = QuestionBankEntry.objects.create(
            owner=user,
            question=question,
            bank=bank,
            tags=tags or [],
            subject_area=subject_area,
            category=category,
            difficulty=difficulty
        )
        return entry

    def copy_from_bank(self, entry: QuestionBankEntry, target_quiz: Quiz) -> Question:
        """
        Copy a bank question to a quiz.
        """
        original_q = entry.question
        
        # Create new question instance
        new_q = Question.objects.create(
            quiz=target_quiz,
            question_type=original_q.question_type,
            text=original_q.text,
            points=original_q.points,
            position=target_quiz.questions.count(),
            answer_data=original_q.answer_data
        )
        
        # Clone related objects
        for opt in original_q.options.all():
            QuestionOption.objects.create(
                question=new_q,
                text=opt.text,
                is_correct=opt.is_correct,
                position=opt.position
            )
            
        for pair in original_q.matching_pairs.all():
            QuestionMatchingPair.objects.create(
                question=new_q,
                left_text=pair.left_text,
                right_text=pair.right_text,
                position=pair.position
            )
            
        for gap in original_q.gap_answers.all():
            QuestionGapAnswer.objects.create(
                question=new_q,
                gap_index=gap.gap_index,
                accepted_answers=gap.accepted_answers
            )
            
        entry.usage_count += 1
        entry.save()
        
        return new_q

    def search_program_library(
        self,
        program: Program,
        query: str | None = None,
        category: str | None = None,
        bank_id: int | None = None,
        question_type: str | None = None,
    ):
        """
        Search questions in a program's library.
        All instructors on the program can see these questions.
        """
        # Get all bank entries for this program through banks
        queryset = QuestionBankEntry.objects.filter(
            bank__program=program
        ).select_related('question', 'bank', 'owner')
        
        if query:
            queryset = queryset.filter(
                Q(question__text__icontains=query) |
                Q(subject_area__icontains=query) |
                Q(category__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(
                Q(category__iexact=category) |
                Q(bank__category__iexact=category)
            )
            
        if bank_id:
            queryset = queryset.filter(bank_id=bank_id)
            
        if question_type:
            queryset = queryset.filter(question__question_type=question_type)
                
        return queryset.order_by('-created_at')
    
    def get_categories(self, program: Program) -> list[str]:
        """
        Get all unique categories used in a program's questions.
        """
        bank_categories = QuestionBank.objects.filter(
            program=program
        ).values_list('category', flat=True).distinct()
        
        entry_categories = QuestionBankEntry.objects.filter(
            bank__program=program
        ).values_list('category', flat=True).distinct()
        
        # Combine and filter empty strings
        all_categories = set(bank_categories) | set(entry_categories)
        return sorted([c for c in all_categories if c])

    def search_bank(self, user: User, query: str = None, tags: list = None) -> 'QuerySet[QuestionBankEntry]':
        """
        Search user's personal question bank (legacy method).
        """
        queryset = QuestionBankEntry.objects.filter(owner=user)
        
        if query:
            queryset = queryset.filter(
                Q(question__text__icontains=query) |
                Q(subject_area__icontains=query)
            )
            
        if tags:
            for tag in tags:
                queryset = queryset.filter(tags__contains=tag)
                
        return queryset
