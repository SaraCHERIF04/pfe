from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Utilisateur
from ..services.token_service import TokenService
from django.contrib.auth.hashers import make_password

class PasswordSetupView(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({
                'success': False,
                'message': 'Token is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate the token and get the user_id
        user_id = TokenService.validate_token(token)

        if not user_id:
            return Response({
                'success': False,
                'message': 'Invalid or expired token'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Utilisateur.objects.get(id_utilisateur=user_id)
        except Utilisateur.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        password = request.data.get('password')
        if not password:
            return Response({
                'success': False,
                'message': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Set the password
        user.mot_de_passe = make_password(password)
        user.save()

        # Generate a new token for the user
        return Response({
            'success': True,
            'message': 'Password has been set successfully'
        }, status=status.HTTP_200_OK) 