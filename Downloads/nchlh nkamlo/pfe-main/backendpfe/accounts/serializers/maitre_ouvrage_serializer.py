# serializers/maitre_ouvrage_serializer.py

from rest_framework import serializers
from ..models import MaitreOuvrage

class MaitreOuvrageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaitreOuvrage
        fields = '__all__'
