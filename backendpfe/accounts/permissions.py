from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'admin'


class IsChefDeProjet(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'chef'


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'employee'
    
class IsFinancier(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'financier'

class IsDirecteur(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'directeur'

class IsOwnerOrAdmin(BasePermission):#AYA
    """
    Permission qui permet à un utilisateur de modifier son propre profil
    ou à un administrateur de modifier n'importe quel profil.
    """
    def has_permission(self, request, view):
        # Vérifier si l'utilisateur est authentifié
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Permettre à l'administrateur de tout faire
        if hasattr(request.user, 'role_de_utilisateur') and request.user.role_de_utilisateur == 'admin':
            return True
        
        # Permettre à l'utilisateur de modifier son propre profil
        return obj.id_utilisateur == request.user.id_utilisateur    
