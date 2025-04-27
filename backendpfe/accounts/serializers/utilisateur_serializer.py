from rest_framework import serializers
from ..models import Utilisateur
from django.contrib.auth.hashers import make_password

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id_utilisateur',
            'nom',
            'email',
            'mot_de_passe',
            'role_de_utilisateur',
            'numero_de_tel',
            'created_at',
            'prenom',
            'sexe',
            'etat',
            'matricule',
            'fcm_token'
        ]
        read_only_fields = ['id_utilisateur', 'created_at']

    def create(self, validated_data):
        # Hash password before saving it to the database
        password = validated_data.pop('mot_de_passe', None)
        if password:
            validated_data['mot_de_passe'] = make_password(password)
        user = super().create(validated_data)
        return user

    def update(self, instance, validated_data):
        # Update password if provided
        password = validated_data.pop('mot_de_passe', None)
        if password:
            validated_data['mot_de_passe'] = make_password(password)
        return super().update(instance, validated_data)
