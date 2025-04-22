from django.urls import path
from .views import (
    ProjectView,
    DocumentView,
    IncidentView,
    MeetingView,
    BudgetView,
    SubProjectView
)
from .views.auth_views import AuthView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    #sign in
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

    # Budget URLs
    path('budget/', BudgetView.as_view(), name='budget_list'),
    path('budget/<int:pk>/', BudgetView.as_view(), name='budget_detail'),
    # Maitre d'Ouvrage endpoints
    path('maitre-ouvrage/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_list'),
   path('maitre-ouvrage/<int:pk>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_detail'),
     path('maitre-ouvrage/projet/<int:projet_id>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_by_project'),
    # Retrieve all, by project, or a single maitre d'oeuvre
    path('maitre-doeuvre/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-list'),
    path('maitre-doeuvre/<int:pk>/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-detail'),
    path('maitre-doeuvre/projet/<int:projet_id>/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-by-project'),

    #sign up
    # path('accounts/create/', create_account, name='create_account'),
    # path('projects/create/', CreateProjectView.as_view(), name='create_project'),
]
