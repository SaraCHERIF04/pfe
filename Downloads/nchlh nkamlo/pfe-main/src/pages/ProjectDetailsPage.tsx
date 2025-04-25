
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/components/ProjectCard';

// Extended Project type to include additional properties
export type ExtendedProject = Project & {
  chef?: string;
  region?: string; 
  budget?: string;
  startDate?: string;
  endDate?: string;
  documents?: Array<{id: string, title: string, url: string}>;
  subProjects?: Array<any>;
};

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ExtendedProject | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      // Try to get the project from localStorage
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const foundProject = projects.find((p: Project) => p.id === id);
          if (foundProject) {
            setProject(foundProject);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    }
  }, [id]);
  
  // Fallback sample project if not found in localStorage
  const sampleProject: ExtendedProject = {
    id: id || '1',
    name: 'Construction d\'une nouvelle station gaz',
    description: 'Description détaillée du projet ici...',
    status: 'En cours',
    deadline: '23 JUIN 2023',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
    chef: 'amina neg',
    region: 'Alger',
    budget: '10000000000 Da',
    startDate: '20/3/2023',
    endDate: '20/3/2023',
    documents: [
      { id: '1', title: 'Rapport initial.pdf', url: '/documents/rapport.pdf' },
      { id: '2', title: 'Plans techniques.pdf', url: '/documents/plans.pdf' }
    ],
    subProjects: []
  };
  
  return <ProjectDetails project={project || sampleProject} />;
};

export default ProjectDetailsPage;
