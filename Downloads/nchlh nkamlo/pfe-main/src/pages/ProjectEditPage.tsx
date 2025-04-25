
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { Project } from '@/components/ProjectCard';

// Extended Project type to include additional properties
type ExtendedProject = Project & {
  chef?: string;
  region?: string; 
  budget?: string;
  startDate?: string;
  endDate?: string;
  documents?: Array<{id: string, title: string, url: string}>;
  city?: string;
};

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
            console.log("Found project to edit:", foundProject);
            setProject(foundProject);
          } else {
            console.error('Project not found');
            navigate('/project');
          }
        } catch (error) {
          console.error('Error loading project:', error);
          navigate('/project');
        }
      } else {
        // If no projects in localStorage, use sample data
        const sampleProject: ExtendedProject = {
          id: id,
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
          chef: '',
          region: '',
          budget: '',
          startDate: '',
          endDate: '',
          city: ''
        };
        setProject(sampleProject);
      }
    }
  }, [id, navigate]);
  
  return project ? <ProjectForm project={project} isEdit={true} /> : null;
};

export default ProjectEditPage;
