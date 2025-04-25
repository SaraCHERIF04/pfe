
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, PenSquare, Trash2, Plus } from 'lucide-react';
import { Incident, IncidentFollowUp } from '@/types/Incident';

const IncidentFollowUpsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [followUps, setFollowUps] = useState<IncidentFollowUp[]>([]);

  useEffect(() => {
    // Load incident data
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find((inc: Incident) => inc.id === id);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }

    // Load follow-ups data
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps) {
      try {
        const allFollowUps = JSON.parse(storedFollowUps);
        const incidentFollowUps = allFollowUps.filter(
          (followUp: IncidentFollowUp) => followUp.incidentId === id
        );
        setFollowUps(incidentFollowUps);
      } catch (error) {
        console.error("Error loading follow-ups:", error);
      }
    }
  }, [id]);

  const handleDeleteFollowUp = (followUpId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce suivi d'incident ?")) {
      const storedFollowUps = localStorage.getItem('incidentFollowUps');
      if (storedFollowUps) {
        try {
          const allFollowUps = JSON.parse(storedFollowUps);
          const updatedFollowUps = allFollowUps.filter(
            (followUp: IncidentFollowUp) => followUp.id !== followUpId
          );
          localStorage.setItem('incidentFollowUps', JSON.stringify(updatedFollowUps));
          
          // Update local state
          setFollowUps(followUps.filter(followUp => followUp.id !== followUpId));
        } catch (error) {
          console.error("Error deleting follow-up:", error);
        }
      }
    }
  };

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/incidents/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          Suivis d'incident - {incident.type}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Liste des suivis</h2>
          <Button 
            onClick={() => navigate(`/incidents/suivis/new/${id}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau suivi
          </Button>
        </div>
        
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date de signalement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.length > 0 ? (
                followUps.map((followUp, index) => (
                  <TableRow key={followUp.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <TableCell>{followUp.reportDate}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {followUp.description.substring(0, 50)}
                      {followUp.description.length > 50 ? '...' : ''}
                    </TableCell>
                    <TableCell>
                      {followUp.documents && followUp.documents.length ? 
                        `${followUp.documents.length} document(s)` : 
                        'Aucun document'}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/incidents/suivis/${id}/${followUp.id}`)}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/incidents/suivis/edit/${id}/${followUp.id}`)}
                      >
                        <PenSquare className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteFollowUp(followUp.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Aucun suivi d'incident trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default IncidentFollowUpsPage;
