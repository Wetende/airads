import os
import django
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def send_test_email():
    subject = 'Application Received - AIRADS College'
    recipient = 'cyprianwetende@gmail.com'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@airads.ac.ke')
    
    # Context for the template
    context = {
        'student_first_name': 'Test Student',
        'course_name': 'Diploma in Information Technology',
        'campus_name': 'Eldoret',
    }
    
    # Render the HTML template
    html_content = render_to_string('emails/application_received.html', context)
    
    # Create plain text version
    text_content = strip_tags(html_content)
    
    # Send email
    print(f"Sending test email to {recipient}...")
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        print("Test email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == '__main__':
    send_test_email()
