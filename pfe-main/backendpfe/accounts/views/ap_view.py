from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Ap
from ..serializers.ap_serializer import ApSerializer

class ApPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100
                
class ApView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = ApPagination

    # Méthode pour gérer la pagination des réponses
    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    # Récupérer un seul AP ou tous les AP
    def get(self, request, pk=None):
        if pk:
            return self.get_single_ap(request, pk)
        return self.get_all_aps()

    # Récupérer un AP spécifique par son ID
    def get_single_ap(self, request, pk):
        ap = self.get_object(pk)
        if not ap:
            return Response({
                'success': False,
                'message': 'AP not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ApSerializer(ap)
        return Response({
            'success': True,
            'message': 'AP retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    # Récupérer tous les AP
    def get_all_aps(self):
        aps = Ap.objects.all()
        serializer = ApSerializer(aps, many=True)
        
        # Paginer les résultats
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'APs retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    # Créer un nouvel AP
    def post(self, request):
        serializer = ApSerializer(data=request.data)
        if serializer.is_valid():
            ap = serializer.save()
            return Response({
                'success': True,
                'message': 'AP created successfully',
                'data': ApSerializer(ap).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    # Mettre à jour un AP existant
    def put(self, request, pk):
        ap = self.get_object(pk)
        if not ap:
            return Response({
                'success': False,
                'message': 'AP not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ApSerializer(ap, data=request.data)
        if serializer.is_valid():
            ap = serializer.save()
            return Response({
                'success': True,
                'message': 'AP updated successfully',
                'data': ApSerializer(ap).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # Supprimer un AP
    def delete(self, request, pk):
        ap = self.get_object(pk)
        if not ap:
            return Response({
                'success': False,
                'message': 'AP not found'
            }, status=status.HTTP_404_NOT_FOUND)

        ap.delete()
        return Response({
            'success': True,
            'message': 'AP deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    # Méthode utilitaire pour récupérer un objet AP par son ID
    def get_object(self, pk):
        try:
            return Ap.objects.get(pk=pk)
        except Ap.DoesNotExist:
            return None