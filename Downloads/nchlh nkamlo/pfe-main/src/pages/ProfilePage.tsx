
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { STATUS_OPTIONS } from '@/components/Admin/UserForm/UserFormSchema';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // User profile information
  const [profile, setProfile] = useState({
    name: 'Rowles',
    firstName: 'Alexa',
    email: 'alexarowles@sonelgaz.dz',
    phoneNumber: '+213 558426587',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    matricule: 'SON145872',
    gender: 'Femme',
    state: 'En poste',
    role: 'Chef de projet',
    creationDate: '2022-05-15'
  });

  // Load profile from localStorage if it exists
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    }
  }, []);

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    
    // Show success message
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (newPassword.length < 8) {
      setPasswordError('Votre mot de passe doit comporter au moins 8 caractères et inclure une combinaison de chiffres, de lettres et de caractères spéciaux (Ex:#.*)');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Save password change (in a real app would call an API)
    localStorage.setItem('chefPassword', newPassword);
    setPasswordError('');
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Show success message
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été changé avec succès.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        {!isChangingPassword ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-semibold">Information profil</h1>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600"
                >
                  Modifier le profil
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-2 border-2 border-blue-500"
                  />
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name" className="mb-2 block">Nom</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="firstName" className="mb-2 block">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="matricule" className="mb-2 block">Matricule</Label>
                    <Input
                      id="matricule"
                      value={profile.matricule}
                      onChange={(e) => setProfile({...profile, matricule: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="mb-2 block">Numéro de téléphone</Label>
                    <Input
                      id="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                      placeholder="+213 xxxxxxxxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="mb-2 block">Sexe</Label>
                    <Select 
                      value={profile.gender}
                      onValueChange={(value) => setProfile({...profile, gender: value})}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Sélectionner le sexe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Homme">Homme</SelectItem>
                        <SelectItem value="Femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block">Adresse Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      type="email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="mb-2 block">État</Label>
                    <Select 
                      value={profile.state} 
                      onValueChange={(value) => setProfile({...profile, state: value})}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="role" className="mb-2 block">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile({...profile, role: e.target.value})}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="creationDate" className="mb-2 block">Date création</Label>
                    <Input
                      id="creationDate"
                      value={profile.creationDate}
                      onChange={(e) => setProfile({...profile, creationDate: e.target.value})}
                      type="date"
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-2 border-2 border-blue-500"
                  />
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Nom</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.name}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Prénom</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.firstName}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Matricule</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.matricule}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Numéro de téléphone</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.phoneNumber || '-'}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Sexe</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.gender || '-'}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Adresse Email</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.email}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">État</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.state || '-'}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Role</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.role}</div>
                  </div>

                  <div>
                    <Label className="mb-1 block text-gray-500 text-sm">Date création</Label>
                    <div className="border border-gray-200 rounded-md p-2">{profile.creationDate || '-'}</div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => setIsChangingPassword(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Changer le mot de passe
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-semibold">Changer le mot de passe</h1>
              <Button 
                variant="ghost" 
                onClick={() => setIsChangingPassword(false)}
                className="text-blue-600"
              >
                Retour au profil
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-6">
                Votre mot de passe doit comporter au moins 8 caractères et inclure une combinaison de chiffres, de lettres et de caractères spéciaux (Ex:#.*)
              </p>
              
              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {passwordError}
                </div>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="mb-2 block">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password" className="mb-2 block">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="mb-2 block">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
