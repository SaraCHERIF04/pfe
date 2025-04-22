from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Reunion
from ..serializers.meeting_serializer import ReunionSerializer

class MeetingPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class MeetingView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = MeetingPagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_meeting(request, pk)
        return self.get_all_meetings()

    def get_single_meeting(self, request, pk):
        meeting = self.get_object(pk)
        if not meeting:
            return Response({
                'success': False,
                'message': 'Meeting not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ReunionSerializer(meeting)
        return Response({
            'success': True,
            'message': 'Meeting retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_meetings(self):
        meetings = Reunion.objects.all()
        serializer = ReunionSerializer(meetings, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Meetings retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = ReunionSerializer(data=request.data)
        if serializer.is_valid():
            meeting = serializer.save()
            return Response({
                'success': True,
                'message': 'Meeting created successfully',
                'data': ReunionSerializer(meeting).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        meeting = self.get_object(pk)
        if not meeting:
            return Response({
                'success': False,
                'message': 'Meeting not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ReunionSerializer(meeting, data=request.data)
        if serializer.is_valid():
            meeting = serializer.save()
            return Response({
                'success': True,
                'message': 'Meeting updated successfully',
                'data': ReunionSerializer(meeting).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        meeting = self.get_object(pk)
        if not meeting:
            return Response({
                'success': False,
                'message': 'Meeting not found'
            }, status=status.HTTP_404_NOT_FOUND)

        meeting.delete()
        return Response({
            'success': True,
            'message': 'Meeting deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Reunion.objects.get(pk=pk)
        except Reunion.DoesNotExist:
            return None 