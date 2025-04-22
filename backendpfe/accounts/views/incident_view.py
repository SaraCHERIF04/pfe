from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Incident
from ..serializers.incident_serializer import IncidentSerializer

class IncidentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class IncidentView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = IncidentPagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_incident(request, pk)
        return self.get_all_incidents()

    def get_single_incident(self, request, pk):
        incident = self.get_object(pk)
        if not incident:
            return Response({
                'success': False,
                'message': 'Incident not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = IncidentSerializer(incident)
        return Response({
            'success': True,
            'message': 'Incident retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_incidents(self):
        incidents = Incident.objects.all()
        serializer = IncidentSerializer(incidents, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Incidents retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = IncidentSerializer(data=request.data)
        if serializer.is_valid():
            incident = serializer.save()
            return Response({
                'success': True,
                'message': 'Incident created successfully',
                'data': IncidentSerializer(incident).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        incident = self.get_object(pk)
        if not incident:
            return Response({
                'success': False,
                'message': 'Incident not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = IncidentSerializer(incident, data=request.data)
        if serializer.is_valid():
            incident = serializer.save()
            return Response({
                'success': True,
                'message': 'Incident updated successfully',
                'data': IncidentSerializer(incident).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        incident = self.get_object(pk)
        if not incident:
            return Response({
                'success': False,
                'message': 'Incident not found'
            }, status=status.HTTP_404_NOT_FOUND)

        incident.delete()
        return Response({
            'success': True,
            'message': 'Incident deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Incident.objects.get(pk=pk)
        except Incident.DoesNotExist:
            return None
