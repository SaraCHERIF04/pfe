from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse

class EmailService:
    @staticmethod
    def send_password_setup_email(user_email, token):
        setup_link = settings.FRONTEND_URL + f'/set-password/{token}'
        subject = 'Set Up Your Account Password'
        html_message = render_to_string('email/password_setup.html', {
            'setup_link': setup_link,
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user_email],
            fail_silently=False,
        ) 