
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from ..permissions import IsAdmin, IsChefDeProjet
from ..models import Utilisateur, Projet


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
                id_budget_id=data.get('id_budget')
            )
            return Response({'message': 'Project created successfully', 'project_id': project.id_projet}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)