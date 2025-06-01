from rest_framework import serializers
from ..models import Incident
from .project_serializer import ProjetSerializer
from .sub_project_serializer import SousProjetSerializer
from .utilisateur_serializer import UtilisateurSerializer

class IncidentSerializer(serializers.ModelSerializer):
    # Nested serializers for related data (read-only)
    projet_details = ProjetSerializer(source='id_projet', read_only=True)
    sous_projet_details = SousProjetSerializer(source='id_sous_projet', read_only=True)
    
    class Meta:
        model = Incident
        fields = [
            'id_incident',
            'description_incident',
            'id_projet',
            'id_sous_projet',
            'date_incident',
            'lieu_incident',
            
            'lheure_incident',
            'type_incident',
            # Nested fields
            'projet_details',
            'sous_projet_details',
            'signale_par',
        ]
        read_only_fields = ['id_incident']

    def validate(self, data):
        # Ensure at least one of id_projet or id_sous_projet is provided
        if not data.get('id_projet') and not data.get('id_sous_projet'):
            raise serializers.ValidationError("Au moins un projet ou sous-projet doit être spécifié")
        return data

    def to_representation(self, instance):
        """
        Override to customize the output representation
        """
        data = super().to_representation(instance)
        
        # Remove nested details if the related object doesn't exist
        if not instance.id_projet:
            data.pop('projet_details', None)
        if not instance.id_sous_projet:
            data.pop('sous_projet_details', None)
            
        return data