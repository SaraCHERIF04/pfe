import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SubProject } from './SubProjectCard';
import { Project } from './ProjectCard';
import { notifyNewSubProject } from '@/utils/notificationHelpers';

type SubProjectFormProps = {
  subProject?: SubProject;
  isEdit?: boolean;
};

type SubProjectDocument = {
  id: string;
  title: string;
  file?: File;
  url?: string;
};

type ProjectMember = {
  id: string;
  name: string;
  avatar: string;
  selected?: boolean;
  role?: string;
};

const SubProjectForm: React.FC<SubProjectFormProps> = ({ subProject, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(subProject?.name || '');
  const [description, setDescription] = useState(subProject?.description || '');
  const [status, setStatus] = useState<'En attente' | 'En cours' | 'Terminé'>(
    (subProject?.status as any) || 'En attente'
  );
  const [startDate, setStartDate] = useState(subProject?.startDate || '');
  const [endDate, setEndDate] = useState(subProject?.endDate || '');
  const [projectId, setProjectId] = useState(subProject?.projectId || '');
  const [documents, setDocuments] = useState<SubProjectDocument[]>(
    subProject?.documents?.map(doc => ({ ...doc })) || []
  );
  const [availableMembers, setAvailableMembers] = useState<ProjectMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>(
    subProject?.members?.map(member => ({ 
      ...member, 
      name: member.name || '',
      selected: true 
    })) || []
  );
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        setAvailableProjects(projects);
        if (!projectId && projects.length > 0) {
          setProjectId(projects[0].id);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects);
          const selectedProject = projects.find((p: Project) => p.id === projectId);
          
          if (selectedProject && selectedProject.members) {
            const projectMembersList = selectedProject.members.map((member: any) => ({
              id: member.id,
              name: member.name,
              avatar: member.avatar,
              role: member.role || 'Membre'
            }));
            
            setProjectMembers(projectMembersList);
            
            const selectedMemberIds = new Set(selectedMembers.map(m => m.id));
            const filteredMembers = projectMembersList.filter(
              m => !selectedMemberIds.has(m.id)
            );
            
            setAvailableMembers(filteredMembers);
          }
        } catch (error) {
          console.error('Error loading project members:', error);
        }
      }
    }
  }, [projectId, selectedMembers]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const newDocument: SubProjectDocument = {
        id: `doc-${Date.now()}`,
        title: newFile.name,
        file: newFile,
      };
      setDocuments([...documents, newDocument]);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const toggleMemberSelection = (member: ProjectMember) => {
    if (selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
      setAvailableMembers([...availableMembers, member]);
    } else {
      setSelectedMembers([...selectedMembers, { ...member, selected: true }]);
      setAvailableMembers(availableMembers.filter(m => m.id !== member.id));
    }
  };

  const removeMember = (memberId: string) => {
    const removedMember = selectedMembers.find(m => m.id === memberId);
    if (removedMember) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
      setAvailableMembers([...availableMembers, { ...removedMember, selected: false }]);
    }
  };

  const filteredAvailableMembers = availableMembers.filter(member => 
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du sous-projet est requis.",
        variant: "destructive",
      });
      return;
    }

    if (!projectId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un projet principal.",
        variant: "destructive",
      });
      return;
    }

    const updatedSubProject: SubProject = {
      id: subProject?.id || `sp-${Date.now()}`,
      name,
      description,
      status,
      daysAgo: subProject?.daysAgo || 0,
      projectId,
      startDate,
      endDate,
      members: selectedMembers.map(member => ({
        id: member.id,
        avatar: member.avatar,
        name: member.name,
        role: member.role
      })),
      documentsCount: documents.length,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        url: doc.url || `/documents/${doc.title}`
      })),
    };

    try {
      const subProjectsString = localStorage.getItem('subProjects');
      let subProjects = [];
      
      if (subProjectsString) {
        subProjects = JSON.parse(subProjectsString);
        
        if (isEdit) {
          const index = subProjects.findIndex((p: SubProject) => p.id === updatedSubProject.id);
          if (index !== -1) {
            subProjects[index] = updatedSubProject;
          } else {
            subProjects.push(updatedSubProject);
          }
        } else {
          subProjects.push(updatedSubProject);
        }
      } else {
        subProjects = [updatedSubProject];
      }
      
      localStorage.setItem('subProjects', JSON.stringify(subProjects));
      
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
        
        if (projectIndex !== -1) {
          if (!projects[projectIndex].subProjects) {
            projects[projectIndex].subProjects = [];
          }
          
          const subProjectIndex = projects[projectIndex].subProjects.findIndex(
            (sp: any) => sp.id === updatedSubProject.id
          );
          
          const subProjectSummary = {
            id: updatedSubProject.id,
            name: updatedSubProject.name,
            description: updatedSubProject.description,
            daysAgo: updatedSubProject.daysAgo,
            members: updatedSubProject.members,
            documentsCount: updatedSubProject.documentsCount
          };
          
          if (subProjectIndex !== -1) {
            projects[projectIndex].subProjects[subProjectIndex] = subProjectSummary;
          } else {
            projects[projectIndex].subProjects.push(subProjectSummary);
          }
          
          localStorage.setItem('projects', JSON.stringify(projects));
        }
      }

      if (!isEdit) {
        const projectName = availableProjects.find(p => p.id === projectId)?.name || '';
        notifyNewSubProject(name, projectName);
      }

      toast({
        title: isEdit ? "Sous-projet modifié" : "Sous-projet créé",
        description: isEdit ? "Les modifications ont été enregistrées." : "Le sous-projet a été créé avec succès.",
      });
      
      navigate("/sous-projet");
    } catch (error) {
      console.error('Error saving subProject:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du sous-projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/sous-projet')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux sous-projets</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Sous projet</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du sous_projet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom du sous-projet"
              required
            />
          </div>
          
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Projet principal
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un projet</option>
              {availableProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'En attente' | 'En cours' | 'Terminé')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description du sous projet
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le sous-projet..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ajouter/supprimer membre
            </label>
            
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher membres..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre de projet</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAvailableMembers.length > 0 ? (
                    filteredAvailableMembers.map(member => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <img src={member.avatar} alt="" className="h-8 w-8 rounded-full" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => toggleMemberSelection(member)}
                            className="text-[#192759] hover:text-blue-700"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun membre disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Documents du sous projet
            </label>
            
            <div className="mb-3">
              <label 
                htmlFor="fileUpload" 
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                Télécharger document
              </label>
              <input 
                id="fileUpload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-[172px] overflow-y-auto">
              {documents.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {documents.map(doc => (
                    <div key={doc.id} className="px-4 py-3 flex justify-between items-center">
                      <span className="text-sm truncate">{doc.title}</span>
                      <button 
                        type="button" 
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">
                  Aucun document ajouté
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Membres sélectionnés</h3>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.length > 0 ? (
              selectedMembers.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm">{member.name}</span>
                  <button 
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Aucun membre sélectionné</div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-8">
          <Button 
            type="button" 
            onClick={() => navigate('/sous-projet')}
            variant="outline"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-[#192759] hover:bg-blue-700">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubProjectForm;
