from django.urls import path
from .views.auth_views import AuthView
from .views.sub_project_view import SubProjectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    #sign in
    path('auth/', AuthView.as_view(), name='auth'),
    path('sub-project', SubProjectView.as_view(), name='project_view'),


    #sous projets
    path('sous-projet/', SubProjectView.as_view(), name='sous_projet_list'),
    path('sous-projet/<int:pk>/', SubProjectView.as_view(), name='sous_projet_detail'),
    path('sous-projet/projet/<int:projet_id>/', SubProjectView.as_view(), name='sous_projet_by_project'),

    #sign up
    # path('accounts/create/', create_account, name='create_account'),
    # path('projects/create/', CreateProjectView.as_view(), name='create_project'),
]
