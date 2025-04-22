from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Projet
from ..serializers.project_serializer import ProjetSerializer

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
        return self.get_all_projects()

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

    def get_all_projects(self):
        projects = Projet.objects.all()
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
        if serializer.is_valid():
            project = serializer.save()
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

        serializer = ProjetSerializer(project, data=request.data)
        if serializer.is_valid():
            project = serializer.save()
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
