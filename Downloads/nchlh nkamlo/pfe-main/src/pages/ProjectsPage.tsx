import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Project } from '@/components/ProjectCard';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      }
    }
    setLoading(false);
  }, []);

  const handleCreateProject = () => {
    navigate('/project/new');
  };

  const handleEditProject = (id: string) => {
    navigate(`/project/edit/${id}`);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      try {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const updatedProjects = projects.filter((project: Project) => project.id !== id);
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
          setProjects(updatedProjects);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
      }
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projets</h1>
        <Button onClick={handleCreateProject} className="bg-[#192759] text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {loading ? (
        <p>Chargement des projets...</p>
      ) : (
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CardTitle>Aucun projet trouvé</CardTitle>
                <CardDescription>Cliquez sur le bouton "Nouveau projet" pour en créer un.</CardDescription>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableCaption>A list of your recent projects.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Id</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.id}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewProject(project.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditProject(project.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
