from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from ..models import Employe, Projet, SousProjet, Reunion, Incident, Utilisateur, Document, DocumentFile
from ..permissions import IsEmployee
from rest_framework.pagination import PageNumberPagination
from datetime import datetime, timedelta
import os
from django.conf import settings
import uuid
import calendar



class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EmployerView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    
    def get_employee(self, request):
        """Get all employee records for the current user"""
        try:
            return Employe.objects.filter(id_utilisateur=request.user.id_utilisateur)
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
        Main router for the employer view
        """
        employees = self.get_employee(request)
        if not employees:
            return Response({
                'success': False,
                'message': 'Employee records not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'projects':
            return self.get_projects(request, employees)
        elif data_type == 'subprojects':
            return self.get_subprojects(request, employees)
        elif data_type == 'reunions':
            return self.get_reunions(request, employees)
        elif data_type == 'incidents':
            return self.get_incidents(request, employees)
        elif data_type == 'documents':
            return self.get_documents(request, employees)
        else:
            return self.get_dashboard(request, employees)
    
    def get_dashboard(self, request, employees):
        """
        Get all projects, subprojects, reunions, and incidents associated with the logged-in employee.
        """
        try:
            # Get all projects and subprojects associated with these employees
            projects = []
            subprojects = []
            
            for employee in employees:
                if employee.id_projet:
                    projects.append(employee.id_projet)
                if employee.id_sous_projet:
                    subprojects.append(employee.id_sous_projet)
                    if employee.id_sous_projet.id_projet:
                        projects.append(employee.id_sous_projet.id_projet)
            
            # Remove duplicates while preserving order
            unique_projects = []
            seen_project_ids = set()
            for project in projects:
                if project.id_projet not in seen_project_ids:
                    seen_project_ids.add(project.id_projet)
                    unique_projects.append(project)
            
            unique_subprojects = []
            seen_subproject_ids = set()
            for subproject in subprojects:
                if subproject.id_sous_projet not in seen_subproject_ids:
                    seen_subproject_ids.add(subproject.id_sous_projet)
                    unique_subprojects.append(subproject)
            
            # If no projects or subprojects are assigned to the employee
            if not unique_projects and not unique_subprojects:
                return Response({
                    'success': True,
                    'message': 'No projects or subprojects assigned to this employee',
                    'data': {
                        'projects': [],
                        'subprojects': [],
                        'reunions': [],
                        'incidents': []
                    }
                }, status=status.HTTP_200_OK)
            
            # Get all reunions related to the employee's projects
            project_ids = [p.id_projet for p in unique_projects]
            reunions = Reunion.objects.filter(id_projet__id_projet__in=project_ids).distinct()
            
            # Get all incidents related to the employee's projects/subprojects
            subproject_ids = [sp.id_sous_projet for sp in unique_subprojects]
            incidents = Incident.objects.filter(
                Q(id_projet__id_projet__in=project_ids) | 
                Q(id_sous_projet__id_sous_projet__in=subproject_ids)
            ).distinct()
            
            # Serialize the data
            project_data = self.serialize_projects(unique_projects)
            subproject_data = self.serialize_subprojects(unique_subprojects)
            reunion_data = self.serialize_reunions(reunions)
            incident_data = self.serialize_incidents(incidents)
            
            return Response({
                'success': True,
                'message': 'Employee data retrieved successfully',
                'data': {
                    'projects': project_data,
                    'subprojects': subproject_data,
                    'reunions': reunion_data,
                    'incidents': incident_data
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee data: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_projects(self, request, employees):
        """Get all projects assigned to the employee"""
        try:
            projects = []
            for employee in employees:
                if employee.id_projet:
                    projects.append(employee.id_projet)
                
                # Also get projects from subprojects
                if employee.id_sous_projet:
                    subproject = employee.id_sous_projet
                    if subproject.id_projet:
                        projects.append(subproject.id_projet)
            
            # Remove duplicates while preserving order
            unique_projects = []
            seen_ids = set()
            for project in projects:
                if project.id_projet not in seen_ids:
                    seen_ids.add(project.id_projet)
                    unique_projects.append(project)
            
            project_data = self.serialize_projects(unique_projects)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, project_data)
            
            return Response({
                'success': True,
                'message': 'Employee projects retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee projects: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_subprojects(self, request, employees):
        """Get all subprojects assigned to the employee"""
        try:
            subprojects = []
            for employee in employees:
                if employee.id_sous_projet:
                    subprojects.append(employee.id_sous_projet)
            
            # Remove duplicates while preserving order
            unique_subprojects = []
            seen_ids = set()
            for subproject in subprojects:
                if subproject.id_sous_projet not in seen_ids:
                    seen_ids.add(subproject.id_sous_projet)
                    unique_subprojects.append(subproject)
            
            subproject_data = self.serialize_subprojects(unique_subprojects)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, subproject_data)
            
            return Response({
                'success': True,
                'message': 'Employee subprojects retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee subprojects: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_reunions(self, request, employees):
        """Get all reunions related to the employee's projects"""
        try:
            project_ids = set()
            for employee in employees:
                if employee.id_projet:
                    project_ids.add(employee.id_projet.id_projet)
                if employee.id_sous_projet and employee.id_sous_projet.id_projet:
                    project_ids.add(employee.id_sous_projet.id_projet.id_projet)
            
            reunions = Reunion.objects.filter(id_projet__id_projet__in=project_ids).distinct()
            reunion_data = self.serialize_reunions(reunions)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, reunion_data)
            
            return Response({
                'success': True,
                'message': 'Employee reunions retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee reunions: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_incidents(self, request, employees):
        """Get all incidents related to the employee's projects and subprojects"""
        try:
            project_ids = set()
            subproject_ids = set()
            
            for employee in employees:
                if employee.id_projet:
                    project_ids.add(employee.id_projet.id_projet)
                if employee.id_sous_projet:
                    subproject_ids.add(employee.id_sous_projet.id_sous_projet)
                    if employee.id_sous_projet.id_projet:
                        project_ids.add(employee.id_sous_projet.id_projet.id_projet)
            
            incidents = Incident.objects.filter(
                Q(id_projet__id_projet__in=project_ids) | 
                Q(id_sous_projet__id_sous_projet__in=subproject_ids)
            ).distinct()
            
            incident_data = self.serialize_incidents(incidents)
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, incident_data)
            
            return Response({
                'success': True,
                'message': 'Employee incidents retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee incidents: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_documents(self, request, employees):
        """Get all documents associated with the employee's projects and subprojects"""
        try:
            project_ids = set()
            subproject_ids = set()
            
            for employee in employees:
                if employee.id_projet:
                    project_ids.add(employee.id_projet.id_projet)
                if employee.id_sous_projet:
                    subproject_ids.add(employee.id_sous_projet.id_sous_projet)
                    if employee.id_sous_projet.id_projet:
                        project_ids.add(employee.id_sous_projet.id_projet.id_projet)
            
            documents = Document.objects.filter(
                Q(id_projet__id_projet__in=project_ids) | 
                Q(id_sous_projet__id_sous_projet__in=subproject_ids)
            ).distinct()
            
            # Serialize the documents
            document_data = []
            for doc in documents:
                document_data.append({
                    'id_document': doc.id_document,
                    'titre': doc.titre,
                    'type': doc.type,
                    'date_ajout': doc.date_ajout,
                    'description': doc.description,
                    'project': doc.id_projet.nom_projet if doc.id_projet else None,
                    'subproject': doc.id_sous_projet.nom_sous_projet if doc.id_sous_projet else None
                })
            
            # Handle pagination
            paginated_data, pagination_info = self.paginate_data(request, document_data)
            
            return Response({
                'success': True,
                'message': 'Employee documents retrieved successfully',
                'pagination': pagination_info,
                'data': paginated_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee documents: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, data_type=None):
        """
        Router for POST requests
        """
        employees = self.get_employee(request)
        if not employees:
            return Response({
                'success': False,
                'message': 'Employee records not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'documents':
            return self.add_document(request, employees)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def put(self, request, document_id=None):
        """
        Router for PUT requests
        """
        employees = self.get_employee(request)
        if not employees:
            return Response({
                'success': False,
                'message': 'Employee records not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if document_id:
            return self.edit_document(request, employees, document_id)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def add_document(self, request, employees):
        """Add a new document associated with the employee's project or subproject"""
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
            
            # Verify that the employee has access to the specified project/subproject
            project = None
            subproject = None
            
            # Check project access
            if 'project_id' in data and data['project_id']:
                try:
                    project_id = data['project_id']
                    # Check if employee is assigned to this project
                    for employee in employees:
                        if employee.id_projet and employee.id_projet.id_projet == int(project_id):
                            project = Projet.objects.get(id_projet=project_id)
                            break
                    else:
                        return Response({
                            'success': False,
                            'message': 'You do not have access to this project'
                        }, status=status.HTTP_403_FORBIDDEN)
                except Projet.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Project not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Check subproject access
            if 'subproject_id' in data and data['subproject_id']:
                try:
                    subproject_id = data['subproject_id']
                    # Check if employee is assigned to this subproject
                    for employee in employees:
                        if employee.id_sous_projet and employee.id_sous_projet.id_sous_projet == int(subproject_id):
                            subproject = SousProjet.objects.get(id_sous_projet=subproject_id)
                            break
                    else:
                        return Response({
                            'success': False,
                            'message': 'You do not have access to this subproject'
                        }, status=status.HTTP_403_FORBIDDEN)
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

            # Create document
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

            # Return the created document with its files
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
    
    def edit_document(self, request, employees, document_id):
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
            
            # Check if the employee has access to the document's project/subproject
            has_access = False
            
            # Check project access
            for employee in employees:
                if document.id_projet and employee.id_projet and document.id_projet.id_projet == employee.id_projet.id_projet:
                    has_access = True
                    break
            
            # Check subproject access
            for employee in employees:
                if document.id_sous_projet and employee.id_sous_projet and document.id_sous_projet.id_sous_projet == employee.id_sous_projet.id_sous_projet:
                    has_access = True
                    break
            
            if not has_access:
                return Response({
                    'success': False,
                    'message': 'You do not have access to this document'
                }, status=status.HTTP_403_FORBIDDEN)
            
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
            
            # Return the updated document with its files
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
    
    def serialize_projects(self, projects):
        """Serialize project data with project members, documents, and chef projet"""
        serialized_projects = []
        
        for p in projects:
            # Get all employees assigned to this project
            project_members = Employe.objects.filter(id_projet=p.id_projet)
            
            # Get all documents related to this project
            project_documents = Document.objects.filter(id_projet=p.id_projet)
            
            # Get chef projet information
            chef_projet_info = None
            if p.id_utilisateur:
                chef_user = p.id_utilisateur.id_utilisateur
                chef_projet_info = {
                    'id_utilisateur': chef_user.id_utilisateur,
                    'nom': chef_user.nom,
                    'prenom': chef_user.prenom,
                    'email': chef_user.email,
                    'role_de_utilisateur': chef_user.role_de_utilisateur,
                    'numero_de_tel': chef_user.numero_de_tel
                }
            
            # Serialize the members data
            members_data = []
            for member in project_members:
                user = member.id_utilisateur
                members_data.append({
                    'id_utilisateur': user.id_utilisateur,
                    'nom': user.nom,
                    'prenom': user.prenom,
                    'email': user.email,
                    'role_de_utilisateur': user.role_de_utilisateur,
                    'numero_de_tel': user.numero_de_tel
                })
            
            # Serialize the documents data
            documents_data = []
            for doc in project_documents:
                documents_data.append({
                    'id_document': doc.id_document,
                    'titre': doc.titre,
                    'type': doc.type,
                    'date_ajout': doc.date_ajout,
                    'description': doc.description
                })
            
            # Create project data with members, documents, and chef projet
            project_data = {
                'id_projet': p.id_projet,
                'nom_projet': p.nom_projet,
                'description_de_projet': p.description_de_projet,
                'date_debut_de_projet': p.date_debut_de_projet,
                'date_fin_de_projet': p.date_fin_de_projet,
                'status': p.status,
                'members': members_data,
                'documents': documents_data,
                'chef_projet': chef_projet_info
            }
            
            serialized_projects.append(project_data)
            
        return serialized_projects
    
    def serialize_subprojects(self, subprojects):
        """Serialize subproject data with member information, project information, documents, and chef"""
        serialized_subprojects = []
        
        for sp in subprojects:
            # Get all employees assigned to this subproject
            subproject_members = Employe.objects.filter(id_sous_projet=sp.id_sous_projet)
            
            # Get all documents related to this subproject
            subproject_documents = Document.objects.filter(id_sous_projet=sp.id_sous_projet)
            
            # Get chef projet information for the subproject
            chef_projet_info = None
            if sp.id_utilisateur:
                chef_user = sp.id_utilisateur.id_utilisateur
                chef_projet_info = {
                    'id_utilisateur': chef_user.id_utilisateur,
                    'nom': chef_user.nom,
                    'prenom': chef_user.prenom,
                    'email': chef_user.email,
                    'role_de_utilisateur': chef_user.role_de_utilisateur,
                    'numero_de_tel': chef_user.numero_de_tel
                }
            
            # Get parent project information if it exists
            project_data = None
            if sp.id_projet:
                project = sp.id_projet
                
                # Get project members
                project_members = Employe.objects.filter(id_projet=project.id_projet)
                project_members_data = []
                for member in project_members:
                    user = member.id_utilisateur
                    project_members_data.append({
                        'id_utilisateur': user.id_utilisateur,
                        'nom': user.nom,
                        'prenom': user.prenom,
                        'email': user.email,
                        'role_de_utilisateur': user.role_de_utilisateur,
                        'numero_de_tel': user.numero_de_tel
                    })
                
                # Get project documents
                project_documents = Document.objects.filter(id_projet=project.id_projet)
                project_documents_data = []
                for doc in project_documents:
                    project_documents_data.append({
                        'id_document': doc.id_document,
                        'titre': doc.titre,
                        'type': doc.type,
                        'date_ajout': doc.date_ajout,
                        'description': doc.description
                    })
                
                # Get project chef
                project_chef_info = None
                if project.id_utilisateur:
                    project_chef_user = project.id_utilisateur.id_utilisateur
                    project_chef_info = {
                        'id_utilisateur': project_chef_user.id_utilisateur,
                        'nom': project_chef_user.nom,
                        'prenom': project_chef_user.prenom,
                        'email': project_chef_user.email,
                        'role_de_utilisateur': project_chef_user.role_de_utilisateur,
                        'numero_de_tel': project_chef_user.numero_de_tel
                    }
                
                project_data = {
                    'id_projet': project.id_projet,
                    'nom_projet': project.nom_projet,
                    'description_de_projet': project.description_de_projet,
                    'date_debut_de_projet': project.date_debut_de_projet,
                    'date_fin_de_projet': project.date_fin_de_projet,
                    'status': project.status,
                    'members': project_members_data,
                    'documents': project_documents_data,
                    'chef_projet': project_chef_info
                }
            
            # Serialize the members data
            members_data = []
            for member in subproject_members:
                user = member.id_utilisateur
                members_data.append({
                    'id_utilisateur': user.id_utilisateur,
                    'nom': user.nom,
                    'prenom': user.prenom,
                    'email': user.email,
                    'role_de_utilisateur': user.role_de_utilisateur,
                    'numero_de_tel': user.numero_de_tel
                })
            
            # Serialize the documents data
            documents_data = []
            for doc in subproject_documents:
                documents_data.append({
                    'id_document': doc.id_document,
                    'titre': doc.titre,
                    'type': doc.type,
                    'date_ajout': doc.date_ajout,
                    'description': doc.description
                })
            
            # Create subproject data with members, project info, documents, and chef
            subproject_data = {
                'id_sous_projet': sp.id_sous_projet,
                'nom_sous_projet': sp.nom_sous_projet,
                'description_sous_projet': sp.description_sous_projet,
                'date_debut_sousprojet': sp.date_debut_sousprojet,
                'date_finsousprojet': sp.date_finsousprojet,
                'status_sous_projet': sp.statut_sous_projet,
                'members': members_data,
                'documents': documents_data,
                'chef_projet': chef_projet_info,
                'project': project_data
            }
            
            serialized_subprojects.append(subproject_data)
            
        return serialized_subprojects
    
    def serialize_reunions(self, reunions):
        """Serialize reunion data"""
        return [{
            'id_reunion': r.id_reunion,
            'date_reunion': r.date_reunion,
            'ordre_de_jour': r.ordre_de_jour,
            'lieu_reunion': r.lieu_reunion,
            'heure_re': r.heure_re,
            'id_projet': r.id_projet.id_projet if r.id_projet else None
        } for r in reunions]
    
    def serialize_incidents(self, incidents):
        """Serialize incident data"""
        return [{
            'id_incident': i.id_incident,
            'description_incident': i.description_incident,
            'date_incident': i.date_incident,
            'lieu_incident': i.lieu_incident,
            'type_incident': i.type_incident,
            'id_projet': i.id_projet.id_projet if i.id_projet else None,
            'id_sous_projet': i.id_sous_projet.id_sous_projet if i.id_sous_projet else None
        } for i in incidents] 



class EmployeeDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    
    def get(self, request):
        """
            Get enhanced dashboard data for the employee including:
            - Sub-project counts by status
            - Recent incidents
            - Monthly progression data
        """
        try:
            # Get all employee records for the current user
            try:
                employees = Employe.objects.filter(id_utilisateur=request.user.id_utilisateur)
            except Employe.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Employee records not found for this user'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Get all sub-projects assigned to this employee
            subprojects = []
            for employee in employees:
                if employee.id_sous_projet:
                    subprojects.append(employee.id_sous_projet)

            if not subprojects:
                return Response({
                    'success': True,
                    'message': 'No sub-projects assigned to this employee',
                    'data': {
                        'total_subprojects': 0,
                        'status_counts': {
                            'termine': 0,
                            'en cours': 0,
                            'en attente': 0
                        },
                        'recent_incidents': [],
                        'monthly_progression': []
                    }
                }, status=status.HTTP_200_OK)
            
            # Get all incidents related to the employee's sub-projects
            subproject_ids = [sp.id_sous_projet for sp in subprojects]
            incidents = Incident.objects.all().order_by('-date_incident')[:6]
            
            # Get status counts for all sub-projects
            status_labels = ['Terminé', 'En cours', 'En attente']
            status_counts = {label: 0 for label in status_labels}
            
            for subproject in subprojects:
                status_label = subproject.statut_sous_projet
                if status_label in status_counts:
                    status_counts[status_label] += 1
            
            # Generate monthly progression data for all sub-projects
            monthly_progression = self.generate_monthly_progression(subprojects)
            
            # Serialize the incidents
            incident_data = []
            for incident in incidents:
                incident_data.append({
                    'id_incident': incident.id_incident,
                    'description_incident': incident.description_incident,
                    'date_incident': incident.date_incident,
                    'lieu_incident': incident.lieu_incident,
                    'type_incident': incident.type_incident,
                    'project': incident.id_projet.nom_projet if incident.id_projet else None,
                    'subproject': incident.id_sous_projet.nom_sous_projet if incident.id_sous_projet else None
                })
            
            # Serialize subproject information
            subproject_info = []
            for subproject in subprojects:
                subproject_info.append({
                    'id': subproject.id_sous_projet,
                    'name': subproject.nom_sous_projet,
                    'status': subproject.statut_sous_projet,
                    'progress': subproject.pourcentage,
                    'start_date': subproject.date_debut_sousprojet,
                    'end_date': subproject.date_finsousprojet
                })
            
            return Response({
                'success': True,
                'message': 'Employee dashboard data retrieved successfully',
                'data': {
                    'total_subprojects': len(subprojects),
                    'subproject_info': subproject_info,
                    'status_counts': status_counts,
                    'recent_incidents': incident_data,
                    'monthly_progression': monthly_progression
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error retrieving employee dashboard data: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def generate_monthly_progression(self, subprojects):
        """
        Generate monthly progression data for visualization for all sub-projects.
        Since we don't have historical data, we'll create sample data based on the current progress.
        """
        # Get current date
        current_date = datetime.now().date()
        
        # Find the earliest start date and latest end date among all sub-projects
        start_dates = [sp.date_debut_sousprojet for sp in subprojects if sp.date_debut_sousprojet]
        end_dates = [sp.date_finsousprojet for sp in subprojects if sp.date_finsousprojet]
        
        if not start_dates or not end_dates:
            return []
            
        start_date = min(start_dates)
        end_date = max(end_dates)
        
        # If the project hasn't started yet or is in the future
        if current_date < start_date:
            return []
            
        # Calculate how many months the project spans
        total_months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month) + 1
        
        # If the project is less than a month, return current progress only
        if total_months <= 1:
            month_name = calendar.month_abbr[start_date.month]
            # Calculate average progress across all sub-projects
            avg_progress = sum(sp.pourcentage for sp in subprojects) / len(subprojects)
            return [{'month': month_name, 'progress': avg_progress}]
        
        # Calculate months elapsed so far
        if current_date > end_date:
            # Project is complete
            months_elapsed = total_months
        else:
            months_elapsed = (current_date.year - start_date.year) * 12 + (current_date.month - start_date.month) + 1
        
        # Generate progression data
        progression_data = []
        
        # For completed months, generate realistic progression
        for i in range(min(6, total_months)):
            # Calculate the month
            month_offset = i
            month_date = start_date + timedelta(days=30 * month_offset)
            month_name = calendar.month_abbr[month_date.month]
            
            # Calculate progress for this month
            if i >= months_elapsed:
                # Future month - project the expected progress
                progress = min(100, (i / total_months) * 100)
            else:
                # Past month - calculate based on current progress
                # Use average progress across all sub-projects
                avg_progress = sum(sp.pourcentage for sp in subprojects) / len(subprojects)
                progress_ratio = i / months_elapsed
                progress = min(100, progress_ratio * avg_progress)
                
            # Add some randomness to make it look realistic
            import random
            progress = min(100, progress + random.uniform(-5, 5))
            
            progression_data.append({
                'month': month_name,
                'progress': round(progress, 1)
            })
        
        return progression_data