from django.urls import path
from .views import login_view, create_account, CreateProjectView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('accounts/create/', create_account, name='create_account'),
    path('projects/create/', CreateProjectView.as_view(), name='create_project'),
]
