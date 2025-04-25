from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Projet
from ..serializers.Projects_serializers import ProjetSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse

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
        projet = self.get_object(pk)
        if not projet:
            return Response({
                'success': False,
                'message': 'Projet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjetSerializer(projet)
        return Response({
            'success': True,
            'message': 'Projet retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_projects(self):
        projets = Projet.objects.all().order_by('-id_projet')
        serializer = ProjetSerializer(projets, many=True)

        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Projets retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)

        return paginated_response

    def post(self, request):
        serializer = ProjetSerializer(data=request.data)
        if serializer.is_valid():
            projet = serializer.save()
            return Response({
                'success': True,
                'message': 'Projet created successfully',
                'data': ProjetSerializer(projet).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        projet = self.get_object(pk)
        if not projet:
            return Response({
                'success': False,
                'message': 'Projet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjetSerializer(projet, data=request.data)
        if serializer.is_valid():
            projet = serializer.save()
            return Response({
                'success': True,
                'message': 'Projet updated successfully',
                'data': ProjetSerializer(projet).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        projet = self.get_object(pk)
        if not projet:
            return Response({
                'success': False,
                'message': 'Projet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        projet.delete()
        return Response({
            'success': True,
            'message': 'Projet deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Projet.objects.get(pk=pk)
        except Projet.DoesNotExist:
            return None
