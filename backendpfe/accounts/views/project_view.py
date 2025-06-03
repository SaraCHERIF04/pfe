from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Projet, Employe, Document, SousProjet,MaitreOuvrage
from ..serializers.project_serializer import ProjetSerializer
from ..services.notification_service import NotificationService

class ProjectPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class ProjectView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = ProjectPagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_project(request, pk)
        return self.get_all_projects(request)

    def get_single_project(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({
                'success': False,
                'message': 'Project not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjetSerializer(project)
        return Response({
            'success': True,
            'message': 'Project retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_projects(self, request):
        user = request.user
        
        # If user is responsable, return all projects
        if user.role_de_utilisateur == 'responsable':
            projects = Projet.objects.all()
        # If user is chef, return only their projects
        elif user.role_de_utilisateur == 'chef':
            projects = Projet.objects.filter(id_utilisateur=user.id_utilisateur)
        # For other roles, return projects where they are part of sub-projects
        else:
            # Get all sub-projects where the user is 
            subProjectIds = Employe.objects.filter(id_utilisateur=user.id_utilisateur).values_list('id_sous_projet', flat=True)
            user_sub_projects = SousProjet.objects.filter(id_sous_projet__in=subProjectIds)
            # Get the parent projects of these sub-projects
            project_ids = user_sub_projects.values_list('id_projet', flat=True).distinct()
            projects = Projet.objects.filter(id_projet__in=project_ids)

        serializer = ProjetSerializer(projects, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Projects retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = ProjetSerializer(data=request.data)
        members_data = request.data.pop('members', [])
        if serializer.is_valid():
            project = serializer.save()
            for member_data in members_data:
                Employe.objects.create(
                    id_projet=project,
                    id_utilisateur_id=member_data['id'],
                )
            
            maitre_d_ouvrage_data = request.data.pop('maitre_ouvrage', None)
            maitre_d_ouvrage = MaitreOuvrage.objects.filter(id_mo=maitre_d_ouvrage_data).first()
            project.id_mo = maitre_d_ouvrage.id_mo
            project.save()
            
            NotificationService.send_project_notification(
                project_name=project.nom_projet,
                project_id=project.id_projet,
                user_ids=[58]
            )
            return Response({
                'success': True,
                'message': 'Project created successfully',
                'data': ProjetSerializer(project).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({
                'success': False,
                'message': 'Project not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjetSerializer(project, data=request.data, partial=True)
        members_data = request.data.pop('members', [])
        if serializer.is_valid():
            project = serializer.save()
            for member_data in members_data:
                Employe.objects.filter(id_projet=project, id_utilisateur_id=member_data['id']).delete()
                Employe.objects.create(
                    id_projet=project,
                    id_utilisateur_id=member_data['id'],
                )
            maitre_d_ouvrage_data = request.data.pop('maitre_ouvrage', None)
            maitre_d_ouvrage = MaitreOuvrage.objects.filter(id_mo=maitre_d_ouvrage_data).first()
            project.id_mo = maitre_d_ouvrage.id_mo
            project.save()
            return Response({
                'success': True,
                'message': 'Project updated successfully',
                'data': ProjetSerializer(project).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({
                'success': False,
                'message': 'Project not found'
            }, status=status.HTTP_404_NOT_FOUND)
        for rel in project._meta.related_objects:
           accessor_name = rel.get_accessor_name()
           related_manager = getattr(project, accessor_name)
           # Use all().delete() to remove related objects
           related_count = related_manager.all().count()
           if related_count > 0:
              related_manager.all().delete()
              print(f"Deleted {related_count} objects from {accessor_name}")
        project.delete()
        return Response({
            'success': True,
            'message': 'Project deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    def get_object(self, pk):
        try:
            return Projet.objects.get(pk=pk)
        except Projet.DoesNotExist:
            return None
