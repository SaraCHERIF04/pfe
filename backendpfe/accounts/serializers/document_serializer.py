from rest_framework import serializers
from ..models import Document, DocumentFile
from datetime import datetime

class DocumentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentFile
        fields = ['id_file', 'chemin']
        read_only_fields = ['id_file']

class DocumentSerializer(serializers.ModelSerializer):
    files = DocumentFileSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            'id_document',
            'titre',
            'type',
            'date_ajout',
            'description',
            'id_projet',
            'id_sous_projet',
            'files'
        ]
        read_only_fields = ['id_document']
        extra_kwargs = {
            'date_ajout': {
                'default': datetime.now().date,
                'required': False
            }
        }

    def create(self, validated_data):
        files_data = self.context.get('files_data', [])
        document = Document.objects.create(**validated_data)
        
        for file_data in files_data:
            DocumentFile.objects.create(id_document=document, **file_data)
            
        return document 