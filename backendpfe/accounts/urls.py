from django.urls import path
from .views import (
    ProjectView,
    DocumentView,
    IncidentView,
    MeetingView,
    ApView,  # Remplacement de BudgetView par ApView
    SubProjectView,
    FactureView,
    UserView,
    EmployerView
)
from .views.auth_views import AuthView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.password_setup_view import PasswordSetupView

urlpatterns = [
    # sign in
    path('auth/', AuthView.as_view(), name='auth'),

    # User URLs
    path('users', UserView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserView.as_view(), name='user-detail'),

    # Project URLs
    path('projets/', ProjectView.as_view(), name='project_list'),
    path('projets/<int:pk>', ProjectView.as_view(), name='project_detail'),

    # Sub-Project URLs
    path('sous-projets/', SubProjectView.as_view(), name='sub_project_list'),
    path('sous-projets/<int:pk>', SubProjectView.as_view(), name='sub_project_detail'),
    path('sous-projets/projet/<int:projet_id>/', SubProjectView.as_view(), name='sub_project_by_project'),

    # Document URLs
    path('document/', DocumentView.as_view(), name='document_list'),
    path('document/<int:pk>/', DocumentView.as_view(), name='document_detail'),

    # Incident URLs
    path('incident/', IncidentView.as_view(), name='incident_list'),
    path('incident/<int:pk>/', IncidentView.as_view(), name='incident_detail'),

    # Meeting URLs
    path('reunion/', MeetingView.as_view(), name='meeting_list'),
    path('reunion/<int:pk>/', MeetingView.as_view(), name='meeting_detail'),

    # AP URLs (remplace les anciennes URLs de Budget par celles de AP)
    path('ap/', ApView.as_view(), name='ap_list'),  # Liste des AP
    path('ap/<int:pk>/', ApView.as_view(), name='ap_detail'),  # Détail d'un AP

    
    # Facture URLs
    path('facture/', FactureView.as_view(), name='facture_list'),  # Liste des factures
    path('facture/<int:pk>/', FactureView.as_view(), name='facture_detail'),  # Détail d'une facture
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
    
    # sign up
    # path('accounts/create/', create_account, name='create_account'),
    # path('projects/create/', CreateProjectView.as_view(), name='create_project'),
    path('set-password/', PasswordSetupView.as_view(), name='set-password'),
]
