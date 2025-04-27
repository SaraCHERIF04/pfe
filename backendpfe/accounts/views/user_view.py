from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Utilisateur
from ..serializers.utilisateur_serializer import UtilisateurSerializer
from ..services.notification_service import NotificationService
from ..services.email_service import EmailService
from ..services.token_service import TokenService
from ..permissions import IsAdmin
from django.contrib.auth.hashers import make_password
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
        if self.request.method in ['POST', 'PUT', 'DELETE']:
            return [IsAdmin()]
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
        
        # Add search functionality
        search_query = self.request.query_params.get('search', None)
        if search_query:
            users = users.filter(
                nom__icontains=search_query
            ) | users.filter(
                prenom__icontains=search_query
            ) | users.filter(
                matricule__icontains=search_query
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
            # Create user without password
            user = serializer.save()
            
            token = TokenService.generate_token(user.id_utilisateur)
            
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

        serializer = UtilisateurSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Hash the password if it's being updated
            password = serializer.validated_data.get('mot_de_passe')
            if password:
                serializer.validated_data['mot_de_passe'] = make_password(password)
            
            user = serializer.save()
            
            # Send notification to the user about their profile update
            NotificationService.send_notification(
                title="Profile Updated",
                content="Your profile has been updated",
                notification_type="info",
                user_ids=[user.id_utilisateur],
                link=f"/users/{user.id_utilisateur}"
            )
            
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

        # Send notification to admins about user deletion
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