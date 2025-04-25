
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Suggestion {
  id: number;
  category: string;
  reductionPercent: number;
  savingsDays: number;
  impact: 'low' | 'medium' | 'high';
}

interface OptimizationSuggestionsProps {
  suggestions: Suggestion[];
}

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ suggestions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggestions d'optimisation intelligentes</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-gray-500 italic">Aucune suggestion d'optimisation disponible actuellement.</p>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="border-l-4 p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors" 
                style={{ 
                  borderLeftColor: 
                    suggestion.impact === 'high' ? '#10B981' : 
                    suggestion.impact === 'medium' ? '#FBBF24' : 
                    '#60A5FA'
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Réduire {suggestion.reductionPercent}% sur {suggestion.category}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Permettrait de gagner <span className="font-semibold">{suggestion.savingsDays} jours</span> avant dépassement du budget
                    </p>
                  </div>
                  <Badge variant={
                    suggestion.impact === 'high' ? "default" : 
                    suggestion.impact === 'medium' ? "secondary" : 
                    "outline"
                  }>
                    {suggestion.impact === 'high' ? 'Impact élevé' : 
                     suggestion.impact === 'medium' ? 'Impact moyen' : 
                     'Impact faible'}
                  </Badge>
                </div>
                
                {suggestion.impact === 'high' && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                    <span className="font-semibold">IA Recommandation:</span> Cette action est hautement recommandée 
                    car elle offre le meilleur rapport économies/effort selon l'analyse de projets similaires.
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationSuggestions;
