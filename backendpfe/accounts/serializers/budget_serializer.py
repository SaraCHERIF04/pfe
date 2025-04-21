from rest_framework import serializers
from ..models import Budget, Devises

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            'id_budget',
            'montant',
            'code_devise',
            'date_creation'
        ]
        read_only_fields = ['id_budget', 'date_creation']

    def validate(self, data):
        # Ensure montant is positive
        if data.get('montant') and data['montant'] <= 0:
            raise serializers.ValidationError("Le montant doit être positif")
        return data

    def create(self, validated_data):
        # Set the current date when creating a new budget
        from datetime import datetime
        validated_data['date_creation'] = datetime.now()
        return super().create(validated_data) 