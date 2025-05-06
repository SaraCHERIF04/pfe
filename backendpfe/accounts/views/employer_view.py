from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from ..models import Employe, Projet, SousProjet, Reunion, Incident, Utilisateur, Document, DocumentFile
from ..permissions import IsEmployee
from rest_framework.pagination import PageNumberPagination
from datetime import datetime
import os
from django.conf import settings
import uuid


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EmployerView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    pagination_class = CustomPagination
    
    def get_employee(self, request):
        """Get the employee record for the current user"""
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
        Main router for the employer view
        """
        employee = self.get_employee(request)
        if not employee:
            return Response({
                'success': False,
                'message': 'Employee record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'projects':
            return self.get_projects(request, employee)
        elif data_type == 'subprojects':
            return self.get_subprojects(request, employee)
        elif data_type == 'reunions':
            return self.get_reunions(request, employee)
        elif data_type == 'incidents':
            return self.get_incidents(request, employee)
        elif data_type == 'documents':
            return self.get_documents(request, employee)
        else:
            return self.get_dashboard(request, employee)
    
    def get_dashboard(self, request, employee):
        """
        Get all projects, subprojects, reunions, and incidents associated with the logged-in employee.
        """
        try:
            # Get projects and subprojects associated with this employee
            projects = []
            subprojects = []
            
            if employee.id_projet:
                projects = [employee.id_projet]
            if employee.id_sous_projet:
                subprojects = [employee.id_sous_projet]
                
            # If no projects or subprojects are assigned to the employee
            if not projects and not subprojects:
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
            reunions = []
            if projects:
                project_ids = [p.id_projet for p in projects]
                reunions = Reunion.objects.filter(id_projet__in=project_ids).distinct()
            
            # Get all incidents related to the employee's projects/subprojects
            incidents = []
            if projects or subprojects:
                q_objects = Q()
                if projects:
                    project_ids = [p.id_projet for p in projects]
                    q_objects |= Q(id_projet__in=project_ids)
                if subprojects:
                    subproject_ids = [sp.id_sous_projet for sp in subprojects]
                    q_objects |= Q(id_sous_projet__in=subproject_ids)
                incidents = Incident.objects.filter(q_objects).distinct()
            
            # Serialize the data
            project_data = self.serialize_projects(projects)
            subproject_data = self.serialize_subprojects(subprojects)
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
    
    def get_projects(self, request, employee):
        """Get projects assigned to the employee"""
        try:
            projects = []
            if employee.id_projet:
                projects = [employee.id_projet]
            
            # Convert to list before pagination if it's not already a queryset
            if not isinstance(projects, list):
                projects = list(projects)
                
            project_data = self.serialize_projects(projects)
            
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
    
    def get_subprojects(self, request, employee):
        """Get subprojects assigned to the employee"""
        try:
            subprojects = []
            if employee.id_sous_projet:
                subprojects = [employee.id_sous_projet]
            
            subproject_data = self.serialize_subprojects(subprojects)
            
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
    
    def get_reunions(self, request, employee):
        """Get reunions related to the employee's projects"""
        try:
            projects = []
            if employee.id_projet:
                projects = [employee.id_projet]
            
            reunions = []
            if projects:
                project_ids = [p.id_projet for p in projects]
                reunions = Reunion.objects.filter(id_projet__in=project_ids)    .distinct()
            
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
    
    def get_incidents(self, request, employee):
        """Get incidents related to the employee's projects and subprojects"""
        try:
            projects = []
            subprojects = []
            
            if employee.id_projet:
                projects = [employee.id_projet]
            if employee.id_sous_projet:
                subprojects = [employee.id_sous_projet]
            
            incidents = []
            if projects or subprojects:
                q_objects = Q()
                if projects:
                    project_ids = [p.id_projet for p in projects]
                    q_objects |= Q(id_projet__in=project_ids)
                if subprojects:
                    subproject_ids = [sp.id_sous_projet for sp in subprojects]
                    q_objects |= Q(id_sous_projet__in=subproject_ids)
                incidents = Incident.objects.filter(q_objects).distinct()
            
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
    
    def get_documents(self, request, employee):
        """Get all documents associated with the employee's projects and subprojects"""
        try:
            # Get projects and subprojects associated with this employee
            projects = []
            subprojects = []
            
            if employee.id_projet:
                projects = [employee.id_projet]
            if employee.id_sous_projet:
                subprojects = [employee.id_sous_projet]
                
            # If no projects or subprojects are assigned to the employee
            if not projects and not subprojects:
                return Response({
                    'success': True,
                    'message': 'No projects or subprojects assigned to this employee, thus no documents available',
                    'data': []
                }, status=status.HTTP_200_OK)
            
            # Get all documents related to the employee's projects/subprojects
            documents = []
            
            # Build query conditions
            q_objects = Q()
            if projects:
                project_ids = [p.id_projet for p in projects]
                q_objects |= Q(id_projet__in=project_ids)
            if subprojects:
                subproject_ids = [sp.id_sous_projet for sp in subprojects]
                q_objects |= Q(id_sous_projet__in=subproject_ids)
                
            # Query documents
            documents = Document.objects.filter(q_objects).distinct()
            
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
        employee = self.get_employee(request)
        if not employee:
            return Response({
                'success': False,
                'message': 'Employee record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if data_type == 'documents':
            return self.add_document(request, employee)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def put(self, request, document_id=None):
        """
        Router for PUT requests
        """
        employee = self.get_employee(request)
        if not employee:
            return Response({
                'success': False,
                'message': 'Employee record not found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
            
        if document_id:
            return self.edit_document(request, employee, document_id)
        else:
            return Response({
                'success': False,
                'message': 'Invalid endpoint'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def add_document(self, request, employee):
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
                    if employee.id_projet and employee.id_projet.id_projet == int(project_id):
                        project = Projet.objects.get(id_projet=project_id)
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
                    if employee.id_sous_projet and employee.id_sous_projet.id_sous_projet == int(subproject_id):
                        subproject = SousProjet.objects.get(id_sous_projet=subproject_id)
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
    
    def edit_document(self, request, employee, document_id):
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
            if document.id_projet and employee.id_projet and document.id_projet.id_projet == employee.id_projet.id_projet:
                has_access = True
                
            # Check subproject access
            if document.id_sous_projet and employee.id_sous_projet and document.id_sous_projet.id_sous_projet == employee.id_sous_projet.id_sous_projet:
                has_access = True
                
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