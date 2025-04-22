from rest_framework import serializers
from ..models import SousProjet, Projet

class SousProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousProjet
        fields = [
            'id_sous_projet',
            'nom_sous_projet',
            'date_debut_sousprojet',
            'date_finsousprojet',
            'statut_sous_projet',
            'id_projet'
        ]
        read_only_fields = ['id_sous_projet']

    def validate(self, data):
        # Validate that end date is after start date
        if data['date_debut_sousprojet'] > data['date_finsousprojet']:
            raise serializers.ValidationError("La date de fin doit être postérieure à la date de début")

        # Validate that sub-project dates are within parent project dates
        if data.get('id_projet'):
            projet = data['id_projet']
            if data['date_debut_sousprojet'] < projet.date_debut_de_projet:
                raise serializers.ValidationError("La date de début du sous-projet ne peut pas être antérieure à celle du projet")
            if data['date_finsousprojet'] > projet.date_fin_de_projet:
                raise serializers.ValidationError("La date de fin du sous-projet ne peut pas être postérieure à celle du projet")

        return data  