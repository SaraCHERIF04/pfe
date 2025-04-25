from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import MaitreDoeuve
from ..serializers.maitre_doeuvre_serializer import MaitreDoeuvreSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse

class MaitreDoeuvrePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class MaitreDoeuvreView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = MaitreDoeuvrePagination

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

    def get_single(self, request, pk):
        md = self.get_object(pk)
        if not md:
            return Response({
                'success': False,
                'message': "Maitre d'oeuvre not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MaitreDoeuveSerializer(md)
        return Response({
            'success': True,
            'message': "Maitre d'oeuvre retrieved successfully",
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all(self):
        mds = MaitreDoeuve.objects.all()
        serializer = MaitreDoeuveSerializer(mds, many=True)
        return Response({
            'success': True,
            'message': "Maitre d'oeuvre list retrieved successfully",
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MaitreDoeuveSerializer(data=request.data)
        if serializer.is_valid():
            md = serializer.save()
            return Response({
                'success': True,
                'message': "Maitre d'oeuvre created successfully",
                'data': MaitreDoeuveSerializer(md).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': "Invalid data",
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        md = self.get_object(pk)
        if not md:
            return Response({
                'success': False,
                'message': "Maitre d'oeuvre not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MaitreDoeuveSerializer(md, data=request.data)
        if serializer.is_valid():
            md = serializer.save()
            return Response({
                'success': True,
                'message': "Maitre d'oeuvre updated successfully",
                'data': MaitreDoeuveSerializer(md).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': "Invalid data",
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        md = self.get_object(pk)
        if not md:
            return Response({
                'success': False,
                'message': "Maitre d'oeuvre not found"
            }, status=status.HTTP_404_NOT_FOUND)

        md.delete()
        return Response({
            'success': True,
            'message': "Maitre d'oeuvre deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)

    def get_by_projet_id(self, request, projet_id):
        mds = MaitreDoeuve.objects.filter(id_projet=projet_id)
        serializer = MaitreDoeuveSerializer(mds, many=True)
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': "Maitres d'oeuvre retrieved by project",
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        return paginated_response

    def get_object(self, pk):
        try:
            return MaitreDoeuve.objects.get(pk=pk)
        except MaitreDoeuve.DoesNotExist:
            return None
