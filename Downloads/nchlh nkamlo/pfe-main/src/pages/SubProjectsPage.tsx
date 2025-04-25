
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubProjectCard, { SubProject } from '@/components/SubProjectCard';

const SubProjectsPage = () => {
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedSubProjects = localStorage.getItem('subProjects');
    if (storedSubProjects) {
      try {
        setSubProjects(JSON.parse(storedSubProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des sous-projets:", error);
      }
    }
    setLoading(false);
  }, []);

  const handleCreateSubProject = () => {
    navigate('/sous-projet/new');
  };

  const handleViewSubProject = (id: string) => {
    navigate(`/sous-projet/${id}`);
  };

  const handleEditSubProject = (id: string) => {
    navigate(`/sous-projet/edit/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sous-projets</h1>
        <Button onClick={handleCreateSubProject}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau sous-projet
        </Button>
      </div>
      
      {loading ? (
        <p>Chargement des sous-projets...</p>
      ) : subProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subProjects.map((subProject) => (
            <SubProjectCard
              key={subProject.id}
              subProject={subProject}
              onDelete={() => {}}
            />
          ))}
        </div>
      ) : (
        <p>Aucun sous-projet trouvé.</p>
      )}
    </div>
  );
};

export default SubProjectsPage;
