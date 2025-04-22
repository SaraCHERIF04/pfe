from rest_framework import serializers
from ..models import Ap
from datetime import datetime

class ApSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ap
        fields = [
            'id_ap', 
            'montant_ap', 
            'id_projet'
        ]
        read_only_fields = ['id_ap']  # Le champ id_ap est auto-généré et doit être en lecture seule

    def validate(self, data):
        # Vérifier que le montant est positif, comme dans le BudgetSerializer
        if data.get('montant_ap') and data['montant_ap'] <= 0:
            raise serializers.ValidationError("Le montant doit être positif")
        return data

    def create(self, validated_data):
        # Comme dans BudgetSerializer, définir la date de création à la création d'un AP
        validated_data['date_creation'] = datetime.now()  # Si tu veux ajouter un champ date_creation dans le modèle Ap

        # Création de l'AP comme prévu
        return super().create(validated_data)