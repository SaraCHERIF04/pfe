import { post } from '@/utils/apiHelpers';
import { setAuthToken } from '@/utils/apiHelpers';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    data: {
      id_utilisateur: string;
      nom: string;
      email: string;
      role_de_utilisateur: string;
      tokens: {
        access: string;
      };
    };

  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await post<LoginResponse>('/auth/', {
      email: credentials.email,
      mot_de_passe: credentials.password,
      action: 'login',
    });
    setAuthToken(response.data.data.tokens.access);
    localStorage.setItem('userRole', response.data.data.role_de_utilisateur);
    localStorage.setItem('userId', response.data.data.id_utilisateur);
    localStorage.setItem('userName', response.data.data.nom);
    localStorage.setItem('userEmail', response.data.data.email);
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}; 