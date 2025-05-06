from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q, Sum, Count
from ..models import Employe, Projet, SousProjet, Reunion, Document, DocumentFile, Facture
from ..permissions import IsFinancier
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
import os
from django.conf import settings


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class FinancierView(APIView):
    permission_classes = [IsAuthenticated, IsFinancier]
    pagination_class = CustomPagination
    
    def get_financier(self, request):
        """Get the financier record for the current user"""
        try:
            return Employe.objects.get(id_utilisateur=request.user.id_utilisateur)
        except Employe.DoesNotExist:
            return None
    
    def paginate_data(self, request, queryset):
        """Helper method to paginate any queryset"""
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        
        return page, {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'current_page': paginator.page.number,
            'total_pages': paginator.page.paginator.num_pages
        }
    
    def get(self, request, data_type=None):
        """
        Main router for the financier view
        """
        financier = self.get_financier(request)
        if not financier:
            return Response({
                'success': False,
                'message': 'Financier record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'projects':
            return self.get_projects(request)
        elif data_type == 'subprojects':
            return self.get_subprojects(request)
        elif data_type == 'reunions':
            return self.get_reunions(request)
        elif data_type == 'documents':
            return self.get_documents(request)
        elif data_type == 'factures':
            return self.get_factures(request)
        else:
            return self.get_dashboard(request)
    
    def get_dashboard(self, request):
        """
        Get dashboard statistics for the financier
        """
        try:
            # Get total market value (sum of all project budgets)
            total_marche = Projet.objects.aggregate(total=Sum('budget'))['total'] or 0
            
            # Get number of invoices
            nbr_factures = Facture.objects.count()
            
            # Get number of documents
            nbr_documents = Document.objects.count()
            
            # Get number of projects
            nbr_projets = Projet.objects.count()
            
            return Response({
                'success': True,
                'data': {
                    'total_marche': total_marche,
                    'nbr_factures': nbr_factures,
                    'nbr_documents': nbr_documents,
                    'nbr_projets': nbr_projets
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving dashboard data: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_projects(self, request):
        """Get all projects"""
        try:
            projects = Projet.objects.all()
            project_data = self.serialize_projects(projects)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, project_data)
            
            return Response({
                'success': True,
                'message': 'Projects retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving projects: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_subprojects(self, request):
        """Get all subprojects"""
        try:
            subprojects = SousProjet.objects.all()
            subproject_data = self.serialize_subprojects(subprojects)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, subproject_data)
            
            return Response({
                'success': True,
                'message': 'Subprojects retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving subprojects: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_reunions(self, request):
        """Get all reunions"""
        try:
            reunions = Reunion.objects.all()
            reunion_data = self.serialize_reunions(reunions)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, reunion_data)
            
            return Response({
                'success': True,
                'message': 'Reunions retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving reunions: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_documents(self, request):
        """Get all documents"""
        try:
            documents = Document.objects.all()
            document_data = self.serialize_documents(documents)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, document_data)
            
            return Response({
                'success': True,
                'message': 'Documents retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving documents: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_factures(self, request):
        """Get all invoices"""
        try:
            factures = Facture.objects.all()
            facture_data = self.serialize_factures(factures)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, facture_data)
            
            return Response({
                'success': True,
                'message': 'Invoices retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving invoices: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, data_type=None):
        """
        Router for POST requests
        """
        financier = self.get_financier(request)
        if not financier:
            return Response({
                'success': False,
                'message': 'Financier record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'documents':
            return self.add_document(request)
        elif data_type == 'factures':
            return self.add_facture(request)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, data_type=None, id=None):
        """
        Router for PUT requests
        """
        financier = self.get_financier(request)
        if not financier:
            return Response({
                'success': False,
                'message': 'Financier record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'documents' and id:
            return self.edit_document(request, id)
        elif data_type == 'factures' and id:
            return self.edit_facture(request, id)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def add_document(self, request):
        """Add a new document"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['titre', 'type', 'description']
            for field in required_fields:
                if field not in data or not data[field]:
                    return Response({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check that at least one of project_id or subproject_id is provided
            if 'project_id' not in data and 'subproject_id' not in data:
                return Response({
                    'success': False,
                    'message': 'Either project_id or subproject_id must be provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify that there are files in the request
            files = request.FILES.getlist('files')
            if not files:
                return Response({
                    'success': False,
                    'message': 'No files provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get project and subproject
            project = None
            subproject = None
            
            if 'project_id' in data and data['project_id']:
                try:
                    project = Projet.objects.get(id_projet=data['project_id'])
                except Projet.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Project not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            if 'subproject_id' in data and data['subproject_id']:
                try:
                    subproject = SousProjet.objects.get(id_sous_projet=data['subproject_id'])
                except SousProjet.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Subproject not found'
                    }, status=status.HTTP_404_NOT_FOUND)

            # Create the document
            document_data = {
                'titre': data['titre'],
                'type': data['type'],
                'date_ajout': data.get('date_ajout', datetime.now().date()),
                'description': data['description'],
                'id_projet': project,
                'id_sous_projet': subproject
            }

            document = Document.objects.create(**document_data)

            # Handle file uploads
            for file in files:
                # Get file type and extension
                file_type = data['type'].lower()
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
                project_id = data.get('project_id', 'unknown')
                new_filename = f"{timestamp}_{project_id}_{len(document.files.all())}{file_extension}"
                
                # Save the file
                file_path = os.path.join(full_upload_dir, new_filename)
                with open(file_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)

                # Create document file record
                DocumentFile.objects.create(
                    id_document=document,
                    chemin=os.path.join(upload_dir, new_filename)
                )

            return Response({
                'success': True,
                'message': 'Document added successfully',
                'data': {
                    'id_document': document.id_document,
                    'titre': document.titre,
                    'type': document.type,
                    'date_ajout': document.date_ajout,
                    'description': document.description,
                    'project': document.id_projet.nom_projet if document.id_projet else None,
                    'subproject': document.id_sous_projet.nom_sous_projet if document.id_sous_projet else None,
                    'files': [{
                        'id_file': file.id_file,
                        'chemin': file.chemin
                    } for file in document.files.all()]
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error adding document: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def edit_document(self, request, document_id):
        """Edit an existing document"""
        try:
            # Get the document
            try:
                document = Document.objects.get(id_document=document_id)
            except Document.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Document not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Update the document with the provided data
            data = request.data
            
            if 'titre' in data and data['titre']:
                document.titre = data['titre']
                
            if 'type' in data and data['type']:
                document.type = data['type']
                
            if 'description' in data and data['description']:
                document.description = data['description']
            
            # Handle file uploads if new files are provided
            files = request.FILES.getlist('files')
            if files:
                # Remove old files
                for old_file in document.files.all():
                    old_file_path = os.path.join(settings.MEDIA_ROOT, old_file.chemin)
                    if os.path.exists(old_file_path):
                        try:
                            os.remove(old_file_path)
                        except OSError:
                            # Log the error but continue
                            print(f"Error removing old file: {old_file_path}")
                    old_file.delete()
                
                # Handle the new file uploads
                for file in files:
                    # Get file type and extension
                    file_type = data.get('type', document.type).lower()
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
                    project_id = document.id_projet.id_projet if document.id_projet else 'unknown'
                    new_filename = f"{timestamp}_{project_id}_{len(document.files.all())}{file_extension}"
                    
                    # Save the file
                    file_path = os.path.join(full_upload_dir, new_filename)
                    with open(file_path, 'wb+') as destination:
                        for chunk in file.chunks():
                            destination.write(chunk)

                    # Create document file record
                    DocumentFile.objects.create(
                        id_document=document,
                        chemin=os.path.join(upload_dir, new_filename)
                    )
            
            # Save the updated document
            document.save()
            
            return Response({
                'success': True,
                'message': 'Document updated successfully',
                'data': {
                    'id_document': document.id_document,
                    'titre': document.titre,
                    'type': document.type,
                    'date_ajout': document.date_ajout,
                    'description': document.description,
                    'project': document.id_projet.nom_projet if document.id_projet else None,
                    'subproject': document.id_sous_projet.nom_sous_projet if document.id_sous_projet else None,
                    'files': [{
                        'id_file': file.id_file,
                        'chemin': file.chemin
                    } for file in document.files.all()]
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error updating document: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def add_facture(self, request):
        """Add a new invoice"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['numero_facture', 'montant', 'date_facture', 'description']
            for field in required_fields:
                if field not in data or not data[field]:
                    return Response({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check that at least one of project_id or subproject_id is provided
            if 'project_id' not in data and 'subproject_id' not in data:
                return Response({
                    'success': False,
                    'message': 'Either project_id or subproject_id must be provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get project and subproject
            project = None
            subproject = None
            
            if 'project_id' in data and data['project_id']:
                try:
                    project = Projet.objects.get(id_projet=data['project_id'])
                except Projet.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Project not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            if 'subproject_id' in data and data['subproject_id']:
                try:
                    subproject = SousProjet.objects.get(id_sous_projet=data['subproject_id'])
                except SousProjet.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Subproject not found'
                    }, status=status.HTTP_404_NOT_FOUND)

            # Create the invoice
            facture_data = {
                'numero_facture': data['numero_facture'],
                'montant': data['montant'],
                'date_facture': data['date_facture'],
                'description': data['description'],
                'id_projet': project,
                'id_sous_projet': subproject,
                'statut': data.get('statut', 'en_attente')
            }

            facture = Facture.objects.create(**facture_data)

            return Response({
                'success': True,
                'message': 'Invoice added successfully',
                'data': {
                    'id_facture': facture.id_facture,
                    'numero_facture': facture.numero_facture,
                    'montant': facture.montant,
                    'date_facture': facture.date_facture,
                    'description': facture.description,
                    'statut': facture.statut,
                    'project': facture.id_projet.nom_projet if facture.id_projet else None,
                    'subproject': facture.id_sous_projet.nom_sous_projet if facture.id_sous_projet else None
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error adding invoice: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def edit_facture(self, request, facture_id):
        """Edit an existing invoice"""
        try:
            # Get the invoice
            try:
                facture = Facture.objects.get(id_facture=facture_id)
            except Facture.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Invoice not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Update the invoice with the provided data
            data = request.data
            
            if 'numero_facture' in data and data['numero_facture']:
                facture.numero_facture = data['numero_facture']
                
            if 'montant' in data and data['montant']:
                facture.montant = data['montant']
                
            if 'date_facture' in data and data['date_facture']:
                facture.date_facture = data['date_facture']
                
            if 'description' in data and data['description']:
                facture.description = data['description']
                
            if 'statut' in data and data['statut']:
                facture.statut = data['statut']
            
            # Save the updated invoice
            facture.save()
            
            return Response({
                'success': True,
                'message': 'Invoice updated successfully',
                'data': {
                    'id_facture': facture.id_facture,
                    'numero_facture': facture.numero_facture,
                    'montant': facture.montant,
                    'date_facture': facture.date_facture,
                    'description': facture.description,
                    'statut': facture.statut,
                    'project': facture.id_projet.nom_projet if facture.id_projet else None,
                    'subproject': facture.id_sous_projet.nom_sous_projet if facture.id_sous_projet else None
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error updating invoice: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def serialize_projects(self, projects):
        """Serialize project data"""
        return [{
            'id_projet': p.id_projet,
            'nom_projet': p.nom_projet,
            'description_de_projet': p.description_de_projet,
            'date_debut_de_projet': p.date_debut_de_projet,
            'date_fin_de_projet': p.date_fin_de_projet,
            'status': p.status,
            'budget': p.budget
        } for p in projects]
    
    def serialize_subprojects(self, subprojects):
        """Serialize subproject data"""
        return [{
            'id_sous_projet': sp.id_sous_projet,
            'nom_sous_projet': sp.nom_sous_projet,
            'description_sous_projet': sp.description_sous_projet,
            'date_debut_sousprojet': sp.date_debut_sousprojet,
            'date_finsousprojet': sp.date_finsousprojet,
            'status_sous_projet': sp.statut_sous_projet,
            'project': {
                'id_projet': sp.id_projet.id_projet,
                'nom_projet': sp.id_projet.nom_projet
            } if sp.id_projet else None
        } for sp in subprojects]
    
    def serialize_reunions(self, reunions):
        """Serialize reunion data"""
        return [{
            'id_reunion': r.id_reunion,
            'date_reunion': r.date_reunion,
            'ordre_de_jour': r.ordre_de_jour,
            'lieu_reunion': r.lieu_reunion,
            'heure_re': r.heure_re,
            'project': {
                'id_projet': r.id_projet.id_projet,
                'nom_projet': r.id_projet.nom_projet
            } if r.id_projet else None
        } for r in reunions]
    
    def serialize_documents(self, documents):
        """Serialize document data"""
        return [{
            'id_document': d.id_document,
            'titre': d.titre,
            'type': d.type,
            'date_ajout': d.date_ajout,
            'description': d.description,
            'project': {
                'id_projet': d.id_projet.id_projet,
                'nom_projet': d.id_projet.nom_projet
            } if d.id_projet else None,
            'subproject': {
                'id_sous_projet': d.id_sous_projet.id_sous_projet,
                'nom_sous_projet': d.id_sous_projet.nom_sous_projet
            } if d.id_sous_projet else None,
            'files': [{
                'id_file': f.id_file,
                'chemin': f.chemin
            } for f in d.files.all()]
        } for d in documents]
    
    def serialize_factures(self, factures):
        """Serialize invoice data"""
        return [{
            'id_facture': f.id_facture,
            'numero_facture': f.numero_facture,
            'montant': f.montant,
            'date_facture': f.date_facture,
            'description': f.description,
            'statut': f.statut,
            'project': {
                'id_projet': f.id_projet.id_projet,
                'nom_projet': f.id_projet.nom_projet
            } if f.id_projet else None,
            'subproject': {
                'id_sous_projet': f.id_sous_projet.id_sous_projet,
                'nom_sous_projet': f.id_sous_projet.nom_sous_projet
            } if f.id_sous_projet else None
        } for f in factures] 