
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Incident, IncidentFollowUp } from '@/types/Incident';

const IncidentFollowUpDetailsPage = () => {
  const { incidentId, followUpId } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [followUp, setFollowUp] = useState<IncidentFollowUp | null>(null);

  useEffect(() => {
    // Load incident data
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find((inc: Incident) => inc.id === incidentId);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }

    // Load follow-up data
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps) {
      try {
        const allFollowUps = JSON.parse(storedFollowUps);
        const foundFollowUp = allFollowUps.find(
          (fu: IncidentFollowUp) => fu.id === followUpId
        );
        if (foundFollowUp) {
          setFollowUp(foundFollowUp);
        }
      } catch (error) {
        console.error("Error loading follow-up:", error);
      }
    }
  }, [incidentId, followUpId]);

  const handlePrint = () => {
    window.print();
  };

  if (!incident || !followUp) {
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
          onClick={() => navigate(`/incidents/suivis/${incidentId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          Détail du suivi d'incident
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Incident: {incident.type}</h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span> {incident.date} à {incident.time}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Lieu:</span> {incident.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Signalé par:</span> {incident.signaledBy}
          </p>
        </div>
        
        <div className="border-b pb-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Date de signalement</h3>
          <p>{followUp.reportDate}</p>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2">Description du suivi</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="whitespace-pre-wrap">{followUp.description}</p>
          </div>
        </div>
        
        {followUp.documents && followUp.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-2">Documents</h3>
            <div className="space-y-2">
              {followUp.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center bg-gray-50 p-2 rounded border">
                  <Download className="h-4 w-4 mr-2 text-teal-500" />
                  <span>{doc.name || `Document ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-8">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="border-green-500 text-green-500 hover:bg-green-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentFollowUpDetailsPage;
