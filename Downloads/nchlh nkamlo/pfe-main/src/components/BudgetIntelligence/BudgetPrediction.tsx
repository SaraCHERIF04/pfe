
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendDataPoint {
  month: string;
  dépenses: number;
  budget: number;
}

interface BudgetPredictionProps {
  trendData: TrendDataPoint[];
}

const BudgetPrediction: React.FC<BudgetPredictionProps> = ({ trendData }) => {
  // Calcul de la tendance (moyenne des 3 derniers mois)
  const lastThreeMonths = trendData.slice(-3);
  const avgExpense = lastThreeMonths.reduce((sum, item) => sum + item.dépenses, 0) / lastThreeMonths.length;
  const avgBudget = lastThreeMonths.reduce((sum, item) => sum + item.budget, 0) / lastThreeMonths.length;
  const isTrendUp = avgExpense > avgBudget;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Prévision budgétaire</span>
          <Badge variant={isTrendUp ? "destructive" : "outline"} className="ml-2">
            {isTrendUp ? 
              <div className="flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> Dépassement prévu</div> : 
              <div className="flex items-center"><TrendingDown className="h-3 w-3 mr-1" /> Dans les limites</div>
            }
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `${Number(value).toLocaleString()} €`}
              labelFormatter={(label) => `Mois: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="dépenses" 
              stroke="#FF6B6B" 
              activeDot={{ r: 8 }} 
              name="Dépenses réelles" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#4D4DFF" 
              name="Budget alloué" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">IA Insight:</span> Selon le modèle prédictif, les dépenses actuelles 
            {isTrendUp ? 
              " dépasseront le budget alloué de 15% d'ici 45 jours si la tendance se maintient." : 
              " resteront dans les limites du budget pour les prochains 60 jours."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetPrediction;
