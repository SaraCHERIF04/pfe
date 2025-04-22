from django.urls import path
from .views import (
    ProjectView,
    DocumentView,
    IncidentView,
    MeetingView,
    ApView,  # Remplacement de BudgetView par ApView
    SubProjectView,
    FactureView
)
from .views.auth_views import AuthView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # sign in
    path('auth/', AuthView.as_view(), name='auth'),

    # Project URLs
    path('projet/', ProjectView.as_view(), name='project_list'),
    path('projet/<int:pk>/', ProjectView.as_view(), name='project_detail'),

    # Sub-Project URLs
    path('sous-projet/', SubProjectView.as_view(), name='sub_project_list'),
    path('sous-projet/<int:pk>/', SubProjectView.as_view(), name='sub_project_detail'),
    path('sous-projet/projet/<int:projet_id>/', SubProjectView.as_view(), name='sub_project_by_project'),

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
path('facture/projet/<int:projet_id>/', FactureView.as_view(), name='facture_by_project'),  # Factures par projet
path('facture/sous-projet/<int:sous_projet_id>/', FactureView.as_view(), name='facture_by_sub_project'),  # Factures par sous-projet
    # sign up
    # path('accounts/create/', create_account, name='create_account'),
    # path('projects/create/', CreateProjectView.as_view(), name='create_project'),
]