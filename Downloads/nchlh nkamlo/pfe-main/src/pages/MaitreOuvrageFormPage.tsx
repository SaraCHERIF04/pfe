import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MaitreOuvrage } from '@/types/MaitreOuvrage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';

const MaitreOuvrageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [nom, setNom] = useState('');
  const [type, setType] = useState<'public' | 'privé'>('public');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  useEffect(() => {
    if (isEditing) {
      const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
      if (maitreOuvragesString) {
        try {
          const maitreOuvrages = JSON.parse(maitreOuvragesString);
          const maitreOuvrage = maitreOuvrages.find((mo: MaitreOuvrage) => mo.id === id);
          if (maitreOuvrage) {
            setNom(maitreOuvrage.nom);
            setType(maitreOuvrage.type);
            setEmail(maitreOuvrage.email);
            setTelephone(maitreOuvrage.telephone);
            setAdresse(maitreOuvrage.adresse);
          }
        } catch (error) {
          console.error('Error loading maître d\'ouvrage data:', error);
        }
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim()) {
      alert("Le nom est obligatoire");
      return;
    }

    const maitreOuvrageData: MaitreOuvrage = {
      id: isEditing ? id! : uuidv4(),
      nom,
      type,
      email,
      telephone,
      adresse
    };

    try {
      const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
      let maitreOuvrages: MaitreOuvrage[] = [];

      if (maitreOuvragesString) {
        maitreOuvrages = JSON.parse(maitreOuvragesString);
      }

      if (isEditing) {
        maitreOuvrages = maitreOuvrages.map(mo => mo.id === id ? maitreOuvrageData : mo);
      } else {
        maitreOuvrages.unshift(maitreOuvrageData);
      }

      localStorage.setItem('maitreOuvrages', JSON.stringify(maitreOuvrages));
      window.dispatchEvent(new Event('maitreOuvragesUpdated'));
      navigate('/maitre-ouvrage');
    } catch (error) {
      console.error('Error saving maître d\'ouvrage:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/maitre-ouvrage')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier' : 'Créer'} Maître d'ouvrage
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nom" className="mb-2 block">Nom du Maître d'Ouvrage</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrez le nom"
              required
            />
          </div>

          <div>
            <Label htmlFor="type" className="mb-2 block">Type</Label>
            <Select value={type} onValueChange={(value: 'public' | 'privé') => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="privé">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="adresse" className="mb-2 block">Adresse complète</Label>
            <Input
              id="adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Entrez l'adresse"
            />
          </div>

          <div>
            <Label htmlFor="telephone" className="mb-2 block">Téléphone</Label>
            <Input
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Entrez le numéro de téléphone"
            />
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez l'adresse email"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaitreOuvrageFormPage;
