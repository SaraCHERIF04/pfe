from rest_framework import serializers
from ..models import Document, Projet

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'id_document',
            'nom_document',
            'type_document',
            'date_ajout',
            'rapport',
            'id_projet'
        ]
        read_only_fields = ['id_document', 'date_ajout']

    def create(self, validated_data):
        # Set the current date when creating a new document
        from datetime import date
        validated_data['date_ajout'] = date.today()
        return super().create(validated_data) 