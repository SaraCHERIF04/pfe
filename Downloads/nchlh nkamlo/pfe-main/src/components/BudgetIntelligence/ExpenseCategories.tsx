
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Category {
  name: string;
  value: number;
  fill: string;
}

interface ExpenseCategoriesProps {
  categories: Category[];
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ categories }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Répartition des dépenses</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value}%`}
              labelFormatter={(index) => `Catégorie: ${categories[index as number].name}`}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right" 
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">IA Insight:</span> Les dépenses en matériaux sont 12% plus élevées 
            que la moyenne des projets similaires. Considérez une renégociation avec les fournisseurs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategories;
