from rest_framework import serializers
from ..models import MaitreDoeuve

class MaitreDoeuvreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaitreDoeuve
        fields = '__all__'  # You can adjust this to include only the fields you want
