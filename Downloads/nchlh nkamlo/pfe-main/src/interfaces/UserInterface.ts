export interface UserInterface {
    id_utilisateur: number;
    nom: string;
    email: string;
    mot_de_passe: string;
    role_de_utilisateur: string;
    numero_de_tel: number;
    created_at?: Date;
    is_anonymous: boolean;
    is_authenticated: boolean;
    is_active: boolean;
}
