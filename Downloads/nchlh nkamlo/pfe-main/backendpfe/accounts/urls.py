from django.urls import path
from .views.auth_views import AuthView
from .views.sub_project_view import SubProjectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.project_view import ProjectView 
from .views.maitre_ouvrage_view import MaitreOuvrageView
from .views.maitre_doeuvre_view import MaitreDoeuvreView

urlpatterns = [
    #sign in
    path('auth/', AuthView.as_view(), name='auth'),
    path('sub-project', SubProjectView.as_view(), name='project_view'),

     path('projects/', ProjectView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectView.as_view(), name='project-detail'),
    #sous projets
    path('sous-projet/', SubProjectView.as_view(), name='sous_projet_list'),
    path('sous-projet/<int:pk>/', SubProjectView.as_view(), name='sous_projet_detail'),
    path('sous-projet/projet/<int:projet_id>/', SubProjectView.as_view(), name='sous_projet_by_project'),
    # Maitre d'Ouvrage endpoints
    path('maitre-ouvrage/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_list'),
   path('maitre-ouvrage/<int:pk>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_detail'),
     path('maitre-ouvrage/projet/<int:projet_id>/', MaitreOuvrageView.as_view(), name='maitre_ouvrage_by_project'),
    # Retrieve all, by project, or a single maitre d'oeuvre
    path('maitre-doeuvre/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-list'),
    path('maitre-doeuvre/<int:pk>/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-detail'),
    path('maitre-doeuvre/projet/<int:projet_id>/', MaitreDoeuvreView.as_view(), name='maitre-doeuvre-by-project'),
]