from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import models
from ..models import Projet, SousProjet, Incident


class ResponsableDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the current user
            utilisateur_id = getattr(request.user, 'id_utilisateur', None)
            if not utilisateur_id:
                return Response({"error": "Utilisateur not found."}, status=status.HTTP_404_NOT_FOUND)

            # For responsable, we'll show all projects and sub-projects
            projects = Projet.objects.all()
            project_ids = projects.values_list('id_projet', flat=True)
            sub_projects = SousProjet.objects.filter(id_projet__in=project_ids)
            sub_project_ids = sub_projects.values_list('id_sous_projet', flat=True)

            incident_qs = Incident.objects.filter(
                models.Q(id_projet__in=project_ids) | models.Q(id_sous_projet__in=sub_project_ids)
            )
            incident_count = incident_qs.count()

            last_5_incidents = incident_qs.order_by('-date_incident')[:5]
            last_5_incidents_data = [
                {
                    'id': inc.id_incident,
                    'description': inc.description_incident,
                    'date': inc.date_incident,
                    'project_id': inc.id_projet_id,
                    'sub_project_id': inc.id_sous_projet_id,
                    'lieu': inc.lieu_incident,
                    'type': inc.type_incident,
                }
                for inc in last_5_incidents
            ]

            total_budget = projects.aggregate(total=models.Sum('ap'))['total'] or 0
            status_labels = ['Terminé', 'En cours', 'En attente', 'Suspendu']
            dashboard_data = []
            
            for project in projects:
                sps = SousProjet.objects.filter(id_projet=project)
                avg_progress = sps.aggregate(avg=models.Avg('pourcentage'))['avg'] or 0
                status_counts = {label: sps.filter(statut_sous_projet=label).count() for label in status_labels}
                
                # For responsable, we only include project timeline, not sub-project timeline
                dashboard_data.append({
                    "project_id": project.id_projet,
                    "project_name": project.nom_projet,
                    "average_progress": avg_progress,
                    "status_counts": status_counts,
                    "budget": project.ap,
                })

            # Create project timeline (same as in ChefDashboardView)
            project_timeline = [
                {
                    "id": project.id_projet,
                    "title": project.nom_projet,
                    "startDate": project.date_debut_de_projet,
                    "endDate": project.date_fin_de_projet,
                    "status": project.status,
                    "budget": project.ap
                }
                for project in projects
            ]

            return Response({
                "total_projects": projects.count(),
                "total_sub_projects": sub_projects.count(),
                "total_incidents": incident_count,
                "total_budget": total_budget,
                "last_5_incidents": last_5_incidents_data,
                "projects": dashboard_data,
                "project_timeline": project_timeline
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)