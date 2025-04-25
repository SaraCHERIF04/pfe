
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Incident } from '@/types/Incident';

const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);

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
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Chargement de l'incident...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/incidents')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Incidents</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold">Type de l'incident</h2>
          <p className="text-gray-700 mt-2">{incident.type}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-700">Signalé par</h3>
            <p>{incident.signaledBy}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Date et heure</h3>
            <p>{incident.date} à {incident.time}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Projet</h3>
            <p>{incident.projectName}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Sous-projet</h3>
            <p>{incident.subProjectName}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Lieu d'incident</h3>
            <p>{incident.location}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2">Description</h3>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="whitespace-pre-wrap">{incident.description}</p>
          </div>
        </div>
        
        {incident.documents && incident.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-2">Documents</h3>
            <div className="space-y-2">
              {incident.documents.map((doc: any, index: number) => (
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

export default IncidentDetailsPage;
