from rest_framework import serializers
from ..models import Projet, Ap

class ProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = [
            'id_projet',
            'nom_projet',
            'description_de_projet',
            'date_debut_de_projet',
            'date_fin_de_projet',
            'statut',
            'id_budget',
            'wilaya'
        ]
        read_only_fields = ['id_projet']

    def validate(self, data):
        if data['date_debut_de_projet'] > data['date_fin_de_projet']:
            raise serializers.ValidationError("La date de fin doit être postérieure à la date de début")
        return data 
