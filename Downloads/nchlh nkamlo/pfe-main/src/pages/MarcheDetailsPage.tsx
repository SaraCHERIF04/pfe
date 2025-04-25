
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileEdit, Printer } from 'lucide-react';
import { Marche } from '@/types/Marche';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const MarcheDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marche, setMarche] = useState<Marche | null>(null);
  const [projectName, setProjectName] = useState<string>('N/A');

  useEffect(() => {
    // Load marché data
    const marchesString = localStorage.getItem('marches');
    if (marchesString && id) {
      try {
        const marches = JSON.parse(marchesString);
        const foundMarche = marches.find((m: Marche) => m.id === id);
        if (foundMarche) {
          setMarche(foundMarche);
          
          // Get project name if projetId exists
          if (foundMarche.projetId) {
            const projectsString = localStorage.getItem('projects');
            if (projectsString) {
              const projects = JSON.parse(projectsString);
              const project = projects.find((p: any) => p.id === foundMarche.projetId);
              if (project) {
                setProjectName(project.name);
              }
            }
          }
        } else {
          console.error('Marché not found');
        }
      } catch (error) {
        console.error('Error loading marché data:', error);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!marche) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/marche')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Marché non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/marche')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Numéro de Marché: {marche.numeroMarche}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/marche/edit/${id}`)}>
            <FileEdit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{marche.nom}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{marche.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Projet</p>
              <p>{projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Numéro d'Appel d'Offre</p>
              <p>{marche.numeroAppelOffre || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fournisseur</p>
              <p>{marche.fournisseur || 'N/A'}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Prix (Dinar)</p>
              <p>{marche.prixDinar || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prix (Devise)</p>
              <p>{marche.prixDevise || 'N/A'}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date de signature</p>
              <p>{marche.dateSignature || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date Visa CME</p>
              <p>{marche.dateVisaCME || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date début projet</p>
              <p>{marche.dateDebutProjet || 'N/A'}</p>
            </div>
          </div>

          {marche.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="whitespace-pre-wrap">{marche.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarcheDetailsPage;
