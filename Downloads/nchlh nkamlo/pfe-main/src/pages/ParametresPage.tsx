
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, Key, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ParametresPage: React.FC = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState('fr');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Charger la langue actuelle au chargement de la page
  useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API
    localStorage.setItem('userPassword', newPassword);
    
    toast({
      title: "Succès",
      description: "Votre mot de passe a été mis à jour",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    
    // Enregistrer la langue dans localStorage
    localStorage.setItem('userLanguage', value);
    
    // Afficher un message de confirmation basé sur la langue sélectionnée
    let message = "La langue a été changée avec succès";
    let title = "Langue mise à jour";
    
    if (value === 'en') {
      message = "Language has been successfully changed";
      title = "Language updated";
    } else if (value === 'ar') {
      message = "تم تغيير اللغة بنجاح";
      title = "تم تحديث اللغة";
    }
    
    toast({
      title: title,
      description: message,
    });
    
    // Recharger la page pour appliquer les changements de langue
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">
          {language === 'fr' ? 'Paramètres' : language === 'en' ? 'Settings' : 'الإعدادات'}
        </h1>
      </div>
      
      <Tabs defaultValue="language" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="language">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {language === 'fr' ? 'Langue' : language === 'en' ? 'Language' : 'اللغة'}
            </div>
          </TabsTrigger>
          <TabsTrigger value="password">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              {language === 'fr' ? 'Mot de passe' : language === 'en' ? 'Password' : 'كلمة المرور'}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'Paramètres de langue' : 
                 language === 'en' ? 'Language settings' : 
                 'إعدادات اللغة'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">
                  {language === 'fr' ? "Langue de l'application" : 
                   language === 'en' ? "Application language" : 
                   "لغة التطبيق"}
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={
                      language === 'fr' ? "Sélectionner une langue" : 
                      language === 'en' ? "Select a language" : 
                      "اختر لغة"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'Changer le mot de passe' : 
                 language === 'en' ? 'Change password' : 
                 'تغيير كلمة المرور'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">
                    {language === 'fr' ? 'Mot de passe actuel' : 
                     language === 'en' ? 'Current password' : 
                     'كلمة المرور الحالية'}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">
                    {language === 'fr' ? 'Nouveau mot de passe' : 
                     language === 'en' ? 'New password' : 
                     'كلمة المرور الجديدة'}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    {language === 'fr' ? 'Confirmer le mot de passe' : 
                     language === 'en' ? 'Confirm password' : 
                     'تأكيد كلمة المرور'}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {language === 'fr' ? 'Mettre à jour le mot de passe' : 
                   language === 'en' ? 'Update password' : 
                   'تحديث كلمة المرور'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParametresPage;
