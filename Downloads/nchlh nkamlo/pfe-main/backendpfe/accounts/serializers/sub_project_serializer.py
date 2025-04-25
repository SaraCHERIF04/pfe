from rest_framework import serializers
from ..models import SousProjet

class SousProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousProjet
        fields = '__all__'  