from .firebase_config import initialize_firebase

# Initialize Firebase
try:
    initialize_firebase()
except Exception as e:
    print(f"Error initializing Firebase: {e}") 