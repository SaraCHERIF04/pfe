
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubProjectForm from '@/components/SubProjectForm';
import { SubProject } from '@/components/SubProjectCard';

const SubProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState<SubProject | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      // Try to get the subProject from localStorage
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        try {
          const subProjects = JSON.parse(subProjectsString);
          const foundSubProject = subProjects.find((p: SubProject) => p.id === id);
          if (foundSubProject) {
            console.log("Found subProject to edit:", foundSubProject);
            setSubProject(foundSubProject);
          } else {
            console.error('SubProject not found');
            navigate('/sous-projet');
          }
        } catch (error) {
          console.error('Error loading subProject:', error);
          navigate('/sous-projet');
        }
      } else {
        // If no subProjects in localStorage, redirect to all subProjects
        navigate('/sous-projet');
      }
    }
  }, [id, navigate]);
  
  return subProject ? <SubProjectForm subProject={subProject} isEdit={true} /> : null;
};

export default SubProjectEditPage;
