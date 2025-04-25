
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubProject } from '@/components/SubProjectCard';
import { ArrowLeft, Printer, Download, BarChart } from 'lucide-react';
import SubProjectMembersList from '@/components/SubProjectMembersList';

type Document = {
  id: string;
  title: string;
  url?: string;
};

type SubProjectMember = {
  id: string;
  name: string;
  role?: string;
  avatar: string;
};

const SubProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState<SubProject & {
    documents?: Document[];
    detailedMembers?: SubProjectMember[];
  } | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      // Try to get the subProject from localStorage
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        try {
          const subProjects = JSON.parse(subProjectsString);
          const foundSubProject = subProjects.find((p: SubProject) => p.id === id);
          if (foundSubProject) {
            setSubProject(foundSubProject);
          }
        } catch (error) {
          console.error('Error loading subProject:', error);
        }
      }
    }
  }, [id]);
  
  // Fallback sample subProject if not found in localStorage
  const sampleSubProject = {
    id: id || 'sp-1',
    name: 'Nom sous_projet',
    description: 'Petite description du sous projet de manière détaillée',
    status: 'En cours' as const,
    daysAgo: 12,
    projectId: 'p-1',
    startDate: '10/4/2023',
    endDate: '15/9/2023',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
    documents: [
      { id: '1', title: 'Rapport initial du sous-projet.pdf', url: '/documents/rapport-sous-projet.pdf' },
      { id: '2', title: 'Plans techniques du sous-projet.pdf', url: '/documents/plans-sous-projet.pdf' },
    ]
  };

  const subProjectDetails = subProject || sampleSubProject;
  
  // Transform members list to the detailed format required by SubProjectMembersList
  const detailedMembers = subProjectDetails.members.map(member => ({
    id: member.id,
    name: member.name || `Membre ${member.id}`,
    role: member.role || 'Membre',
    avatar: member.avatar
  }));

  const printSubProject = () => {
    window.print();
  };

  const downloadDocument = (doc: Document) => {
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

  const handleBack = () => {
    navigate('/sous-projet');
  };
  
  const handleDashboard = () => {
    navigate(`/sous-projet/dashboard/${subProjectDetails.id}`);
  };
  
  // Delete functionality
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-projet?')) {
      try {
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const subProjects = JSON.parse(subProjectsString);
          const updatedSubProjects = subProjects.filter((sp: SubProject) => sp.id !== id);
          localStorage.setItem('subProjects', JSON.stringify(updatedSubProjects));
          
          // Also remove reference from parent project
          const projectsString = localStorage.getItem('projects');
          if (projectsString && subProjectDetails.projectId) {
            const projects = JSON.parse(projectsString);
            const projectIndex = projects.findIndex((p: any) => p.id === subProjectDetails.projectId);
            
            if (projectIndex !== -1 && projects[projectIndex].subProjects) {
              projects[projectIndex].subProjects = projects[projectIndex].subProjects.filter(
                (sp: any) => sp.id !== id
              );
              localStorage.setItem('projects', JSON.stringify(projects));
            }
          }
          
          navigate('/sous-projet');
        }
      } catch (error) {
        console.error('Error deleting sub-project:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux sous-projets</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Détails du sous-projet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main subProject details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{subProjectDetails.name}</h2>
            <span className={`px-3 py-1 ${getStatusColor(subProjectDetails.status)} rounded-full text-sm font-medium`}>
              {subProjectDetails.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Projet principal</div>
                <div className="text-sm">Projet {subProjectDetails.projectId}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Il y a</div>
                <div className="text-sm">{subProjectDetails.daysAgo} jours</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date début</div>
                <div className="text-sm">{subProjectDetails.startDate || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date fin</div>
                <div className="text-sm">{subProjectDetails.endDate || "Non spécifié"}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description du sous-projet</h3>
            <div className="p-4 bg-gray-50 rounded-md min-h-[100px] text-gray-700">
              {subProjectDetails.description || "Aucune description disponible."}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              Supprimer
            </button>
            <button 
              onClick={() => navigate(`/sous-projet/edit/${subProjectDetails.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Modifier
            </button>
            <button 
              onClick={handleDashboard}
              className="px-4 py-2 border border-[#192759] text-[#192759] rounded-md hover:bg-blue-50 flex items-center"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Tableau de bord
            </button>
            <button 
              onClick={printSubProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Documents du sous-projet</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subProjectDetails.documents && subProjectDetails.documents.length > 0 ? (
                subProjectDetails.documents.map(doc => (
                  <div key={doc.id} className="p-2 bg-blue-50 text-blue-600 rounded-md flex justify-between items-center">
                    <span className="truncate">{doc.title}</span>
                    <button 
                      onClick={() => downloadDocument(doc)}
                      className="text-blue-700 hover:text-blue-900 ml-2"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Aucun document disponible</div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Membres du sous-projet</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {detailedMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role || "Membre"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Members in grid format */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Membres du sous-projet</h3>
        <SubProjectMembersList members={detailedMembers} />
      </div>
    </div>
  );
};

export default SubProjectDetailsPage;
