from rest_framework import serializers

class SuccessAPIResponse(serializers.Serializer):
    success = serializers.BooleanField(default=True)
    message = serializers.CharField()
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        if isinstance(obj, list):
            return obj
        return obj