import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExtendedProject } from '@/pages/ProjectDetailsPage';
import ProjectMembersList from './ProjectMembersList';

interface ProjectDetailsProps {
  project: ExtendedProject;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500">ID: {project.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/project/dashboard/${project.id}`}>
              Tableau de bord
            </Link>
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to={`/project/budget/${project.id}`}>
              Gestion Budgétaire IA
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/project/edit/${project.id}`}>
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informations du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Description:</strong> {project.description || 'Aucune description fournie.'}</p>
              <p><strong>Statut:</strong> {project.status}</p>
              <p><strong>Chef de projet:</strong> {project.chef || 'Non assigné'}</p>
              <p><strong>Région:</strong> {project.region || 'Non spécifiée'}</p>
              <p><strong>Budget:</strong> {project.budget || 'Non défini'}</p>
              <p><strong>Date de début:</strong> {project.startDate || 'Non définie'}</p>
              <p><strong>Date de fin:</strong> {project.endDate || 'Non définie'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Membres du projet</CardTitle>
            </CardHeader>
            <CardContent>
              {project.members ? (
                <ProjectMembersList members={project.members} />
              ) : (
                <p>Aucun membre assigné à ce projet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents du projet</CardTitle>
            </CardHeader>
            <CardContent>
              {project.documents && project.documents.length > 0 ? (
                <ul>
                  {project.documents.map(doc => (
                    <li key={doc.id} className="mb-2">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun document disponible pour ce projet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
