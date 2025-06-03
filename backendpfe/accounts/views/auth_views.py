# myapp/views/auth_views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from ..models import Utilisateur
from ..serializers.login_serializers import LoginSerializer
from ..permissions import IsAdmin
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import check_password, make_password

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(ErrorAPIResponse({'message': 'Tous les champs sont requis.'}).data, status=status.HTTP_400_BAD_REQUEST)

        # Vérification manuelle du mot de passe actuel
        if not check_password(current_password, user.mot_de_passe):
            return Response(ErrorAPIResponse({'message': 'Mot de passe actuel incorrect.'}).data, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response(ErrorAPIResponse({'message': str(e)}).data, status=status.HTTP_400_BAD_REQUEST)

        # Hasher et sauvegarder le nouveau mot de passe
        user.mot_de_passe = make_password(new_password)
        user.save()

        return Response(SuccessAPIResponse({'message': 'Mot de passe mis à jour avec succès.'}).data, status=status.HTTP_200_OK)

class AuthView(APIView):
    permission_classes = [AllowAny]


    def get(self, request):
        user = request.user
        if user.is_authenticated:
            refresh = RefreshToken.for_user(user)
            return Response(SuccessAPIResponse({
            'message': 'Login successful',
            'data': {
                'id_utilisateur': user.id_utilisateur,
                'nom': user.nom,
                'email': user.email,
                'role_de_utilisateur': user.role_de_utilisateur,
                'numero_de_tel': user.numero_de_tel,
                'created_at': user.created_at,
                'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }
            }).data, status=status.HTTP_200_OK)
        else:
            return Response(ErrorAPIResponse({'message': 'User is not logged in'}).data, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        action = request.data.get('action')

        if action == 'login':
            return self.login(request)
        elif action == 'create_account':
            return self.create_account(request)
        else:
            return Response(ErrorAPIResponse({'error': 'Invalid action'}).data, status=status.HTTP_400_BAD_REQUEST)
        
        
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.fcm_token = request.data.get('fcm_token')
        user.is_active = True
        user.is_authenticated = True
        user.save()
        refresh = RefreshToken.for_user(user)
        response_data = SuccessAPIResponse({
            'message': 'Login successful',
            'data': {
                'id_utilisateur': user.id_utilisateur,
                'nom': user.nom,
                'email': user.email,
                'role_de_utilisateur': user.role_de_utilisateur,
                'numero_de_tel': user.numero_de_tel,
                'created_at': user.created_at,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        }).data
        return Response(response_data, status=status.HTTP_200_OK)
    
    def create_account(self, request):
        data = request.data
        try:
            user = Utilisateur.objects.create(
                nom=data.get('nom'),
                email=data.get('email'),
                mot_de_passe=make_password(data.get('mot_de_passe')),
                role_de_utilisateur=data.get('role_de_utilisateur'),
                numero_de_tel=data.get('numero_de_tel'),
                created_at=datetime.now(),
                prenom=data.get('prenom'),
                sexe=data.get('sexe'),
                etat=data.get('etat'),
                matricule=data.get('matricule')
                
            )
            return Response(SuccessAPIResponse({'message': 'User created successfully', 'user_id': user.id_utilisateur}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(ErrorAPIResponse({'error': str(e)}).data, status=status.HTTP_400_BAD_REQUEST)
        