import firebase_admin
from firebase_admin import credentials, firestore

# Global variable to store the Firebase app instance
firebase_app = None

def initialize_firebase():
    global firebase_app
    # Initialize Firebase Admin SDK with the correct path
    cred = credentials.Certificate("accounts/sonalgaz-79901-firebase-adminsdk-fbsvc-a664329687.json")
    firebase_app = firebase_admin.initialize_app(cred)
    return firebase_app

def get_db_config():
    """
    Fetch database configuration from Firebase Firestore
    Returns a dictionary with database connection parameters
    """
    # Make sure Firebase is initialized
    global firebase_app
    if not firebase_app:
        firebase_app = initialize_firebase()
    
    # Get Firestore client
    db = firestore.client()
    
    # Fetch database configuration from Firestore
    try:
        config_doc = db.collection('admin_settings').document('database').get()
        if config_doc.exists:
            config = config_doc.to_dict()
            return {
                'ENGINE': config.get('engine', 'django.db.backends.mysql'),
                'NAME': config.get('db_name', ''),
                'USER': config.get('db_user', 'root'),
                'PASSWORD': config.get('db_password', ''),
                'HOST': config.get('db_host', 'localhost'),
                'PORT': config.get('db_port', '3306'),
            }
        else:
            # Return default config if no document exists
            print("Warning: Database config not found in Firebase, using defaults")
            return None
    except Exception as e:
        print(f"Error fetching database config from Firebase: {e}")
        return None 