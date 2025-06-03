from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Utilisateur, Employe, Chefprojet, Financier, Directeur
from ..serializers.utilisateur_serializer import UtilisateurSerializer
from ..services.notification_service import NotificationService
from ..services.email_service import EmailService
from ..services.token_service import TokenService
from ..permissions import IsAdmin
from django.contrib.auth.hashers import make_password, check_password
from django.urls import reverse
from django.conf import settings

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = UserPagination

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdmin()]
        elif self.request.method == 'POST':
            return [IsAdmin()]
        elif self.request.method == 'PUT':
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_user(request, pk)
        return self.get_all_users()

    def get_single_user(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = UtilisateurSerializer(user)
        return Response({
            'success': True,
            'message': 'User retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_users(self):
        print("Getting all users")
        users = Utilisateur.objects.all()
        
        search_query = self.request.query_params.get('search', None)
        user_type = self.request.query_params.get('type', None)
        if search_query:
            users = users.filter(
                nom__icontains=search_query
            ) | users.filter(
                prenom__icontains=search_query
            ) | users.filter(
                matricule__icontains=search_query
            )
        

        if user_type:
            if user_type == 'employee':
                listTypes =['employee','finanicer']
                users = users.filter(
                    role_de_utilisateur__in=listTypes
                )



        serializer = UtilisateurSerializer(users, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Users retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = TokenService.generate_token(user.id_utilisateur)
            if user.role_de_utilisateur == 'employee':
                Employe.objects.create(id_utilisateur=user)
            elif user.role_de_utilisateur == 'chef':
                Chefprojet.objects.create(id_utilisateur=user)
            elif user.role_de_utilisateur == 'directeur' or user.role_de_utilisateur == 'responsable':
                Directeur.objects.create(id_utilisateur=user)
            elif user.role_de_utilisateur == 'financier':
                Financier.objects.create(id_utilisateur=user)
                Employe.objects.create(id_utilisateur=user)
            
            try:
                EmailService.send_password_setup_email(user.email, token)
            except Exception as e:
                print(f"Failed to send email: {str(e)}")

            return Response({
                'success': True,
                'message': 'User created successfully. Password setup email has been sent.',
                'data': UtilisateurSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        is_admin = request.user.role_de_utilisateur == 'admin'
        is_own_profile = str(request.user.id_utilisateur) == str(pk)
        
        if not is_admin and not is_own_profile:
            return Response({
                'success': False,
                'message': 'You do not have permission to modify this profile'
            }, status=status.HTTP_403_FORBIDDEN)

        if not is_admin and is_own_profile:
            allowed_fields = ['nom', 'prenom', 'numero_de_tel', 'sexe', 'etat', 'mot_de_passe','email']
            data = {}
            for field in allowed_fields:
                if field in request.data:
                    data[field] = request.data[field]
            
            serializer = UtilisateurSerializer(user, data=data, partial=True)
        else:
            serializer = UtilisateurSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            password = serializer.validated_data.get('mot_de_passe')
            if password:
                serializer.validated_data['mot_de_passe'] = make_password(password)
            
            user = serializer.save()
            
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'data': UtilisateurSerializer(user).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        admin_users = Utilisateur.objects.filter(role_de_utilisateur='admin')
        admin_ids = [admin.id_utilisateur for admin in admin_users]
        
        NotificationService.send_notification(
            title="User Deleted",
            content=f"User '{user.nom}' has been deleted",
            notification_type="warning",
            user_ids=admin_ids
        )

        user.delete()
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Utilisateur.objects.get(pk=pk)
        except Utilisateur.DoesNotExist:
            return None


# Nouvelle classe pour gérer le profil de l'utilisateur connecté
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupérer le profil de l'utilisateur connecté"""
        try:
            user = request.user
            serializer = UtilisateurSerializer(user)
            return Response({
                'success': True,
                'message': 'Profile retrieved successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """Mettre à jour le profil de l'utilisateur connecté"""
        try:
            user = request.user
            
            # Champs autorisés pour la mise à jour du profil
            allowed_fields = ['nom', 'prenom', 'numero_de_tel', 'sexe', 'etat', 'matricule','email']
            
            # Filtrer les données pour ne garder que les champs autorisés
            data = {field: request.data.get(field) for field in allowed_fields if field in request.data}
            
            serializer = UtilisateurSerializer(user, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfilePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Changer le mot de passe de l'utilisateur connecté"""
        try:
            user = request.user
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            
            if not current_password or not new_password:
                return Response({
                    'success': False,
                    'message': 'Current password and new password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Vérifier le mot de passe actuel
            if not check_password(current_password, user.mot_de_passe):
                return Response({
                    'success': False,
                    'message': 'Current password is incorrect'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Mettre à jour le mot de passe
            user.mot_de_passe = make_password(new_password)
            user.save()
            
            return Response({
                'success': True,
                'message': 'Password updated successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)