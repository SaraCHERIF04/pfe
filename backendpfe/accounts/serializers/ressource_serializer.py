from rest_framework import serializers
from ..models import Ressource, Projet, SousProjet

class RessourceSerializer(serializers.ModelSerializer):
    nom_projet = serializers.SerializerMethodField()
    nom_sous_projet = serializers.SerializerMethodField()

    class Meta:
        model = Ressource
        fields = [
            'id_ressource',
            'nom_ressource',
            'type_ressource',
            'prix_ressource',
            'id_projet',
            'id_sous_projet',
            'nom_projet',
            'nom_sous_projet'
        ]
        read_only_fields = ['id_ressource', 'nom_projet', 'nom_sous_projet']

    def get_nom_projet(self, obj):
        if obj.id_projet:
            return obj.id_projet.nom_projet
        return None

    def get_nom_sous_projet(self, obj):
        if obj.id_sous_projet:
            return obj.id_sous_projet.nom_sous_projet
        return None 