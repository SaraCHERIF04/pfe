from rest_framework import serializers
from .models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id_utilisateur', 'nom', 'email', 'role_de_utilisateur', 'numero_de_tel', 'created_at']
        read_only_fields = ['id_utilisateur', 'created_at']
