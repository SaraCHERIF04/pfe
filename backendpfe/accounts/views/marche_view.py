from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Marche
from ..serializers.marche_serializer import MarcheSerializer
from ..services.notification_service import NotificationService

class MarchePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class MarcheView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = MarchePagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_marche(request, pk)
        return self.get_all_marches(request)

    def get_single_marche(self, request, pk):
        marche = self.get_object(pk)
        if not marche:
            return Response({
                'success': False,
                'message': 'Marche not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MarcheSerializer(marche)
        return Response({
            'success': True,
            'message': 'Marche retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_marches(self, request):
        marches = Marche.objects.all()
        serializer = MarcheSerializer(marches, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Marches retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = MarcheSerializer(data=request.data)
        if serializer.is_valid():
            marche = serializer.save()
            NotificationService.send_project_notification(
                project_name=f"New Marche: {marche.description_marche}",
                project_id=marche.id_projet.id_projet if marche.id_projet else None,
                user_ids=[12]
            )
            return Response({
                'success': True,
                'message': 'Marche created successfully',
                'data': MarcheSerializer(marche).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        marche = self.get_object(pk)
        if not marche:
            return Response({
                'success': False,
                'message': 'Marche not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MarcheSerializer(marche, data=request.data, partial=True)
        if serializer.is_valid():
            marche = serializer.save()
            return Response({
                'success': True,
                'message': 'Marche updated successfully',
                'data': MarcheSerializer(marche).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        marche = self.get_object(pk)
        if not marche:
            return Response({
                'success': False,
                'message': 'Marche not found'
            }, status=status.HTTP_404_NOT_FOUND)

        marche.delete()
        return Response({
            'success': True,
            'message': 'Marche deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Marche.objects.get(pk=pk)
        except Marche.DoesNotExist:
            return None 