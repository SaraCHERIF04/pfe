from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from ..models import Utilisateur
from ..serializers.utilisateur_serializer import UtilisateurSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse
from django.contrib.auth.hashers import make_password

class AuthView(APIView):

    def get_permissions(self):
        # Allow anyone to POST login
        if self.request.method == 'POST' and self.request.data.get('action') == 'login':
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request):
        action = request.data.get('action')

        if action == 'login':
            return self.login(request)

        # Only admin can create accounts or update user data
        if not request.user.is_authenticated or request.user.role_de_utilisateur != 'admin':
            return Response(ErrorAPIResponse({'error': 'Permission denied'}).data, status=status.HTTP_403_FORBIDDEN)

        if action == 'create_account':
            return self.create_account(request)
        elif action == 'update_user':
            return self.update_user(request)

        return Response(ErrorAPIResponse({'error': 'Invalid action'}).data, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # Only admin can get the list of users
        if request.user.role_de_utilisateur != 'admin':
            return Response(ErrorAPIResponse({'error': 'Permission denied'}).data, status=status.HTTP_403_FORBIDDEN)

        utilisateurs = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response(SuccessAPIResponse({
            'message': 'Liste des utilisateurs récupérée avec succès',
            'data': serializer.data
        }).data, status=status.HTTP_200_OK)

    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = Utilisateur.objects.filter(email=email).first()

        if user and user.check_password(password):
            serializer = UtilisateurSerializer(user)
            return Response(SuccessAPIResponse({
                'message': 'Connexion réussie',
                'user': serializer.data
            }).data)
        else:
            return Response(ErrorAPIResponse({'error': 'Identifiants invalides'}).data, status=status.HTTP_401_UNAUTHORIZED)

    def create_account(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(password=make_password(serializer.validated_data['password']))
            return Response(SuccessAPIResponse({
                'message': 'Compte créé avec succès',
                'user': serializer.data
            }).data, status=status.HTTP_201_CREATED)
        return Response(ErrorAPIResponse({'error': serializer.errors}).data, status=status.HTTP_400_BAD_REQUEST)

    def update_user(self, request):
        user_id = request.data.get('user_id')
        user = Utilisateur.objects.filter(id=user_id).first()

        if not user:
            return Response(ErrorAPIResponse({'error': 'User not found'}).data, status=status.HTTP_404_NOT_FOUND)

        # Only allow admins to update user details
        if request.user.role_de_utilisateur != 'admin':
            return Response(ErrorAPIResponse({'error': 'Permission denied'}).data, status=status.HTTP_403_FORBIDDEN)

        serializer = UtilisateurSerializer(user, data=request.data, partial=True)  # Partial update
        if serializer.is_valid():
            # If password is provided, hash it before saving
            password = request.data.get('password')
            if password:
                user.password = make_password(password)
            serializer.save()
            return Response(SuccessAPIResponse({
                'message': 'User updated successfully',
                'user': serializer.data
            }).data, status=status.HTTP_200_OK)
        return Response(ErrorAPIResponse({'error': serializer.errors}).data, status=status.HTTP_400_BAD_REQUEST)
