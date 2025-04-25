
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Check, Download, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Project } from './ProjectCard';
import { notifyNewProject } from '@/utils/notificationHelpers';
import { algerianWilayas } from '@/utils/algerianWilayas';
import ProjectMembersList from './ProjectMembersList';
import MemberSearch from './MemberSearch';
import { User } from '@/types/User';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProjectFormProps = {
  project?: Project & {
    chef?: string;
    wilaya?: string;
    budget?: string;
    startDate?: string;
    endDate?: string;
    documents?: Array<{ id: string; title: string; url?: string }>;
  };
  isEdit?: boolean;
};

type ProjectDocument = {
  id: string;
  title: string;
  file?: File;
  url?: string;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<'En attente' | 'En cours' | 'Terminé'>(
    (project?.status as any) || 'En attente'
  );
  const [chefId, setChefId] = useState(project?.chef || '');
  const [wilaya, setWilaya] = useState(project?.wilaya || '');
  const [budget, setBudget] = useState(project?.budget || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [documents, setDocuments] = useState<ProjectDocument[]>(project?.documents || []);
  const [newWilaya, setNewWilaya] = useState('');
  const [customWilayas, setCustomWilayas] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>(
    project?.members ? project.members.map(member => {
      return {
        id: member.id,
        name: member.name,
        email: member.id + '@example.com',
        role: 'employee' as 'admin' | 'chef' | 'employee' | 'responsable',
        status: 'En poste',
        createdAt: new Date().toISOString(),
        avatar: member.avatar
      };
    }) : []
  );
  const [availableChefs, setAvailableChefs] = useState<User[]>([]);
  const [selectedChef, setSelectedChef] = useState<User | null>(null);

  useEffect(() => {
    const savedCustomWilayas = localStorage.getItem('customWilayas');
    if (savedCustomWilayas) {
      setCustomWilayas(JSON.parse(savedCustomWilayas));
    }

    // Load available chefs from local storage
    const usersString = localStorage.getItem('users');
    if (usersString) {
      try {
        const users = JSON.parse(usersString);
        // Filter users with 'chef' or 'admin' role
        const chefs = users.filter((user: User) => 
          user.role === 'chef' || user.role === 'admin'
        );
        setAvailableChefs(chefs);

        // If we have a chef ID from the project, find the chef in the list
        if (project?.chef) {
          const foundChef = chefs.find((chef: User) => chef.id === project.chef);
          if (foundChef) {
            setSelectedChef(foundChef);
          }
        }
      } catch (error) {
        console.error('Error loading chefs:', error);
      }
    }
  }, [project?.chef]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const newDocument: ProjectDocument = {
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

  const downloadDocument = (doc: ProjectDocument) => {
    if (doc.url) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.title;
      
      document.body.appendChild(a);
      
      a.click();
      
      document.body.removeChild(a);
    } else {
      console.error('Document URL is missing');
    }
  };

  const handleAddWilaya = () => {
    if (newWilaya.trim()) {
      const updatedWilayas = [...customWilayas, newWilaya.trim()];
      setCustomWilayas(updatedWilayas);
      localStorage.setItem('customWilayas', JSON.stringify(updatedWilayas));
      setNewWilaya('');
    }
  };

  const handleMemberSelect = (member: User) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleChefSelect = (chef: User) => {
    setSelectedChef(chef);
    setChefId(chef.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du projet est requis.",
        variant: "destructive",
      });
      return;
    }

    const updatedProject = {
      id: project?.id || `proj-${Date.now()}`,
      name,
      description,
      status,
      deadline: project?.deadline || '23 JUIN 2023',
      members: selectedMembers.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar
      })),
      documentsCount: documents.length,
      chef: selectedChef?.id || chefId,
      wilaya,
      budget,
      startDate,
      endDate,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        url: doc.url || `/documents/${doc.title}`
      }))
    };

    try {
      const projectsString = localStorage.getItem('projects');
      let projects = [];

      if (projectsString) {
        projects = JSON.parse(projectsString);

        if (isEdit) {
          const index = projects.findIndex((p: Project) => p.id === updatedProject.id);
          if (index !== -1) {
            projects[index] = updatedProject;
          } else {
            projects.push(updatedProject);
          }
        } else {
          projects.push(updatedProject);
        }
      } else {
        projects = [updatedProject];
      }

      localStorage.setItem('projects', JSON.stringify(projects));

      if (!isEdit) {
        notifyNewProject(name);
      }

      toast({
        title: isEdit ? "Projet modifié" : "Projet créé",
        description: isEdit ? "Les modifications ont été enregistrées." : "Le projet a été créé avec succès.",
      });

      navigate("/project");
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/project')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux projets</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Projet</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du projet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom du projet"
              required
            />
          </div>

          <div>
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
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chef de projet
          </label>
          <div className="space-y-4">
            {selectedChef && (
              <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 w-fit">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={selectedChef.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChef.name)}`} />
                  <AvatarFallback>{selectedChef.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{selectedChef.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedChef(null)}
                  className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {!selectedChef && (
              <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                {availableChefs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {availableChefs.map((chef) => (
                      <div
                        key={chef.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={chef.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}`} />
                            <AvatarFallback>{chef.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{chef.name} {chef.prenom}</div>
                            <div className="text-sm text-gray-500">{chef.role}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleChefSelect(chef)}
                          variant="ghost"
                          className="text-[#192759] hover:text-blue-700"
                        >
                          Sélectionner
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun chef disponible
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/employee/new'}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouveau chef
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
              Wilaya
            </label>
            <div className="flex gap-2">
              <Select value={wilaya} onValueChange={setWilaya}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une wilaya" />
                </SelectTrigger>
                <SelectContent>
                  {[...algerianWilayas, ...customWilayas].map((wilaya) => (
                    <SelectItem key={wilaya} value={wilaya}>
                      {wilaya}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle wilaya</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-2 mt-4">
                    <Input
                      value={newWilaya}
                      onChange={(e) => setNewWilaya(e.target.value)}
                      placeholder="Nom de la wilaya"
                    />
                    <Button type="button" onClick={handleAddWilaya}>
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le budget"
            />
          </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Membres du projet
          </label>
          <div className="space-y-4">
            <MemberSearch
              onSelect={handleMemberSelect}
              selectedMembers={selectedMembers}
              roles={['employee', 'financier']} 
            />
            <ProjectMembersList members={selectedMembers} />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description du projet
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le projet..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Documents du projet
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

          <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
            {documents.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {documents.map(doc => (
                  <div key={doc.id} className="px-4 py-3 flex justify-between items-center">
                    <span className="text-sm truncate">{doc.title}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadDocument(doc)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
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

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            onClick={() => navigate('/project')}
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

export default ProjectForm;
