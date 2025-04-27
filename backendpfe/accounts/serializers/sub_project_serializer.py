from rest_framework import serializers
from ..models import SousProjet, Projet, Utilisateur, Document, Employe
from .project_serializer import UtilisateurSerializer, DocumentSerializer

class ProjetSimpleSerializer(serializers.ModelSerializer):
    chef_projet = serializers.SerializerMethodField()
    
    class Meta:
        model = Projet
        fields = [
            'id_projet',
            'nom_projet',
            'description_de_projet',
            'date_debut_de_projet',
            'date_fin_de_projet',
            'status',
            'chef_projet'
        ]
    
    def get_chef_projet(self, obj):
        if obj.id_utilisateur:
            chef_user = obj.id_utilisateur.id_utilisateur
            return UtilisateurSerializer(chef_user).data
        return None

class SousProjetSerializer(serializers.ModelSerializer):
    chef_projet = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    project = serializers.SerializerMethodField()
    
    class Meta:
        model = SousProjet
        fields = [
            'id_sous_projet',
            'nom_sous_projet',
            'description_sous_projet',
            'date_debut_sousprojet',
            'date_finsousprojet',
            'statut_sous_projet',
            'id_projet',
            'chef_projet',
            'members',
            'documents',
            'project'
        ]
        read_only_fields = ['id_sous_projet', 'chef_projet', 'members', 'documents', 'project']
    
    def get_chef_projet(self, obj):
        if obj.id_utilisateur:
            chef_user = obj.id_utilisateur.id_utilisateur
            return UtilisateurSerializer(chef_user).data
        return None
    
    def get_members(self, obj):
        members = Employe.objects.filter(id_sous_projet=obj.id_sous_projet)
        return [UtilisateurSerializer(member.id_utilisateur).data for member in members]
    
    def get_documents(self, obj):
        documents = Document.objects.filter(id_sous_projet=obj.id_sous_projet)
        return DocumentSerializer(documents, many=True).data
    
    def get_project(self, obj):
        if obj.id_projet:
            return ProjetSimpleSerializer(obj.id_projet).data
        return None

    def validate(self, data):
        # Validate that end date is after start date
        if data.get('date_debut_sousprojet') and data.get('date_finsousprojet') and data['date_debut_sousprojet'] > data['date_finsousprojet']:
            raise serializers.ValidationError("La date de fin doit être postérieure à la date de début")

        # Validate that sub-project dates are within parent project dates
        if data.get('id_projet'):
            projet = data['id_projet']
            if data.get('date_debut_sousprojet') and data['date_debut_sousprojet'] < projet.date_debut_de_projet:
                raise serializers.ValidationError("La date de début du sous-projet ne peut pas être antérieure à celle du projet")
            if data.get('date_finsousprojet') and data['date_finsousprojet'] > projet.date_fin_de_projet:
                raise serializers.ValidationError("La date de fin du sous-projet ne peut pas être postérieure à celle du projet")

        return data  