from django.core.management.base import BaseCommand
import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))))
from firebase_config import initialize_firebase, get_db_config

class Command(BaseCommand):
    help = 'Check the current database configuration stored in Firebase Firestore'

    def handle(self, *args, **options):
        try:
            # Get database configuration from Firebase
            db_config = get_db_config()
            
            if db_config:
                self.stdout.write(self.style.SUCCESS('Current database configuration in Firebase:'))
                self.stdout.write(json.dumps(db_config, indent=2))
            else:
                self.stdout.write(self.style.WARNING('No database configuration found in Firebase'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
            return 