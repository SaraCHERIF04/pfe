from django.core.management.base import BaseCommand
import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))))
from firebase_config import initialize_firebase

class Command(BaseCommand):
    help = 'Set up database configuration in Firebase Firestore'

    def add_arguments(self, parser):
        parser.add_argument('--engine', type=str, default='django.db.backends.mysql',
                            help='Database engine (default: django.db.backends.mysql)')
        parser.add_argument('--name', type=str, required=True,
                            help='Database name')
        parser.add_argument('--user', type=str, required=True,
                            help='Database username')
        parser.add_argument('--password', type=str, default='',
                            help='Database password')
        parser.add_argument('--host', type=str, default='localhost',
                            help='Database host (default: localhost)')
        parser.add_argument('--port', type=str, default='3306',
                            help='Database port (default: 3306)')

    def handle(self, *args, **options):
        try:
            # Initialize Firebase
            app = initialize_firebase()
            
            # Get Firestore client
            db = firestore.client()
            
            # Prepare database configuration
            db_config = {
                'engine': options['engine'],
                'name': options['name'],
                'user': options['user'],
                'password': options['password'],
                'host': options['host'],
                'port': options['port'],
            }
            
            # Store configuration in Firestore
            db.collection('config').document('database').set(db_config)
            
            self.stdout.write(self.style.SUCCESS('Successfully stored database configuration in Firebase'))
            self.stdout.write(json.dumps(db_config, indent=2))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
            return 