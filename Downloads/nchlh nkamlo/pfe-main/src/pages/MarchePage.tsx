
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus } from 'lucide-react';
import { Marche } from '@/types/Marche';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MarchePage = () => {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load marches from localStorage
    const marchesString = localStorage.getItem('marches');
    if (marchesString) {
      try {
        const data = JSON.parse(marchesString);
        setMarches(data);
      } catch (error) {
        console.error('Error loading marches:', error);
      }
    } else {
      // Initialize with sample data if none exists
      const sampleData: Marche[] = [
        {
          id: '1',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '2',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '3',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '4',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '5',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '6',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '7',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        },
        {
          id: '8',
          nom: 'Column2',
          numeroMarche: 'Column1',
          dateSignature: 'Column3',
          type: 'Column4',
          projetId: 'Column5',
          fournisseur: 'Column6',
          dateDebutProjet: '',
          dateVisaCME: '',
          numeroAppelOffre: '',
          prixDinar: '',
          prixDevise: '',
          description: ''
        }
      ];
      setMarches(sampleData);
      localStorage.setItem('marches', JSON.stringify(sampleData));
    }
  }, []);
  
  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'N/A';
    try {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        const project = projects.find((p: any) => p.id === projectId);
        return project ? project.name : 'N/A';
      }
    } catch (error) {
      console.error('Error getting project name:', error);
    }
    return 'N/A';
  };
  
  const handleViewMarche = (marche: Marche) => {
    navigate(`/marche/${marche.id}`);
  };
  
  const handleEditMarche = (marche: Marche) => {
    navigate(`/marche/edit/${marche.id}`);
  };
  
  const handleDeleteMarche = (marcheId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché?')) {
      try {
        const updatedMarches = marches.filter(marche => marche.id !== marcheId);
        setMarches(updatedMarches);
        localStorage.setItem('marches', JSON.stringify(updatedMarches));
      } catch (error) {
        console.error('Error deleting marché:', error);
      }
    }
  };
  
  const filteredMarches = marches.filter(marche => 
    marche.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.numeroMarche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(marche.projetId).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Marchés</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un marché"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={() => navigate('/marche/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro marché</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date signature</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarches.length > 0 ? (
              filteredMarches.map((marche) => (
                <TableRow key={marche.id} className={marche.id === '2' || marche.id === '4' || marche.id === '6' || marche.id === '8' ? 'bg-gray-100' : ''}>
                  <TableCell>{marche.numeroMarche}</TableCell>
                  <TableCell>{marche.nom}</TableCell>
                  <TableCell>{marche.dateSignature}</TableCell>
                  <TableCell>{marche.type}</TableCell>
                  <TableCell>{getProjectName(marche.projetId)}</TableCell>
                  <TableCell>{marche.fournisseur}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewMarche(marche)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMarche(marche)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMarche(marche.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Aucun marché trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarchePage;
