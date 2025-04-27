from django.conf import settings
from django.utils.crypto import get_random_string
from django.core.cache import cache
from datetime import timedelta

class TokenService:
    TOKEN_LENGTH = 32
    TOKEN_PREFIX = 'pwd_setup_'
    TOKEN_EXPIRY = 20  # minutes

    @staticmethod
    def generate_token(user_id):
        token = get_random_string(TokenService.TOKEN_LENGTH)
        cache_key = f"{TokenService.TOKEN_PREFIX}{token}"
        # Store the user_id with the token, expires in 20 minutes
        cache.set(cache_key, user_id, timeout=TokenService.TOKEN_EXPIRY * 60)
        return token

    @staticmethod
    def validate_token(token):
        cache_key = f"{TokenService.TOKEN_PREFIX}{token}"
        user_id = cache.get(cache_key)
        if user_id:
            # Delete the token after validation
            cache.delete(cache_key)
            return user_id
        return None 