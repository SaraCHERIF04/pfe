
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Anomaly {
  id: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected: string;
}

interface AnomalyDetectionProps {
  anomalies: Anomaly[];
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ anomalies }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Détection d'anomalies</CardTitle>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="p-4 bg-green-50 rounded-md text-green-800">
            <p className="font-medium">Aucune anomalie détectée</p>
            <p className="text-sm mt-1">Toutes les dépenses correspondent aux patterns normaux pour ce type de projet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <Alert 
                key={anomaly.id} 
                variant={
                  anomaly.severity === 'high' ? "destructive" : 
                  anomaly.severity === 'medium' ? "default" : 
                  "outline"
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>Anomalie détectée</span>
                  <Badge variant={
                    anomaly.severity === 'high' ? "destructive" : 
                    anomaly.severity === 'medium' ? "default" : 
                    "outline"
                  }>
                    {anomaly.severity === 'high' ? 'Critique' : 
                     anomaly.severity === 'medium' ? 'Important' : 
                     'Faible'}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2">
                    <p>{anomaly.description}</p>
                    <p className="text-sm mt-1">Détectée le: {new Date(anomaly.detected).toLocaleDateString()}</p>
                  </div>
                  
                  {anomaly.severity === 'high' && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-800">
                      <span className="font-semibold">Action recommandée:</span> Vérifiez cette transaction immédiatement. 
                      Cette dépense est 3x plus élevée que la moyenne pour cette catégorie.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;
