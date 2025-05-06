from rest_framework import serializers
from ..models import Reunion

class ReunionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reunion
        fields = [
            'id_reunion',
            'date_reunion',
            'id_utilisateur',
            'id_projet',
            'heure_re',
            'ordre_de_jour',
            'numpv_reunion',
            'lieu_reunion'  
            
        ]
        read_only_fields = ['id_reunion']

    def validate(self, data):
        # Ensure date_reunion is not in the past
        from datetime import date
        if data.get('date_reunion') and data['date_reunion'] < date.today():
            raise serializers.ValidationError("La date de réunion ne peut pas être dans le passé")
        return data 