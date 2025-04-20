from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from ..models import SousProjet
from ..serializers.sub_project_serializer import SousProjetSerializer
from ..responses.success_api_response import SuccessAPIResponse
from ..responses.error_api_response import ErrorAPIResponse

class SubProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, projet_id=None, pk=None):
        if projet_id:
            return self.get_sub_projects_by_project(request, projet_id)

        if pk:
            return self.get_single_sub_project(request, pk)

        return self.get_all_sub_projects()

    def get_single_sub_project(self, request, pk):
        sous_projet = self.get_object(pk)
        if not sous_projet:
            return Response({
                'success': False,
                'message': 'SousProjet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = SousProjetSerializer(sous_projet)
        return Response({
            'success': True,
            'message': 'SousProjet retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_sub_projects(self):
        sous_projets = SousProjet.objects.all()
        serializer = SousProjetSerializer(sous_projets, many=True)
        return Response({
            'success': True,
            'message': 'SousProjets retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SousProjetSerializer(data=request.data)
        if serializer.is_valid():
            sous_projet = serializer.save()
            return Response({
                'success': True,
                'message': 'SousProjet created successfully',
                'data': SousProjetSerializer(sous_projet).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        sous_projet = self.get_object(pk)
        if not sous_projet:
            return Response({
                'success': False,
                'message': 'SousProjet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = SousProjetSerializer(sous_projet, data=request.data)
        if serializer.is_valid():
            sous_projet = serializer.save()
            return Response({
                'success': True,
                'message': 'SousProjet updated successfully',
                'data': SousProjetSerializer(sous_projet).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sous_projet = self.get_object(pk)
        if not sous_projet:
            return Response({
                'success': False,
                'message': 'SousProjet not found'
            }, status=status.HTTP_404_NOT_FOUND)

        sous_projet.delete()
        return Response({
            'success': True,
            'message': 'SousProjet deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_sub_projects_by_project(self, request, projet_id):
        sous_projets = SousProjet.objects.filter(id_projet=projet_id)
        serializer = SousProjetSerializer(sous_projets, many=True)

        return Response({
            'success': True,
            'message': 'SousProjets retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_object(self, pk):
        try:
            return SousProjet.objects.get(pk=pk)
        except SousProjet.DoesNotExist:
            return None