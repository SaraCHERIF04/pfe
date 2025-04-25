
export interface MaitreOuvrage {
  id: string;
  nom: string;
  type: 'public' | 'privé';
  email: string;
  telephone: string;
  adresse: string;
}
