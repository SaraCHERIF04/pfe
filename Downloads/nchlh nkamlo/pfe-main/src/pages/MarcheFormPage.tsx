import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Marche } from '@/types/Marche';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { MaitreOuvrage } from '@/types/MaitreOuvrage';

const MarcheFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [nom, setNom] = useState('');
  const [numeroMarche, setNumeroMarche] = useState('');
  const [type, setType] = useState('');
  const [dateSignature, setDateSignature] = useState('');
  const [dateDebutProjet, setDateDebutProjet] = useState('');
  const [dateVisaCME, setDateVisaCME] = useState('');
  const [numeroAppelOffre, setNumeroAppelOffre] = useState('');
  const [prixDinar, setPrixDinar] = useState('');
  const [prixDevise, setPrixDevise] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMaitreOeuvre, setSelectedMaitreOeuvre] = useState('');
  const [selectedMaitreOuvrage, setSelectedMaitreOuvrage] = useState('');
  const [maitresOeuvre, setMaitresOeuvre] = useState<MaitreOuvrage[]>([]);
  const [maitresOuvrage, setMaitresOuvrage] = useState<MaitreOuvrage[]>([]);

  useEffect(() => {
    const storedMaitresOeuvre = localStorage.getItem('maitresOeuvre');
    const storedMaitresOuvrage = localStorage.getItem('maitresOuvrage');
    
    if (storedMaitresOeuvre) {
      try {
        setMaitresOeuvre(JSON.parse(storedMaitresOeuvre));
      } catch (error) {
        console.error('Error loading maitres d\'oeuvre:', error);
      }
    }

    if (storedMaitresOuvrage) {
      try {
        setMaitresOuvrage(JSON.parse(storedMaitresOuvrage));
      } catch (error) {
        console.error('Error loading maitres d\'ouvrage:', error);
      }
    }

    if (isEditing) {
      const marchesString = localStorage.getItem('marches');
      if (marchesString) {
        try {
          const marches = JSON.parse(marchesString);
          const marche = marches.find((m: Marche) => m.id === id);
          if (marche) {
            setNom(marche.nom);
            setNumeroMarche(marche.numeroMarche);
            setType(marche.type);
            setDateSignature(marche.dateSignature);
            setDateDebutProjet(marche.dateDebutProjet);
            setDateVisaCME(marche.dateVisaCME);
            setNumeroAppelOffre(marche.numeroAppelOffre);
            setPrixDinar(marche.prixDinar);
            setPrixDevise(marche.prixDevise);
            setSelectedMaitreOeuvre(marche.fournisseur);
            setSelectedMaitreOuvrage(marche.fournisseur);
            setDescription(marche.description);
          }
        } catch (error) {
          console.error('Error loading marché data:', error);
        }
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim() || !numeroMarche.trim()) {
      alert("Le nom et le numéro du marché sont obligatoires");
      return;
    }

    const marcheData: Marche = {
      id: isEditing ? id! : uuidv4(),
      nom,
      numeroMarche,
      type,
      dateSignature,
      dateDebutProjet,
      dateVisaCME,
      numeroAppelOffre,
      prixDinar,
      prixDevise,
      fournisseur: selectedMaitreOeuvre,
      description
    };

    const marchesString = localStorage.getItem('marches');
    let marches: Marche[] = [];

    try {
      if (marchesString) {
        marches = JSON.parse(marchesString);
      }

      if (isEditing) {
        marches = marches.map(m => m.id === id ? marcheData : m);
      } else {
        marches.unshift(marcheData);
      }

      localStorage.setItem('marches', JSON.stringify(marches));
      navigate('/marche');
    } catch (error) {
      console.error('Error saving marché:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/marche')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier' : 'Créer'} marché
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nom" className="mb-2 block">Nom du marché</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez le nom"
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroMarche" className="mb-2 block">Numéro du marché</Label>
              <Input
                id="numeroMarche"
                value={numeroMarche}
                onChange={(e) => setNumeroMarche(e.target.value)}
                placeholder="Entrez le numéro"
                required
              />
            </div>

            <div>
              <Label htmlFor="maitreOeuvre" className="mb-2 block">Maître d'oeuvre</Label>
              <div className="flex gap-2">
                <Select value={selectedMaitreOeuvre} onValueChange={setSelectedMaitreOeuvre}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un maître d'oeuvre" />
                  </SelectTrigger>
                  <SelectContent>
                    {maitresOeuvre.map((mo) => (
                      <SelectItem key={mo.id} value={mo.id}>
                        {mo.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => navigate('/maitre-oeuvre')}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="maitreOuvrage" className="mb-2 block">Maître d'ouvrage</Label>
              <div className="flex gap-2">
                <Select value={selectedMaitreOuvrage} onValueChange={setSelectedMaitreOuvrage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un maître d'ouvrage" />
                  </SelectTrigger>
                  <SelectContent>
                    {maitresOuvrage.map((mo) => (
                      <SelectItem key={mo.id} value={mo.id}>
                        {mo.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => navigate('/maitre-ouvrage')}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="type" className="mb-2 block">Type du marché</Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Entrez le type"
              />
            </div>

            <div>
              <Label htmlFor="numeroAppelOffre" className="mb-2 block">Numéro d'Appel d'Offre</Label>
              <Input
                id="numeroAppelOffre"
                value={numeroAppelOffre}
                onChange={(e) => setNumeroAppelOffre(e.target.value)}
                placeholder="Entrez le numéro"
              />
            </div>

            <div>
              <Label htmlFor="prixDinar" className="mb-2 block">Prix (Dinar)</Label>
              <Input
                id="prixDinar"
                value={prixDinar}
                onChange={(e) => setPrixDinar(e.target.value)}
                placeholder="Entrez le prix en dinar"
              />
            </div>

            <div>
              <Label htmlFor="prixDevise" className="mb-2 block">Prix (Devise)</Label>
              <Input
                id="prixDevise"
                value={prixDevise}
                onChange={(e) => setPrixDevise(e.target.value)}
                placeholder="Entrez le prix en devise"
              />
            </div>

            <div>
              <Label htmlFor="dateVisaCME" className="mb-2 block">Date Visa CME</Label>
              <Input
                id="dateVisaCME"
                type="date"
                value={dateVisaCME}
                onChange={(e) => setDateVisaCME(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateDebutProjet" className="mb-2 block">Date début projet</Label>
              <Input
                id="dateDebutProjet"
                type="date"
                value={dateDebutProjet}
                onChange={(e) => setDateDebutProjet(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateSignature" className="mb-2 block">Date de signature</Label>
              <Input
                id="dateSignature"
                type="date"
                value={dateSignature}
                onChange={(e) => setDateSignature(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">Description du marché</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description"
              rows={6}
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

export default MarcheFormPage;
