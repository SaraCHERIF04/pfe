
export interface Marche {
  id: string;
  nom: string;
  numeroMarche: string;
  type: string;
  dateSignature: string;
  dateDebutProjet: string;
  dateVisaCME: string;
  numeroAppelOffre: string;
  prixDinar: string;
  prixDevise: string;
  fournisseur: string;
  projetId?: string;
  description: string;
}
