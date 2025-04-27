from rest_framework import serializers
from ..models import Utilisateur
from django.contrib.auth.hashers import check_password

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        mot_de_passe = attrs.get('mot_de_passe')
        fcm_token = attrs.get('fcm_token')

       
        try:
            user = Utilisateur.objects.get(email=email)
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError('Invalid email ')



        if not check_password(mot_de_passe, user.mot_de_passe):
            raise serializers.ValidationError(' password')

        attrs['user'] = user
        return attrs