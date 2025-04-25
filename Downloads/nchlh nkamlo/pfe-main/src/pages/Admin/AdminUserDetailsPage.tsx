
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/User';
import { ArrowLeft } from 'lucide-react';

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Find the user in our stored data
    const user = storedUsers.find((u: UserType) => u.id === id);
    
    if (user) {
      setUserData(user);
    } else {
      toast({
        title: "Utilisateur non trouvé",
        description: "L'utilisateur que vous essayez de consulter n'existe pas",
        variant: "destructive",
      });
      navigate('/admin/users');
    }
    
    setLoading(false);
  }, [id, navigate, toast]);
  
  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }
  
  if (!userData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h2>
        <Button onClick={() => navigate('/admin/users')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin/users')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Information profil</h2>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/users/edit/${id}`)}
            className="ml-auto"
          >
            Modifier le profil
          </Button>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                <img 
                  src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name + ' ' + userData.prenom)}&background=random`} 
                  alt={userData.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-center mt-2 text-sm">{userData.email}</p>
            </div>
            
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{userData.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{userData.prenom}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Matricule</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{userData.matricule || '-'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{userData.telephone || '-'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexe</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {userData.gender === 'male' ? 'Homme' : 'Femme'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{userData.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">État</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {userData.status}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {userData.role === 'admin' ? 'Administrateur' : 
                     userData.role === 'chef' ? 'Chef de projet' : 'Employé'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date création</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {new Date(userData.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserDetailsPage;
