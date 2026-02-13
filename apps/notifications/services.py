"""
Notification service - Helper methods for creating notifications.
"""

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import Notification, NotificationPreference


class NotificationService:
    """Service class for creating and managing notifications."""
    
    @staticmethod
    def create(
        recipient,
        notification_type,
        title,
        message,
        priority='normal',
        action_url=None,
        related_program_id=None,
        related_enrollment_id=None,
        related_assessment_id=None,
    ):
        """
        Create a single notification for a user.
        
        Args:
            recipient: User instance to receive the notification
            notification_type: One of Notification.NOTIFICATION_TYPES
            title: Short notification title
            message: Full notification message
            priority: 'low', 'normal', or 'high'
            action_url: Optional URL to navigate to when clicked
            related_program_id: Optional related program ID
            related_enrollment_id: Optional related enrollment ID
            related_assessment_id: Optional related assessment ID
            
        Returns:
            Created Notification instance
        """
        if not NotificationService._should_send_in_app(recipient, notification_type):
            return None

        return Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message,
            priority=priority,
            action_url=action_url,
            related_program_id=related_program_id,
            related_enrollment_id=related_enrollment_id,
            related_assessment_id=related_assessment_id,
        )
    
    @staticmethod
    def bulk_create(
        recipients,
        notification_type,
        title,
        message,
        priority='normal',
        action_url=None,
        related_program_id=None,
    ):
        """
        Create notifications for multiple users (e.g., announcements).
        
        Args:
            recipients: QuerySet or list of User instances
            notification_type: One of Notification.NOTIFICATION_TYPES
            title: Short notification title
            message: Full notification message
            priority: 'low', 'normal', or 'high'
            action_url: Optional URL to navigate to when clicked
            related_program_id: Optional related program ID
            
        Returns:
            List of created Notification instances
        """
        recipients = list(recipients)
        eligible_recipients = [
            recipient
            for recipient in recipients
            if NotificationService._should_send_in_app(recipient, notification_type)
        ]

        notifications = [
            Notification(
                recipient=recipient,
                notification_type=notification_type,
                title=title,
                message=message,
                priority=priority,
                action_url=action_url,
                related_program_id=related_program_id,
            )
            for recipient in eligible_recipients
        ]
        if not notifications:
            return []
        return Notification.objects.bulk_create(notifications)
    
    @staticmethod
    def mark_as_read(notification_id, user):
        """Mark a single notification as read."""
        return Notification.objects.filter(
            id=notification_id,
            recipient=user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
    
    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications for a user as read."""
        return Notification.objects.filter(
            recipient=user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())
    
    @staticmethod
    def get_unread_count(user):
        """Get count of unread notifications for a user."""
        return Notification.objects.filter(
            recipient=user,
            is_read=False
        ).count()

    @staticmethod
    def get_recent(user, limit=10):
        """
        Get recent notifications for a user.
        
        Args:
            user: User instance
            limit: Maximum number of notifications to return
            
        Returns:
            List of notification dicts ready for frontend
        """
        notifications = Notification.objects.filter(
            recipient=user
        ).order_by('-created_at')[:limit]
        
        return [
            {
                'id': n.id,
                'type': n.notification_type,
                'title': n.title,
                'message': n.message,
                'priority': n.priority,
                'is_read': n.is_read,
                'action_url': n.action_url,
                'created_at': n.created_at.isoformat(),
                'read_at': n.read_at.isoformat() if n.read_at else None,
            }
            for n in notifications
        ]

    @staticmethod
    def _should_send_email(user, notification_type):
        """
        Check if email notifications are enabled for this user/type.
        Defaults to enabled when no preference exists.
        """
        try:
            preferences = user.notification_preferences
        except NotificationPreference.DoesNotExist:
            return True

        if not preferences.email_enabled or preferences.email_digest == "never":
            return False

        type_preference = preferences.type_preferences.get(notification_type, {})
        if isinstance(type_preference, dict) and "email" in type_preference:
            return bool(type_preference.get("email"))

        return True

    @staticmethod
    def _should_send_in_app(user, notification_type):
        """
        Check if in-app notifications are enabled for this user/type.
        Defaults to enabled when no preference exists.
        """
        try:
            preferences = user.notification_preferences
        except NotificationPreference.DoesNotExist:
            return True

        if not preferences.in_app_enabled:
            return False

        type_preference = preferences.type_preferences.get(notification_type, {})
        if isinstance(type_preference, dict) and "in_app" in type_preference:
            return bool(type_preference.get("in_app"))

        return True

    @staticmethod
    def send_email_notification(recipient, notification_type, subject, message):
        """
        Send an email notification when recipient preferences allow it.
        Returns True if email was sent, False otherwise.
        """
        if not recipient.email:
            return False

        if not NotificationService._should_send_email(recipient, notification_type):
            return False

        sent = send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            recipient_list=[recipient.email],
            fail_silently=True,
        )
        return sent > 0

    @staticmethod
    def notify_enrollment_requested(enrollment_request, reviewers, action_url=None):
        """
        Notify reviewers (instructors/admins) that a student requested enrollment.
        """
        student_name = (
            enrollment_request.user.get_full_name() or enrollment_request.user.email
        )
        notifications = NotificationService.bulk_create(
            recipients=reviewers,
            notification_type="system",
            title="New Enrollment Request",
            message=(
                f'{student_name} requested enrollment in '
                f'"{enrollment_request.program.name}".'
            ),
            action_url=action_url
            or f"/instructor/programs/{enrollment_request.program.id}/enrollment-requests/",
            related_program_id=enrollment_request.program.id,
        )

        for reviewer in reviewers:
            NotificationService.send_email_notification(
                recipient=reviewer,
                notification_type="system",
                subject=f"New Enrollment Request: {enrollment_request.program.name}",
                message=(
                    f'Hello {reviewer.get_full_name() or reviewer.email},\n\n'
                    f'{student_name} requested enrollment in '
                    f'"{enrollment_request.program.name}".\n'
                    "Please review the request in your dashboard."
                ),
            )

        return notifications
    
    # =========================================================================
    # Convenience methods for specific notification types
    # =========================================================================

    @staticmethod
    def notify_enrollment_confirmed(enrollment):
        """Send notification when a student is directly enrolled."""
        notification = NotificationService.create(
            recipient=enrollment.user,
            notification_type='enrollment_confirmed',
            title='Enrollment Confirmed',
            message=f'You have been enrolled in "{enrollment.program.name}".',
            action_url=f'/student/programs/{enrollment.program.id}/',
            related_program_id=enrollment.program.id,
            related_enrollment_id=enrollment.id,
        )

        NotificationService.send_email_notification(
            recipient=enrollment.user,
            notification_type='enrollment_confirmed',
            subject=f'Enrollment Confirmed: {enrollment.program.name}',
            message=(
                f'Hello {enrollment.user.get_full_name() or enrollment.user.email},\n\n'
                f'You have been enrolled in "{enrollment.program.name}".\n'
                'You can now access the program from your student dashboard.\n\n'
                'If you did not expect this enrollment, please contact support.'
            ),
        )

        return notification
    
    @staticmethod
    def notify_enrollment_approved(enrollment):
        """Send notification when enrollment is approved."""
        notification = NotificationService.create(
            recipient=enrollment.user,
            notification_type='enrollment_approved',
            title='Enrollment Approved',
            message=f'Your enrollment in "{enrollment.program.name}" has been approved.',
            action_url=f'/student/programs/{enrollment.program.id}/',
            related_program_id=enrollment.program.id,
            related_enrollment_id=enrollment.id,
        )

        NotificationService.send_email_notification(
            recipient=enrollment.user,
            notification_type='enrollment_approved',
            subject=f'Enrollment Approved: {enrollment.program.name}',
            message=(
                f'Hello {enrollment.user.get_full_name() or enrollment.user.email},\n\n'
                f'Your enrollment request for "{enrollment.program.name}" has been approved.\n'
                'You can now access the program from your student dashboard.\n\n'
                'If you did not request this enrollment, please contact support.'
            ),
        )

        return notification

    @staticmethod
    def notify_enrollment_status_changed(enrollment, status_label):
        """
        Send notification when enrollment status changes after activation.
        """
        notification = NotificationService.create(
            recipient=enrollment.user,
            notification_type='system',
            title='Enrollment Status Updated',
            message=(
                f'Your enrollment in "{enrollment.program.name}" is now '
                f'"{status_label}".'
            ),
            action_url=f'/student/programs/{enrollment.program.id}/',
            related_program_id=enrollment.program.id,
            related_enrollment_id=enrollment.id,
        )
        NotificationService.send_email_notification(
            recipient=enrollment.user,
            notification_type='system',
            subject=f'Enrollment Status Updated: {enrollment.program.name}',
            message=(
                f'Hello {enrollment.user.get_full_name() or enrollment.user.email},\n\n'
                f'Your enrollment status for "{enrollment.program.name}" is now '
                f'"{status_label}".'
            ),
        )
        return notification
    
    @staticmethod
    def notify_enrollment_rejected(enrollment, reason=''):
        """Send notification when enrollment is rejected."""
        message = f'Your enrollment request for "{enrollment.program.name}" was not approved.'
        if reason:
            message += f' Reason: {reason}'

        notification = NotificationService.create(
            recipient=enrollment.user,
            notification_type='enrollment_rejected',
            title='Enrollment Request Update',
            message=message,
            related_program_id=enrollment.program.id,
            related_enrollment_id=getattr(enrollment, "id", None),
        )

        NotificationService.send_email_notification(
            recipient=enrollment.user,
            notification_type='enrollment_rejected',
            subject=f'Enrollment Request Update: {enrollment.program.name}',
            message=(
                f'Hello {enrollment.user.get_full_name() or enrollment.user.email},\n\n'
                f'Your enrollment request for "{enrollment.program.name}" was not approved.\n'
                + (f"Reason: {reason}\n" if reason else "")
                + "\nYou can contact your instructor or administrator for details."
            ),
        )
        return notification
    
    @staticmethod
    def notify_grade_published(enrollment):
        """Send notification when grades are published for an enrollment."""
        notification = NotificationService.create(
            recipient=enrollment.user,
            notification_type='grade_published',
            title='Grades Published',
            message=f'Your grades for "{enrollment.program.name}" have been published.',
            action_url=f'/student/programs/{enrollment.program.id}/grades/',
            related_program_id=enrollment.program.id,
            related_enrollment_id=enrollment.id,
            priority='high',
        )

        NotificationService.send_email_notification(
            recipient=enrollment.user,
            notification_type='grade_published',
            subject=f'Grades Published: {enrollment.program.name}',
            message=(
                f'Hello {enrollment.user.get_full_name() or enrollment.user.email},\n\n'
                f'Your grades for "{enrollment.program.name}" are now available.'
            ),
        )
        return notification
    
    @staticmethod
    def notify_assignment_graded(submission):
        """Send notification when an assignment is graded."""
        notification = NotificationService.create(
            recipient=submission.enrollment.user,
            notification_type='assignment_graded',
            title='Assignment Graded',
            message=f'Your assignment has been graded.',
            action_url=f'/student/assignments/{submission.id}/',
            related_assessment_id=submission.id,
        )

        NotificationService.send_email_notification(
            recipient=submission.enrollment.user,
            notification_type='assignment_graded',
            subject='Assignment Graded',
            message=(
                f'Hello {submission.enrollment.user.get_full_name() or submission.enrollment.user.email},\n\n'
                "Your assignment has been graded. Log in to view feedback."
            ),
        )
        return notification
    
    @staticmethod
    def notify_quiz_graded(attempt):
        """Send notification when a quiz is graded."""
        notification = NotificationService.create(
            recipient=attempt.enrollment.user,
            notification_type='quiz_graded',
            title='Quiz Results Available',
            message=f'Your quiz results are now available.',
            action_url=f'/student/quizzes/{attempt.id}/',
            related_assessment_id=attempt.id,
        )

        NotificationService.send_email_notification(
            recipient=attempt.enrollment.user,
            notification_type='quiz_graded',
            subject='Quiz Results Available',
            message=(
                f'Hello {attempt.enrollment.user.get_full_name() or attempt.enrollment.user.email},\n\n'
                "Your quiz results are now available. Log in to review them."
            ),
        )
        return notification
    
    @staticmethod
    def notify_announcement(announcement, enrolled_users):
        """
        Notify all enrolled students of a new announcement.
        
        Args:
            announcement: Announcement instance
            enrolled_users: QuerySet of User instances enrolled in the program
        """
        notifications = NotificationService.bulk_create(
            recipients=enrolled_users,
            notification_type='announcement',
            title=f'New Announcement: {announcement.title}',
            message=announcement.content[:200] + ('...' if len(announcement.content) > 200 else ''),
            action_url=f'/student/programs/{announcement.program.id}/announcements/',
            related_program_id=announcement.program.id,
        )

        for user in enrolled_users:
            NotificationService.send_email_notification(
                recipient=user,
                notification_type='announcement',
                subject=f'New Announcement: {announcement.title}',
                message=announcement.content[:500],
            )
        return notifications
    
    @staticmethod
    def notify_instructor_approved(user):
        """Send notification when instructor application is approved."""
        notification = NotificationService.create(
            recipient=user,
            notification_type='instructor_approved',
            title='Instructor Application Approved',
            message='Congratulations! Your instructor application has been approved. You can now create and manage programs.',
            action_url='/instructor/programs/',
            priority='high',
        )

        NotificationService.send_email_notification(
            recipient=user,
            notification_type='instructor_approved',
            subject='Instructor Application Approved',
            message=(
                f'Hello {user.get_full_name() or user.email},\n\n'
                "Your instructor application has been approved. "
                "You can now create and manage programs."
            ),
        )
        return notification
    
    @staticmethod
    def notify_instructor_rejected(user, reason=''):
        """Send notification when instructor application is rejected."""
        message = 'Your instructor application was not approved at this time.'
        if reason:
            message += f' Reason: {reason}'

        notification = NotificationService.create(
            recipient=user,
            notification_type='instructor_rejected',
            title='Instructor Application Update',
            message=message,
        )

        NotificationService.send_email_notification(
            recipient=user,
            notification_type='instructor_rejected',
            subject='Instructor Application Update',
            message=(
                f'Hello {user.get_full_name() or user.email},\n\n'
                + message
            ),
        )
        return notification

    @staticmethod
    def notify_instructor_unlocked(user):
        """Send notification when a rejected instructor application is unlocked."""
        notification = NotificationService.create(
            recipient=user,
            notification_type='system',
            title='Instructor Application Unlocked',
            message='Your instructor application has been unlocked. You can now update and resubmit it.',
            action_url='/instructor/apply/',
        )
        NotificationService.send_email_notification(
            recipient=user,
            notification_type='system',
            subject='Instructor Application Unlocked',
            message=(
                f'Hello {user.get_full_name() or user.email},\n\n'
                'Your instructor application has been unlocked. '
                'You can now update your details and resubmit.'
            ),
        )
        return notification
    
    @staticmethod
    def notify_program_approved(program):
        """Send notification when a program is approved for publication."""
        # Notify all instructors assigned to the program
        notifications = []
        for instructor in program.instructors.all():
            notification = NotificationService.create(
                    recipient=instructor,
                    notification_type='program_approved',
                    title='Program Approved',
                    message=f'Your program "{program.name}" has been approved and is now published.',
                    action_url=f'/instructor/programs/{program.id}/',
                    related_program_id=program.id,
                    priority='high',
                )
            if notification:
                notifications.append(notification)
            NotificationService.send_email_notification(
                recipient=instructor,
                notification_type='program_approved',
                subject=f'Program Approved: {program.name}',
                message=(
                    f'Hello {instructor.get_full_name() or instructor.email},\n\n'
                    f'Your program "{program.name}" has been approved.'
                ),
            )
        return notifications
    
    @staticmethod
    def notify_program_changes_requested(program, feedback=''):
        """Send notification when changes are requested for a program."""
        message = f'Changes have been requested for your program "{program.name}".'
        if feedback:
            message += f' Feedback: {feedback}'
        
        notifications = []
        for instructor in program.instructors.all():
            notification = NotificationService.create(
                    recipient=instructor,
                    notification_type='program_changes_requested',
                    title='Program Changes Requested',
                    message=message,
                    action_url=f'/instructor/programs/{program.id}/edit/',
                    related_program_id=program.id,
                )
            if notification:
                notifications.append(notification)
            NotificationService.send_email_notification(
                recipient=instructor,
                notification_type='program_changes_requested',
                subject=f'Changes Requested: {program.name}',
                message=(
                    f'Hello {instructor.get_full_name() or instructor.email},\n\n'
                    f'Changes were requested for "{program.name}".\n'
                    + (f"Feedback: {feedback}" if feedback else "")
                ),
            )
        return notifications
