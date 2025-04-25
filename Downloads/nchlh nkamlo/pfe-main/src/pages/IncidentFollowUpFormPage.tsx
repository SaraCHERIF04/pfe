
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { Incident, IncidentFollowUp } from '@/types/Incident';
import { v4 as uuidv4 } from 'uuid';

const IncidentFollowUpFormPage = () => {
  const navigate = useNavigate();
  const { incidentId, followUpId } = useParams();
  const isEditing = Boolean(followUpId);
  
  const [incident, setIncident] = useState<Incident | null>(null);
  const [followUp, setFollowUp] = useState<IncidentFollowUp>({
    id: '',
    incidentId: incidentId || '',
    reportDate: new Date().toISOString().split('T')[0],
    description: '',
    documents: [],
    createdAt: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  // Load incident data
  useEffect(() => {
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

    // Load follow-up data if editing
    if (isEditing) {
      const storedFollowUps = localStorage.getItem('incidentFollowUps');
      if (storedFollowUps) {
        try {
          const allFollowUps = JSON.parse(storedFollowUps);
          const foundFollowUp = allFollowUps.find(
            (fu: IncidentFollowUp) => fu.id === followUpId
          );
          if (foundFollowUp) {
            setFollowUp(foundFollowUp);
            // We can't restore actual file objects from localStorage
            // but we can show their names
            if (foundFollowUp.documents && foundFollowUp.documents.length) {
              setFileNames(foundFollowUp.documents.map((doc: any) => doc.name || 'Document'));
            }
          }
        } catch (error) {
          console.error("Error loading follow-up:", error);
        }
      }
    }
  }, [incidentId, followUpId, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFollowUp(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      setFileNames(prev => [...prev, ...filesArray.map(file => file.name)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    let followUps = storedFollowUps ? JSON.parse(storedFollowUps) : [];
    
    if (isEditing) {
      // Update existing follow-up
      followUps = followUps.map((fu: IncidentFollowUp) => 
        fu.id === followUpId ? { ...followUp, documents: selectedFiles } : fu
      );
    } else {
      // Create new follow-up
      const newFollowUp = {
        ...followUp,
        id: uuidv4(),
        documents: selectedFiles,
        createdAt: new Date().toISOString()
      };
      followUps.push(newFollowUp);
    }
    
    localStorage.setItem('incidentFollowUps', JSON.stringify(followUps));
    navigate(`/incidents/suivis/${incidentId}`);
  };

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
          {isEditing ? 'Modifier Suivie d\'un incident' : 'Créer Suivie d\'un incident'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {incident && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Incident: {incident.type}</h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {incident.date} à {incident.time}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Lieu:</span> {incident.location}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de signalement
              </label>
              <input
                type="date"
                name="reportDate"
                value={followUp.reportDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description suivie d'incident
              </label>
              <textarea
                name="description"
                value={followUp.description}
                onChange={handleInputChange}
                rows={8}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Description détaillée du suivi..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Télécharger document
              </label>
              <div className="mt-1 flex justify-start">
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Télécharger document</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              </div>
              
              {fileNames.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                  <ul className="space-y-2">
                    {fileNames.map((name, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/incidents/suivis/${incidentId}`)}
            >
              Supprimer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentFollowUpFormPage;
