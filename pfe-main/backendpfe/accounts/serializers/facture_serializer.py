from rest_framework import serializers
from ..models import Facture, Projet, SousProjet

class FactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facture
        fields = [
            'id_facture',
            'numero_facture',
            'designation',
            'date_facturation',
            'date_reception',
            'brut_ht',
            'montant_net_ht',
            'montant_tva',
            'montant_ttc',
            'date_ordre_virement',
            'numero_ordre_virement',
            'id_projet',
            'id_sous_projet',
            'id_marche',
            'id_ap',
            'id_md'
        ]
        read_only_fields = ['id_facture']

    def validate(self, data):
        # Validation que la date de facturation ne soit pas postérieure à la date de réception
        if data['date_facturation'] > data['date_reception']:
            raise serializers.ValidationError("La date de facturation ne peut pas être postérieure à la date de réception.")

        # Validation que le montant TTC est supérieur ou égal au montant brut HT
        if data['montant_ttc'] < data['brut_ht']:
            raise serializers.ValidationError("Le montant TTC doit être supérieur ou égal au montant brut HT.")

        # Validation que la date de facturation ne soit pas antérieure à la date de début du projet ou sous-projet
        if data.get('id_projet'):
            projet = data['id_projet']
            if data['date_facturation'] < projet.date_debut_de_projet:
                raise serializers.ValidationError("La date de facturation ne peut pas être antérieure à la date de début du projet.")
        
        if data.get('id_sous_projet'):
            sous_projet = data['id_sous_projet']
            if data['date_facturation'] < sous_projet.date_debut_sousprojet:
                raise serializers.ValidationError("La date de facturation ne peut pas être antérieure à la date de début du sous-projet.")

        return data