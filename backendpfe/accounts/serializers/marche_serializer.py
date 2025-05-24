from rest_framework import serializers
from ..models import Marche

class MarcheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marche
        fields = [
            'id_marche',
            'date_marche',
            'description_marche',
            'id_projet',
            'numero_marche',
            'numero_appel_dof',
            'visa_cme',
            'date_visa_cme',
            'prix_da',
            'prix_devise',
            'type',
            'id_md',
            'date_notification'
        ] 