from rest_framework import serializers

class ErrorAPIResponse(serializers.Serializer):
    success = serializers.BooleanField(default=False)
    message = serializers.CharField(default=None)
    error_code = serializers.IntegerField(required=False)  