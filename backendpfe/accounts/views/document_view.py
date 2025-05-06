from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Document, DocumentFile
from ..serializers.document_serializer import DocumentSerializer, DocumentFileSerializer
import os
from django.conf import settings
from datetime import datetime

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

        # Get document data with files
        document_data = {
            'id_document': document.id_document,
            'titre': document.titre,
            'type': document.type,
            'date_ajout': document.date_ajout,
            'description': document.description,
            'files': [{
                'id_file': file.id_file,
                'chemin': file.chemin
            } for file in document.files.all()]
        }

        # Add project details if exists
        if document.id_projet:
            document_data['project'] = {
                'id_projet': document.id_projet.id_projet,
                'nom_projet': document.id_projet.nom_projet,
                'description_de_projet': document.id_projet.description_de_projet,
                'date_debut_de_projet': document.id_projet.date_debut_de_projet,
                'date_fin_de_projet': document.id_projet.date_fin_de_projet,
                'status': document.id_projet.status
            }

        # Add subproject details if exists
        if document.id_sous_projet:
            document_data['subproject'] = {
                'id_sous_projet': document.id_sous_projet.id_sous_projet,
                'nom_sous_projet': document.id_sous_projet.nom_sous_projet,
                'description_sous_projet': document.id_sous_projet.description_sous_projet,
                'date_debut_sousprojet': document.id_sous_projet.date_debut_sousprojet,
                'date_finsousprojet': document.id_sous_projet.date_finsousprojet,
                'status_sous_projet': document.id_sous_projet.statut_sous_projet
            }

        return Response({
            'success': True,
            'message': 'Document retrieved successfully',
            'data': document_data
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
        try:
            # Get files from the request
            files = request.FILES.getlist('files')
            if not files:
                return Response({
                    'success': False,
                    'message': 'No files provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            files_data = []
            for file in files:
                # Get file type and extension
                file_type = request.data.get('type', '').lower()
                file_extension = os.path.splitext(file.name)[1].lower()
                
                # Validate file type matches extension
                if file_type == 'pdf' and file_extension != '.pdf':
                    return Response({
                        'success': False,
                        'message': 'File extension does not match specified type'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Create appropriate folder based on file type
                if file_type == 'pdf':
                    upload_dir = os.path.join('pdfs')
                elif file_type in ['jpg', 'jpeg', 'png', 'gif']:
                    upload_dir = os.path.join('images')
                else:
                    upload_dir = os.path.join('other')

                # Create full path for directory
                full_upload_dir = os.path.join(settings.MEDIA_ROOT, upload_dir)
                os.makedirs(full_upload_dir, exist_ok=True)

                # Generate unique filename with timestamp and project ID
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                project_id = request.data.get('id_projet', 'unknown')
                new_filename = f"{timestamp}_{project_id}_{len(files_data)}{file_extension}"
                
                # Save the file
                file_path = os.path.join(full_upload_dir, new_filename)
                with open(file_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)

                # Add file data to list
                files_data.append({
                    'chemin': os.path.join(upload_dir, new_filename)
                })

            # Create document data dictionary with current date as default for date_ajout
            document_data = {
                'titre': request.data.get('titre'),
                'type': file_type,
                'date_ajout': request.data.get('date_ajout', datetime.now().date()),
                'description': request.data.get('description'),
                'id_projet': request.data.get('id_projet'),
                'id_sous_projet': request.data.get('id_sous_projet')
            }

            # Create serializer with files data in context
            serializer = DocumentSerializer(data=document_data, context={'files_data': files_data})
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

        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

        # Delete associated files
        for file in document.files.all():
            file_path = os.path.join(settings.MEDIA_ROOT, file.chemin)
            if os.path.exists(file_path):
                os.remove(file_path)
            file.delete()

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
