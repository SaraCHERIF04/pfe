from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import MaitreOuvrage
from ..serializers.maitre_ouvrage_serializer import MaitreOuvrageSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse


class MaitreOuvragePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100


class MaitreOuvrageView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = MaitreOuvragePagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, projet_id=None, pk=None):
        if projet_id:
            return self.get_by_projet_id(request, projet_id)
        if pk:
            return self.get_single(request, pk)
        return self.get_all()

    def get_all(self):
        items = MaitreOuvrage.objects.all()
        serializer = MaitreOuvrageSerializer(items, many=True)
        return Response({
            'success': True,
            'message': 'Maitres d\'Ouvrage retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_single(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response({
                'success': False,
                'message': 'Maitre d\'Ouvrage not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MaitreOuvrageSerializer(item)
        return Response({
            'success': True,
            'message': 'Maitre d\'Ouvrage retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MaitreOuvrageSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response({
                'success': True,
                'message': 'Maitre d\'Ouvrage created successfully',
                'data': MaitreOuvrageSerializer(item).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response({
                'success': False,
                'message': 'Maitre d\'Ouvrage not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MaitreOuvrageSerializer(item, data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response({
                'success': True,
                'message': 'Maitre d\'Ouvrage updated successfully',
                'data': MaitreOuvrageSerializer(item).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response({
                'success': False,
                'message': 'Maitre d\'Ouvrage not found'
            }, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response({
            'success': True,
            'message': 'Maitre d\'Ouvrage deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_by_projet_id(self, request, projet_id):
        items = MaitreOuvrage.objects.filter(id_projet=projet_id)
        serializer = MaitreOuvrageSerializer(items, many=True)
        paginated_response = self.get_paginated_response(serializer.data)

        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Maitres d\'Ouvrage retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)

        return paginated_response

    def get_object(self, pk):
        try:
            return MaitreOuvrage.objects.get(pk=pk)
        except MaitreOuvrage.DoesNotExist:
            return None
