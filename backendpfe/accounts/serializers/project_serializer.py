from rest_framework import serializers
from ..models import Projet, Ap, Utilisateur, Document, Employe, SousProjet, Reunion

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id_utilisateur', 'nom', 'prenom', 'email', 'role_de_utilisateur', 'numero_de_tel']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id_document', 'titre', 'date_ajout', 'description','type','chemin']

class ReunionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reunion
        fields = [
            'id_reunion',
            'date_reunion',
            'ordre_de_jour',
            'lieu_reunion',
            'heure_re',
            'numpv_reunion'
        ]

class SousProjetSimpleSerializer(serializers.ModelSerializer):
    chef_projet = serializers.SerializerMethodField()
    
    class Meta:
        model = SousProjet
        fields = [
            'id_sous_projet',
            'nom_sous_projet',
            'description_sous_projet',
            'date_debut_sousprojet',
            'date_finsousprojet',
            'statut_sous_projet',
            'chef_projet'
        ]
    
    def get_chef_projet(self, obj):
        if obj.id_utilisateur:
            chef_user = obj.id_utilisateur.id_utilisateur
            return UtilisateurSerializer(chef_user).data
        return None

class ProjetSerializer(serializers.ModelSerializer):
    chef_projet = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    subprojects = serializers.SerializerMethodField()
    reunions = serializers.SerializerMethodField()
    
    class Meta:
        model = Projet
        fields = [
            'id_projet',
            'nom_projet',
            'description_de_projet',
            'date_debut_de_projet',
            'date_fin_de_projet',
            'status',
            'id_utilisateur',
            'chef_projet',
            'members',
            'documents',
            'subprojects',
            'reunions'
        ]
        read_only_fields = ['id_projet', 'chef_projet', 'members', 'documents', 'subprojects', 'reunions']

    def get_chef_projet(self, obj):
        if obj.id_utilisateur:
            chef_user = obj.id_utilisateur.id_utilisateur
            return UtilisateurSerializer(chef_user).data
        return None
    
    def get_members(self, obj):
        members = Employe.objects.filter(id_projet=obj.id_projet)
        return [UtilisateurSerializer(member.id_utilisateur).data for member in members]
    
    def get_documents(self, obj):
        documents = Document.objects.filter(id_projet=obj.id_projet)
        return DocumentSerializer(documents, many=True).data
    
    def get_subprojects(self, obj):
        subprojects = SousProjet.objects.filter(id_projet=obj.id_projet)
        return SousProjetSimpleSerializer(subprojects, many=True).data
    
    def get_reunions(self, obj):
        reunions = Reunion.objects.filter(id_projet=obj.id_projet)
        return ReunionSerializer(reunions, many=True).data
    
    def validate(self, data):
        if data['date_debut_de_projet'] > data['date_fin_de_projet']:
            raise serializers.ValidationError("La date de fin doit être postérieure à la date de début")
        return data 
