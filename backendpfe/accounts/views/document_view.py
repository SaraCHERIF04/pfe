from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Document
from ..serializers.document_serializer import DocumentSerializer

class DocumentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class DocumentView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = DocumentPagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_document(request, pk)
        return self.get_all_documents()

    def get_single_document(self, request, pk):
        document = self.get_object(pk)
        if not document:
            return Response({
                'success': False,
                'message': 'Document not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSerializer(document)
        return Response({
            'success': True,
            'message': 'Document retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_documents(self):
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Documents retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()
            return Response({
                'success': True,
                'message': 'Document created successfully',
                'data': DocumentSerializer(document).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        document = self.get_object(pk)
        if not document:
            return Response({
                'success': False,
                'message': 'Document not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSerializer(document, data=request.data)
        if serializer.is_valid():
            document = serializer.save()
            return Response({
                'success': True,
                'message': 'Document updated successfully',
                'data': DocumentSerializer(document).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        document = self.get_object(pk)
        if not document:
            return Response({
                'success': False,
                'message': 'Document not found'
            }, status=status.HTTP_404_NOT_FOUND)

        document.delete()
        return Response({
            'success': True,
            'message': 'Document deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            return None
