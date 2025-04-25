
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import BudgetPrediction from './BudgetPrediction';
import ExpenseCategories from './ExpenseCategories';
import OptimizationSuggestions from './OptimizationSuggestions';
import AnomalyDetection from './AnomalyDetection';

// Couleurs pour les graphiques
const COLORS = ['#008080', '#1E90FF', '#6495ED', '#87CEEB'];

const BudgetDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [budgetData, setBudgetData] = useState({
    total: 1000000,
    used: 650000,
    remaining: 350000,
    percentUsed: 65,
    projectedOverrunDate: '2023-12-15',
    riskLevel: 'medium', // 'low', 'medium', 'high'
  });
  
  const [expenseCategories, setExpenseCategories] = useState([
    { name: 'Matériaux', value: 45, fill: '#008080' },
    { name: 'Main-d\'œuvre', value: 30, fill: '#1E90FF' },
    { name: 'Équipement', value: 15, fill: '#6495ED' },
    { name: 'Divers', value: 10, fill: '#87CEEB' },
  ]);
  
  const [trendData, setTrendData] = useState([
    { month: 'Jan', dépenses: 50000, budget: 80000 },
    { month: 'Fév', dépenses: 65000, budget: 80000 },
    { month: 'Mar', dépenses: 90000, budget: 80000 },
    { month: 'Avr', dépenses: 75000, budget: 80000 },
    { month: 'Mai', dépenses: 85000, budget: 80000 },
    { month: 'Juin', dépenses: 95000, budget: 80000 },
  ]);
  
  const [suggestions, setSuggestions] = useState([
    {
      id: 1, 
      category: 'Matériaux',
      reductionPercent: 15,
      savingsDays: 23,
      impact: 'high'
    },
    {
      id: 2,
      category: 'Équipement',
      reductionPercent: 10,
      savingsDays: 12,
      impact: 'medium'
    },
  ]);
  
  const [anomalies, setAnomalies] = useState([
    {
      id: 1,
      description: 'Dépense inhabituelle de 25 000 € en fournitures le 15/04',
      severity: 'high',
      detected: '2023-04-16',
    }
  ]);
  
  // Charger les données du projet basées sur le projectId
  useEffect(() => {
    // Simulation de chargement des données
    console.log(`Chargement des données budgétaires pour le projet ID: ${projectId}`);
    // Dans une application réelle, vous feriez un appel API ici
  }, [projectId]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord budgétaire intelligent</h1>
      
      {/* Résumé du budget */}
      <Card className={`border-l-4 ${
        budgetData.riskLevel === 'high' ? 'border-l-red-500' : 
        budgetData.riskLevel === 'medium' ? 'border-l-yellow-500' : 
        'border-l-green-500'
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            État du budget
            {budgetData.riskLevel === 'high' && <AlertTriangle className="h-5 w-5 ml-2 text-red-500" />}
            {budgetData.riskLevel === 'medium' && <AlertTriangle className="h-5 w-5 ml-2 text-yellow-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">AP utilisé: {budgetData.percentUsed}%</span>
                <span className="text-sm font-medium">{budgetData.used.toLocaleString()} / {budgetData.total.toLocaleString()} €</span>
              </div>
              <Progress value={budgetData.percentUsed} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">AP restant</p>
                <p className="text-lg font-semibold">{budgetData.remaining.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de dépassement prévue</p>
                <p className="text-lg font-semibold">{new Date(budgetData.projectedOverrunDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Composants intelligents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetPrediction trendData={trendData} />
        <ExpenseCategories categories={expenseCategories} />
      </div>
      
      {/* Suggestions d'optimisation */}
      <OptimizationSuggestions suggestions={suggestions} />
      
      {/* Détection d'anomalies */}
      <AnomalyDetection anomalies={anomalies} />
    </div>
  );
};

export default BudgetDashboard;
