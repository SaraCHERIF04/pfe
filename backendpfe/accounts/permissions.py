from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'admin'


class IsChefDeProjet(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'chef de projet'


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'employee'
