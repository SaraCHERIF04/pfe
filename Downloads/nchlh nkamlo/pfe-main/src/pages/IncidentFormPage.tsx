
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { Incident } from '@/types/Incident';
import { v4 as uuidv4 } from 'uuid';
import { notifyNewIncident } from '@/utils/notificationHelpers';

const IncidentFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [incident, setIncident] = useState<Incident>({
    id: '',
    type: '',
    signaledBy: '',
    date: '',
    time: '',
    location: '',
    projectName: '',
    subProjectName: '',
    description: '',
    documents: [],
    createdAt: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [subProjects, setSubProjects] = useState<any[]>([]);

  // Load projects and subprojects
  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      try {
        const projectsList = JSON.parse(storedProjects);
        setProjects(projectsList);
      } catch (error) {
        console.error("Error loading projects:", error);
        // Fallback to sample projects if parsing fails
        setProjects([
          { id: '1', name: 'Projet A' },
          { id: '2', name: 'Projet B' },
          { id: '3', name: 'Projet C' }
        ]);
      }
    } else {
      // Sample projects if none in localStorage
      setProjects([
        { id: '1', name: 'Projet A' },
        { id: '2', name: 'Projet B' },
        { id: '3', name: 'Projet C' }
      ]);
    }

    // Load subprojects from localStorage
    const storedSubProjects = localStorage.getItem('subProjects');
    if (storedSubProjects) {
      try {
        const subProjectsList = JSON.parse(storedSubProjects);
        setSubProjects(subProjectsList);
      } catch (error) {
        console.error("Error loading subprojects:", error);
        // Fallback to sample subprojects if parsing fails
        setSubProjects([
          { id: '1', name: 'Sous-projet 1', projectId: '1' },
          { id: '2', name: 'Sous-projet 2', projectId: '1' },
          { id: '3', name: 'Sous-projet 3', projectId: '2' }
        ]);
      }
    } else {
      // Sample subprojects if none in localStorage
      setSubProjects([
        { id: '1', name: 'Sous-projet 1', projectId: '1' },
        { id: '2', name: 'Sous-projet 2', projectId: '1' },
        { id: '3', name: 'Sous-projet 3', projectId: '2' }
      ]);
    }
  }, []);

  // Load incident data if editing
  useEffect(() => {
    if (isEditing) {
      const storedIncidents = localStorage.getItem('incidents');
      if (storedIncidents) {
        try {
          const incidents = JSON.parse(storedIncidents);
          const foundIncident = incidents.find((inc: Incident) => inc.id === id);
          if (foundIncident) {
            setIncident(foundIncident);
            // We can't restore actual file objects from localStorage
            // but we can show their names
            if (foundIncident.documents && foundIncident.documents.length) {
              setFileNames(foundIncident.documents.map((doc: any) => doc.name || 'Document'));
            }
          }
        } catch (error) {
          console.error("Error loading incident:", error);
        }
      }
    }
  }, [id, isEditing]);

  // Filter subprojects based on selected project
  const filteredSubProjects = incident.projectName 
    ? subProjects.filter(subProject => 
        subProject.projectId === projects.find(p => p.name === incident.projectName)?.id)
    : subProjects;

  // Check if the selected project has any subprojects
  const hasSubProjects = filteredSubProjects.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIncident(prev => ({ ...prev, [name]: value }));
    
    // Reset subProjectName when projectName changes
    if (name === 'projectName') {
      setIncident(prev => ({ ...prev, subProjectName: '' }));
    }
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
    
    // Form validation - le sous-projet est optionnel seulement si aucun sous-projet n'existe
    if (!incident.type || !incident.signaledBy || !incident.date || !incident.time || 
        !incident.location || !incident.projectName || 
        (hasSubProjects && !incident.subProjectName) || !incident.description) {
      
      // Message personnalisé sur le sous-projet
      if (hasSubProjects && !incident.subProjectName) {
        alert("Veuillez sélectionner un sous-projet pour ce projet");
      } else {
        alert("Veuillez remplir tous les champs obligatoires");
      }
      return;
    }
    
    const storedIncidents = localStorage.getItem('incidents');
    let incidents = storedIncidents ? JSON.parse(storedIncidents) : [];
    
    if (isEditing) {
      // Update existing incident
      incidents = incidents.map((inc: Incident) => 
        inc.id === id ? { ...incident, documents: selectedFiles } : inc
      );
    } else {
      // Create new incident
      const newIncident = {
        ...incident,
        id: uuidv4(),
        documents: selectedFiles,
        createdAt: new Date().toISOString()
      };
      incidents.push(newIncident);
      
      // Notify users about the new incident
      notifyNewIncident(incident.type);
    }
    
    localStorage.setItem('incidents', JSON.stringify(incidents));
    navigate('/incidents');
  };

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
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier incident' : 'Créer incident'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type incident
              </label>
              <input
                type="text"
                name="type"
                value={incident.type}
                onChange={handleInputChange}
                placeholder="Incident"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signaler par
              </label>
              <input
                type="text"
                name="signaledBy"
                value={incident.signaledBy}
                onChange={handleInputChange}
                placeholder="Nom personne"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom projet
              </label>
              <select
                name="projectName"
                value={incident.projectName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom sous projet {!hasSubProjects && incident.projectName && "(Aucun sous-projet disponible)"}
              </label>
              <select
                name="subProjectName"
                value={incident.subProjectName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={hasSubProjects}
                disabled={!incident.projectName || !hasSubProjects}
              >
                <option value="">Sélectionner un sous-projet</option>
                {filteredSubProjects.map(subProject => (
                  <option key={subProject.id} value={subProject.name}>
                    {subProject.name}
                  </option>
                ))}
              </select>
              {!hasSubProjects && incident.projectName && (
                <p className="text-xs text-gray-500 mt-1">Ce projet n'a pas de sous-projets associés</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu d'incident
              </label>
              <input
                type="text"
                name="location"
                value={incident.location}
                onChange={handleInputChange}
                placeholder="Lieu"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'incident
                </label>
                <input
                  type="date"
                  name="date"
                  value={incident.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L'heure de l'incident
                </label>
                <input
                  type="time"
                  name="time"
                  value={incident.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description d'incident
            </label>
            <textarea
              name="description"
              value={incident.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Description détaillée de l'incident..."
              required
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Télécharger documents
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
          
          <div className="mt-8 flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentFormPage;
