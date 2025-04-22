from rest_framework import serializers
from ..models import Utilisateur
from django.contrib.auth.hashers import make_password

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'email', 'first_name', 'last_name', 'role_de_utilisateur', 'password']

    def create(self, validated_data):
        # Hash password before saving it to the database
        password = validated_data.pop('password', None)
        if password:
            validated_data['password'] = make_password(password)
        user = super().create(validated_data)
        return user

    def update(self, instance, validated_data):
        # Update password if provided
        password = validated_data.pop('password', None)
        if password:
            validated_data['password'] = make_password(password)
        return super().update(instance, validated_data)
