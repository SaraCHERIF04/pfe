
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import BudgetDashboard from '@/components/BudgetIntelligence/BudgetDashboard';

const BudgetIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [projectName, setProjectName] = useState<string>('');
  
  useEffect(() => {
    // Dans une application réelle, vous chargeriez les détails du projet ici
    if (id) {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const project = projects.find((p: any) => p.id === id);
          if (project) {
            setProjectName(project.name);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du projet:', error);
        }
      }
    }
  }, [id]);
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion Budgétaire Intelligente</h1>
          {projectName && <p className="text-gray-500">Projet: {projectName}</p>}
        </div>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">AI-Powered</Badge>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="analysis">Analyse prescriptive</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <BudgetDashboard projectId={id || ''} />
        </TabsContent>
        
        <TabsContent value="predictions">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Prédictions Budgétaires</h2>
              <p className="text-gray-500">Cette section affichera des prédictions détaillées basées sur les modèles d'IA.</p>
              
              <div className="p-10 flex justify-center items-center border border-dashed rounded-md mt-4 bg-gray-50">
                <p className="text-gray-400">Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Analyse Prescriptive</h2>
              <p className="text-gray-500">Analyse approfondie des données historiques et recommandations d'actions.</p>
              
              <div className="p-10 flex justify-center items-center border border-dashed rounded-md mt-4 bg-gray-50">
                <p className="text-gray-400">Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Paramètres d'Intelligence Budgétaire</h2>
              <p className="text-gray-500">Configurez les seuils d'alerte et les préférences d'analyse.</p>
              
              <div className="p-10 flex justify-center items-center border border-dashed rounded-md mt-4 bg-gray-50">
                <p className="text-gray-400">Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetIntelligencePage;
