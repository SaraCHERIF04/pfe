from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from ..models import Ressource, Projet, Employe, SousProjet
from ..serializers import RessourceSerializer

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Resources retrieved successfully',
            'pagination': {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages
            },
            'data': data
        })

class RessourceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resources (ressources)
    """
    queryset = Ressource.objects.all()
    serializer_class = RessourceSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        user = request.user
        
        # If user is responsable, return all resources
        if user.role_de_utilisateur == 'responsable':
            queryset = self.filter_queryset(self.get_queryset())
        # If user is chef, return resources from their projects
        elif user.role_de_utilisateur == 'chef':
            project_ids = Projet.objects.filter(id_utilisateur=user.id_utilisateur).values_list('id_projet', flat=True)
            queryset = self.filter_queryset(self.get_queryset().filter(id_projet__in=project_ids))
        # For other roles, return resources from projects where they are part of sub-projects
        else:
            subProjectIds = Employe.objects.filter(id_utilisateur=user.id_utilisateur).values_list('id_sous_projet', flat=True)
            user_sub_projects = SousProjet.objects.filter(id_sous_projet__in=subProjectIds)
            project_ids = user_sub_projects.values_list('id_projet', flat=True).distinct()
            queryset = self.filter_queryset(self.get_queryset().filter(id_projet__in=project_ids))

        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Resources retrieved successfully',
            'data': serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Resource created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Resource creation failed',
            'data': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Resource retrieved successfully',
            'data': serializer.data
        })

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Resource updated successfully',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Resource update failed',
            'data': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            'success': True,
            'message': 'Resource deleted successfully',
            'data': None
        }, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ressources_by_projet(request, projet_id):
    """
    Get all resources for a specific project
    """
    paginator = CustomPagination()
    ressources = Ressource.objects.filter(id_projet=projet_id)
    page = paginator.paginate_queryset(ressources, request)
    
    if page is not None:
        serializer = RessourceSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = RessourceSerializer(ressources, many=True)
    return Response({
        'success': True,
        'message': 'Resources retrieved successfully',
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ressources_by_sous_projet(request, sous_projet_id):
    """
    Get all resources for a specific sub-project
    """
    paginator = CustomPagination()
    ressources = Ressource.objects.filter(id_sous_projet=sous_projet_id)
    page = paginator.paginate_queryset(ressources, request)
    
    if page is not None:
        serializer = RessourceSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = RessourceSerializer(ressources, many=True)
    return Response({
        'success': True,
        'message': 'Resources retrieved successfully',
        'data': serializer.data
    }) 