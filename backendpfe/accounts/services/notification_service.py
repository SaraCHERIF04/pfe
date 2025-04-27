from firebase_admin import messaging
from django.utils import timezone
from ..models import Notification, Utilisateur
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials
import json
import os

# Ensure Firebase is initialized
if not firebase_admin._apps:
    try:
        # Get the absolute path to the service account file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Go up three levels to reach the backendpfe directory
        service_account_path = os.path.join(current_dir, '..', '..', '..', 'backendpfe', 'sonalgaz-79901-9f74bfedeb1d.json')
        
        print(f"Loading service account from: {service_account_path}")
        
        # Initialize Firebase with the service account
        cred = credentials.Certificate(service_account_path)
        print("Service account loaded successfully")
        
        # Initialize Firebase app with more configuration
        firebase_admin.initialize_app(cred, {
            'projectId': 'sonalgaz-79901',
            'messagingSenderId': '370292969670',
            'databaseURL': 'https://sonalgaz-79901.firebaseio.com'
        })
        print("Firebase initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}")
        if hasattr(e, 'response'):
            print(f"Response content: {e.response.content if hasattr(e.response, 'content') else 'No content'}")

class NotificationService:
    @staticmethod
    def send_notification(
        title: str,
        content: str,
        notification_type: str,
        user_ids: List[int],
        link: Optional[str] = None
    ) -> None:
        """
        Send notification to multiple users and store it in the database
        
        Args:
            title: Notification title
            content: Notification content
            notification_type: Type of notification (info, warning, new_project, etc.)
            user_ids: List of user IDs to send notification to
            link: Optional link to include in the notification
        """
        # Store notification in database for each user
        for user_id in user_ids:
            Notification.objects.create(
                titre=title,
                contenu=content,
                type=notification_type,
                lien=link,
                id_utilisateur_id=user_id,
                created_at=timezone.now()
            )

        # Get FCM tokens for all users
        users = Utilisateur.objects.filter(id_utilisateur__in=user_ids)
        fcm_tokens = [user.fcm_token for user in users if user.fcm_token]
        
        if not fcm_tokens:
            print("No FCM tokens found for the users")
            return

        try:
            print(f"Preparing to send notification to {len(fcm_tokens)} tokens")
            
            # Create individual messages for each token
            messages = []
            for token in fcm_tokens:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=content,
                    ),
                    data={
                        'type': notification_type,
                        'link': link or '',
                        'click_action': 'FLUTTER_NOTIFICATION_CLICK'
                    },
                    token=token,
                    webpush=messaging.WebpushConfig(
                        notification=messaging.WebpushNotification(
                            icon='https://logo.clearbit.com/facebook.com',
                            badge='https://logo.clearbit.com/facebook.com'
                        ),
                        headers={
                            'Urgency': 'high'
                        }
                    )
                )
                messages.append(message)

            print("Sending notifications...")
            # Send messages individually
            for message in messages:
                try:
                    response = messaging.send(message)
                    print(f"Successfully sent message: {response}")
                except Exception as e:
                    print(f"Failed to send message: {str(e)}")

        except Exception as e:
            print(f"Error sending Firebase notification: {str(e)}")
            if hasattr(e, 'response'):
                print(f"Response content: {e.response.content if hasattr(e.response, 'content') else 'No content'}")
            print(f"Full error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")

    @staticmethod
    def send_project_notification(
        project_name: str,
        project_id: int,
        user_ids: List[int]
    ) -> None:
        """
        Helper method to send project-related notifications
        
        Args:
            project_name: Name of the project
            project_id: ID of the project
            user_ids: List of user IDs to notify
        """
        NotificationService.send_notification(
            title="New Project Created",
            content=f"A new project '{project_name}' has been created",
            notification_type="new_project",
            user_ids=user_ids,
            link=f"/projects/{project_id}"
        )

    @staticmethod
    def send_subproject_notification(
        subproject_name: str,
        subproject_id: int,
        user_ids: List[int]
    ) -> None:
        """
        Helper method to send subproject-related notifications
        
        Args:
            subproject_name: Name of the subproject
            subproject_id: ID of the subproject
            user_ids: List of user IDs to notify
        """
        NotificationService.send_notification(
            title="New Subproject Created",
            content=f"A new subproject '{subproject_name}' has been created",
            notification_type="new_sub_project",
            user_ids=user_ids,
            link=f"/subprojects/{subproject_id}"
        )

    @staticmethod
    def send_reunion_notification(
        reunion_title: str,
        reunion_id: int,
        user_ids: List[int]
    ) -> None:
        """
        Helper method to send reunion-related notifications
        
        Args:
            reunion_title: Title of the reunion
            reunion_id: ID of the reunion
            user_ids: List of user IDs to notify
        """
        NotificationService.send_notification(
            title="New Reunion Scheduled",
            content=f"A new reunion '{reunion_title}' has been scheduled",
            notification_type="new_reunion",
            user_ids=user_ids,
            link=f"/reunions/{reunion_id}"
        ) 