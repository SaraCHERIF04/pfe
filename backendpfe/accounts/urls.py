from django.urls import path
from .views import (
    ProjectView,
    DocumentView,
    IncidentView,
    MeetingView,
    # ApView,  # Remplacement de BudgetView par ApView
    SubProjectView,
    FactureView,
    UserView,
    EmployerView,
    FinancierView,
    MarcheView,
    MaitreOuvrageView,
    ResponsableDashboardView
)

from .views.auth_views import AuthView
from .views.maitre_doeuvre_view import MaitreDoeuvreView  
from .views.employer_view import EmployeeDashboardView
from .views.chef_view import ChefView, ChefDashboardView, ChefProjectDetailView
from .views.user_view import ProfileView, ProfilePasswordView  # Ajout des nouvelles vues
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.password_setup_view import PasswordSetupView
from .views.auth_views import AuthView, ChangePasswordView


urlpatterns = [
    # dashboards
    path('dashboard/financier', FinancierView.as_view(), name='financier-dashboard'),

        # Profile URLs - NOUVEAUX ENDPOINTS
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update-password/', ProfilePasswordView.as_view(), name='profile-update-password'),

    # Marche URLs
    path('marches', MarcheView.as_view(), name='marche_list'),
    path('marches/<int:pk>', MarcheView.as_view(), name='marche_detail'),

    # pourchanger le mot de passe 
    path('set-password/', PasswordSetupView.as_view(), name='set-password'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # sign in
    path('auth/', AuthView.as_view(), name='auth'),
    
    # User URLs
    path('users', UserView.as_view(), name='user-list'),
    path('users/<int:pk>', UserView.as_view(), name='user-detail'),

    # Project URLs
    path('projets', ProjectView.as_view(), name='project_list'),
    path('projets/<int:pk>', ProjectView.as_view(), name='project_detail'),

    # Sub-Project URLs
    path('sous-projets', SubProjectView.as_view(), name='sub_project_list'),
    path('sous-projets/<int:pk>', SubProjectView.as_view(), name='sub_project_detail'),
    path('sous-projets/projet/<int:projet_id>', SubProjectView.as_view(), name='sub_project_by_project'),

    # Document URLs
    path('documents/ajout', DocumentView.as_view(), name='document_list'),
    path('documents', DocumentView.as_view(), name='document_list'),
    path('documents/<int:pk>', DocumentView.as_view(), name='document_detail'),
    # path('api/documents/download/<int:file_id>/', DocumentView.as_view({'get': 'download_file'}), name='document-file-download'),
    path('documents/<int:id_document>/download_all/', DocumentView.as_view(), name='document-download-all'),

    # Incident URLs
    path('incident/ajout', IncidentView.as_view(), name='incident_ajout'),
    path('incidents', IncidentView.as_view(), name='incident_list'),
    path('incidents/<int:pk>/', IncidentView.as_view(), name='incident_detail'),

    # Meeting URLs
    path('reunions', MeetingView.as_view(), name='meeting_list'),
    path('reunions/<int:pk>', MeetingView.as_view(), name='meeting_detail'),

    # AP URLs (remplace les anciennes URLs de Budget par celles de AP)
    # path('ap/', ApView.as_view(), name='ap_list'),  # Liste des AP
    # path('ap/<int:pk>/', ApView.as_view(), name='ap_detail'),  # Détail d'un AP

    
    # Facture URLs
    path('factures', FactureView.as_view(), name='facture_list'),  # Liste des factures
    path('financier/factures', FactureView.as_view(), name='facture_list'),  # Liste des factures
    path('factures/<int:pk>', FactureView.as_view(), name='facture_detail'),  # Détail d'une facture
    path('facture/projet/<int:projet_id>/', FactureView.as_view(), name='facture_by_project'),
    path('facture/sous-projet/<int:sous_projet_id>/', FactureView.as_view(), name='facture_by_sub_project'),  # Factures par sous-projet
    
    # Employer URLs
    path('employee/dashboard', EmployerView.as_view(), name='employer_dashboard'),
    path('employee/projets', EmployerView.as_view(), {'data_type': 'projects'}, name='employer_projects'),
    path('employee/sous-projets', EmployerView.as_view(), {'data_type': 'subprojects'}, name='employer_subprojects'),
    path('employee/reunions', EmployerView.as_view(), {'data_type': 'reunions'}, name='employer_reunions'),
    path('employee/incidents', EmployerView.as_view(), {'data_type': 'incidents'}, name='employer_incidents'),
    path('employee/documents', EmployerView.as_view(), {'data_type': 'documents'}, name='employer_documents'),
    path('employee/documents/<int:document_id>', EmployerView.as_view(), name='employer_document_edit'),
    
    # Financier URLs
    path('financier/projets', FinancierView.as_view(), name='financier-projects'),
    path('financier/sous-projets/', FinancierView.as_view(), name='financier-subprojects'),
    path('financier/reunions/', FinancierView.as_view(), name='financier-reunions'),
    path('financier/documents/', FinancierView.as_view(), name='financier-documents'),
    path('financier/factures/', FinancierView.as_view(), name='financier-factures'),
    path('financier/documents/add/', FinancierView.as_view(), name='financier-add-document'),
    path('financier/factures/add/', FinancierView.as_view(), name='financier-add-facture'),
    path('financier/documents/<int:id>/edit/', FinancierView.as_view(), name='financier-edit-document'),
    path('financier/factures/<int:id>/edit/', FinancierView.as_view(), name='financier-edit-facture'),


    # Chef URLs
    # path('chef/dashboard', ChefView.as_view(), name='chef_dashboard'),
    path('chef/projets', ChefView.as_view(), {'data_type': 'projects'}, name='chef_projects'),
    path('chef/sous-projets', ChefView.as_view(), {'data_type': 'subprojects'}, name='chef_subprojects'),
    path('chef/reunions', ChefView.as_view(), {'data_type': 'reunions'}, name='chef_reunions'),
    path('chef/incidents', ChefView.as_view(), {'data_type': 'incidents'}, name='chef_incidents'),
    path('chef/documents', ChefView.as_view(), {'data_type': 'documents'}, name='chef_documents'),
    path('chef/documents/add', ChefView.as_view(), {'data_type': 'documents'}, name='chef_add_document'),
    path('chef/documents/<int:document_id>', ChefView.as_view(), name='chef_document_edit'),
    path('chef/dashboard/', ChefDashboardView.as_view(), name='chef-dashboard'),
    path('chef/project/<int:project_id>/', ChefProjectDetailView.as_view(), name='chef-project-detail'),
    path('responsable/dashboard/', ResponsableDashboardView.as_view(), name='responsable-dashboard'),
    path('employee/dashboard/', EmployeeDashboardView.as_view(), name='employee-enhanced-dashboard'),

    # Maitre d'Ouvrage URLs
    path('chef/maitre-ouvrage', MaitreOuvrageView.as_view(), name='maitre_ouvrage_list'),
    path('maitre-ouvrage', MaitreOuvrageView.as_view(), name='maitre_ouvrage_list'),
    path('chef/maitre-ouvrage/<int:pk>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_detail'),
    path('maitre-ouvrage/<int:pk>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_detail'),
    path('maitre-ouvrage/projet/<int:projet_id>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_by_project'),
    path('maitre-ouvrage/sous-projet/<int:sous_projet_id>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_by_sub_project'),

    path('maitre-doeuvre/', MaitreDoeuvreView.as_view(), name='maitre_doeuvre_list'),
    # path('maitre-doeuvre/<int:pk>/', MaitreDoeuvreView.as_view(), name='maitre_doeuvre_detail'),
    # path('maitre-doeuvre/projet/<int:projet_id>/', MaitreDoeuvreView.as_view(), name='maitre_doeuvre_by_project'),
    # sign up
    # path('accounts/create/', create_account, name='create_account'),
    # path('projects/create/', CreateProjectView.as_view(), name='create_project'),
    #directeur
    path('directeur/incidents', ResponsableDashboardView.as_view(), {'data_type': 'incidents'}, name='responsable_incidents'),

    path('set-password', PasswordSetupView.as_view(), name='set-password'),
]
