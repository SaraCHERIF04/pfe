from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password, make_password
from .models import Utilisateur, Projet
from .permissions import IsAdmin, IsChefDeProjet
from datetime import datetime
from django.contrib.auth.hashers import check_password, make_password
import logging

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    mot_de_passe = request.data.get('mot_de_passe')

    if not email or not mot_de_passe:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Utilisateur.objects.get(email=email)
    except Utilisateur.DoesNotExist:
        print("User not found with email:", email)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    print("Entered password:", mot_de_passe)
    print("Stored hash:", user.mot_de_passe)

    # Check if password matches
    is_valid = check_password(mot_de_passe, user.mot_de_passe)
    print("Password match:", is_valid)

    if not is_valid:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'message': 'Login successful',
        'user_id': user.id_utilisateur,
        'role': user.role_de_utilisateur
    }, status=status.HTTP_200_OK)

# --- CREATE ACCOUNT (Admin only) ---
@api_view(['POST'])
@permission_classes([IsAdmin])  
def create_account(request):
    data = request.data
    try:
        user = Utilisateur.objects.create(
            nom=data.get('nom'),
            email=data.get('email'),
            mot_de_passe=make_password(data.get('mot_de_passe')),
            role_de_utilisateur=data.get('role_de_utilisateur'),
            numero_de_tel=data.get('numero_de_tel'),
            created_at=datetime.now()
        )
        return Response({'message': 'User created successfully', 'user_id': user.id_utilisateur}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)


# --- CREATE PROJECT (Chef de Projet only) ---
class CreateProjectView(APIView):
    permission_classes = [IsChefDeProjet]
 
    def post(self, request):
        data = request.data
        try:
            project = Projet.objects.create(
                nom_projet=data.get('nom_projet'),
                description_de_projet=data.get('description_de_projet'),
                date_debut_de_projet=data.get('date_debut_de_projet'),
                date_fin_de_projet=data.get('date_fin_de_projet'),
                statut=data.get('statut'),
                wilaya=data.get('wilaya'),
                id_budget_id=data.get('id_budget')  # foreign key
            )
            return Response({'message': 'Project created successfully', 'project_id': project.id_projet}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
