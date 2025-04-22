from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Facture
from ..serializers.facture_serializer import FactureSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse

class FacturePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class FactureView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = FacturePagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, projet_id=None, sous_projet_id=None, pk=None):
        if projet_id:
            return self.get_factures_by_project(request, projet_id)
        
        if sous_projet_id:
            return self.get_factures_by_sub_project(request, sous_projet_id)

        if pk:
            return self.get_single_facture(request, pk)

        return self.get_all_factures()

    def get_single_facture(self, request, pk):
        facture = self.get_object(pk)
        if not facture:
            return ErrorAPIResponse({
                'success': False,
                'message': 'Facture not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = FactureSerializer(facture)
        return SuccessAPIResponse({
            'success': True,
            'message': 'Facture retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_factures(self):
        factures = Facture.objects.all()
        serializer = FactureSerializer(factures, many=True)
        return SuccessAPIResponse({
            'success': True,
            'message': 'Factures retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FactureSerializer(data=request.data)
        if serializer.is_valid():
            facture = serializer.save()
            return SuccessAPIResponse({
                'success': True,
                'message': 'Facture created successfully',
                'data': FactureSerializer(facture).data
            }, status=status.HTTP_201_CREATED)

        return ErrorAPIResponse({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        facture = self.get_object(pk)
        if not facture:
            return ErrorAPIResponse({
                'success': False,
                'message': 'Facture not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = FactureSerializer(facture, data=request.data)
        if serializer.is_valid():
            facture = serializer.save()
            return SuccessAPIResponse({
                'success': True,
                'message': 'Facture updated successfully',
                'data': FactureSerializer(facture).data
            }, status=status.HTTP_200_OK)

        return ErrorAPIResponse({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        facture = self.get_object(pk)
        if not facture:
            return ErrorAPIResponse({
                'success': False,
                'message': 'Facture not found'
            }, status=status.HTTP_404_NOT_FOUND)

        facture.delete()
        return SuccessAPIResponse({
            'success': True,
            'message': 'Facture deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_factures_by_project(self, request, projet_id):
        factures = Facture.objects.filter(id_projet=projet_id)
        serializer = FactureSerializer(factures, many=True)

        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return SuccessAPIResponse({
                'success': True,
                'message': 'Factures retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)

        return paginated_response

    def get_factures_by_sub_project(self, request, sous_projet_id):
        factures = Facture.objects.filter(id_sous_projet=sous_projet_id)
        serializer = FactureSerializer(factures, many=True)

        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return SuccessAPIResponse({
                'success': True,
                'message': 'Factures retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)

        return paginated_response

    def get_object(self, pk):
        try:
            return Facture.objects.get(pk=pk)
        except Facture.DoesNotExist:
            return None
