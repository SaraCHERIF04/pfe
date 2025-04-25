import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus } from 'lucide-react';
import { MaitreOuvrage } from '@/types/MaitreOuvrage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MaitreOuvragePage = () => {
  const [maitreOuvrages, setMaitreOuvrages] = useState<MaitreOuvrage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
    if (maitreOuvragesString) {
      try {
        const data = JSON.parse(maitreOuvragesString);
        setMaitreOuvrages(data);
      } catch (error) {
        console.error('Error loading maitreOuvrages:', error);
      }
    } else {
      const sampleData: MaitreOuvrage[] = [
        {
          id: '1',
          nom: 'ABCDEF',
          type: 'public',
          email: 'xyz@gmail.com',
          telephone: '0660078402',
          adresse: 'Kouba'
        },
        {
          id: '2',
          nom: 'ABCDEF',
          type: 'privé',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'Alger plage'
        },
        {
          id: '3',
          nom: 'ABCDEF',
          type: 'public',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'Kouba'
        },
        {
          id: '4',
          nom: 'ABCDEF',
          type: 'public',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'alger'
        },
        {
          id: '5',
          nom: 'ABCDEF',
          type: 'privé',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'oran'
        },
        {
          id: '6',
          nom: 'ABCDEF',
          type: 'privé',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'alger'
        },
        {
          id: '7',
          nom: 'ABCDEF',
          type: 'public',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'yyy'
        },
        {
          id: '8',
          nom: 'ABCDEF',
          type: 'privé',
          email: 'xyz@gmail.com',
          telephone: 'x',
          adresse: 'yyy'
        }
      ];
      setMaitreOuvrages(sampleData);
      localStorage.setItem('maitreOuvrages', JSON.stringify(sampleData));
    }
  }, []);
  
  const handleViewMaitreOuvrage = (mo: MaitreOuvrage) => {
    navigate(`/maitre-ouvrage/${mo.id}`);
  };
  
  const handleEditMaitreOuvrage = (mo: MaitreOuvrage) => {
    navigate(`/maitre-ouvrage/edit/${mo.id}`);
  };
  
  const notifyUpdate = () => {
    window.dispatchEvent(new Event('maitreOuvragesUpdated'));
  };
  
  const handleDeleteMaitreOuvrage = (moId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce maître d\'ouvrage?')) {
      try {
        const updatedMos = maitreOuvrages.filter(mo => mo.id !== moId);
        setMaitreOuvrages(updatedMos);
        localStorage.setItem('maitreOuvrages', JSON.stringify(updatedMos));
        notifyUpdate();
      } catch (error) {
        console.error('Error deleting maître d\'ouvrage:', error);
      }
    }
  };
  
  const filteredMaitreOuvrages = maitreOuvrages.filter(mo => 
    mo.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Maître d'ouvrage</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un maître d'ouvrage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={() => navigate('/maitre-ouvrage/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaitreOuvrages.length > 0 ? (
              filteredMaitreOuvrages.map((mo) => (
                <TableRow key={mo.id} className={mo.id === '2' || mo.id === '4' || mo.id === '6' || mo.id === '8' ? 'bg-gray-100' : ''}>
                  <TableCell>{mo.nom}</TableCell>
                  <TableCell>{mo.type}</TableCell>
                  <TableCell>{mo.email}</TableCell>
                  <TableCell>{mo.telephone}</TableCell>
                  <TableCell>{mo.adresse}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewMaitreOuvrage(mo)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMaitreOuvrage(mo)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMaitreOuvrage(mo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun maître d'ouvrage trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaitreOuvragePage;
