
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Settings, ServerIcon, Database, Users, Shield } from 'lucide-react';

const AdminParametresPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres administrateur</h1>
      </div>
      
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="logs">Journaux</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ServerIcon className="mr-2 h-5 w-5" />
                Paramètres système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nom de l'application</Label>
                <Input id="app-name" defaultValue="SONELGAZ Projects" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-url">URL de l'application</Label>
                <Input id="app-url" defaultValue="https://projects.sonelgaz.dz" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-environment">Environnement</Label>
                <Select defaultValue="production">
                  <SelectTrigger id="app-environment">
                    <SelectValue placeholder="Sélectionner un environnement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="testing">Test</SelectItem>
                    <SelectItem value="staging">Pré-production</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="maintenance-mode" className="flex-1">Mode maintenance</Label>
                </div>
                <Switch id="maintenance-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="debug-mode" className="flex-1">Mode debug</Label>
                </div>
                <Switch id="debug-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="cache-clear" className="flex-1">Vider le cache automatiquement</Label>
                </div>
                <Switch id="cache-clear" defaultChecked />
              </div>
              
              <Button>Appliquer les modifications</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Base de données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="db-type">Type de base de données</Label>
                <Select defaultValue="mysql">
                  <SelectTrigger id="db-type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-host">Hôte</Label>
                <Input id="db-host" defaultValue="localhost" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-name">Nom de la base</Label>
                <Input id="db-name" defaultValue="sonelgaz_projects" />
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="db-user">Utilisateur</Label>
                  <Input id="db-user" defaultValue="admin" />
                </div>
                
                <div className="space-y-2 flex-1">
                  <Label htmlFor="db-password">Mot de passe</Label>
                  <Input id="db-password" type="password" defaultValue="********" />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button>Tester la connexion</Button>
                <Button variant="outline">Sauvegarder la BD</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Politique de mot de passe</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="min-password-length" className="flex-1">Longueur minimale</Label>
                  <Select defaultValue="8">
                    <SelectTrigger id="min-password-length" className="w-[100px]">
                      <SelectValue placeholder="Longueur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-special-chars" className="flex-1">Exiger des caractères spéciaux</Label>
                  <Switch id="require-special-chars" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-uppercase" className="flex-1">Exiger des majuscules</Label>
                  <Switch id="require-uppercase" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-numbers" className="flex-1">Exiger des chiffres</Label>
                  <Switch id="require-numbers" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Authentification</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor-auth" className="flex-1">Activer l'authentification à deux facteurs</Label>
                  <Switch id="two-factor-auth" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-logout" className="flex-1">Déconnexion automatique après inactivité</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="auto-logout" className="w-[120px]">
                      <SelectValue placeholder="Minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-login-attempts" className="flex-1">Tentatives de connexion maximales</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="max-login-attempts" className="w-[120px]">
                      <SelectValue placeholder="Tentatives" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 tentatives</SelectItem>
                      <SelectItem value="5">5 tentatives</SelectItem>
                      <SelectItem value="10">10 tentatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>Enregistrer les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Paramètres utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Politique d'inscription</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-registration" className="flex-1">Autoriser l'inscription publique</Label>
                  <Switch id="allow-registration" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-verification" className="flex-1">Vérification d'email obligatoire</Label>
                  <Switch id="email-verification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-approval" className="flex-1">Approbation administrateur nécessaire</Label>
                  <Switch id="admin-approval" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Paramètres par défaut</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="default-role">Rôle par défaut pour les nouveaux utilisateurs</Label>
                  <Select defaultValue="employee">
                    <SelectTrigger id="default-role">
                      <SelectValue placeholder="Sélectionner le rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Invité</SelectItem>
                      <SelectItem value="employee">Employé</SelectItem>
                      <SelectItem value="responsable">Responsable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auto-cleanup">Nettoyer automatiquement les comptes inactifs après</Label>
                  <Select defaultValue="365">
                    <SelectTrigger id="auto-cleanup">
                      <SelectValue placeholder="Sélectionner la période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="180">180 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                      <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Journaux système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="log-level">Niveau de journalisation</Label>
                <Select defaultValue="info">
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="log-retention">Conservation des journaux</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="log-retention">
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="14">14 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="90">90 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-logs" className="flex-1">Activer les journaux d'audit</Label>
                <Switch id="audit-logs" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="log-actions">Actions à journaliser</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="log-login" defaultChecked />
                    <Label htmlFor="log-login">Connexion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="log-user-creation" defaultChecked />
                    <Label htmlFor="log-user-creation">Création d'utilisateur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="log-data-modification" defaultChecked />
                    <Label htmlFor="log-data-modification">Modification de données</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="log-system-changes" defaultChecked />
                    <Label htmlFor="log-system-changes">Changements système</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button>Enregistrer les paramètres</Button>
                <Button variant="outline">Télécharger les journaux</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminParametresPage;
