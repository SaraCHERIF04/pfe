from rest_framework import serializers
from ..models import Incident, Projet, SousProjet

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = [
            'id_incident',
            'description_incident',
            'id_projet',
            'id_suivie_incident',
            'id_sous_projet'
        ]
        read_only_fields = ['id_incident']

    def validate(self, data):
        # Ensure at least one of id_projet or id_sous_projet is provided
        if not data.get('id_projet') and not data.get('id_sous_projet'):
            raise serializers.ValidationError("Au moins un projet ou sous-projet doit être spécifié")
        return data 