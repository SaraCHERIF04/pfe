
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Pour le graphique circulaire
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

// Pour le graphique linéaire
const projectData = [
  { month: 'Oct 2021', 'Projet A': 3, 'Projet B': 4 },
  { month: 'Nov 2021', 'Projet A': 4, 'Projet B': 3 },
  { month: 'Dec 2021', 'Projet A': 5, 'Projet B': 2 },
  { month: 'Jan 2022', 'Projet A': 6, 'Projet B': 3 },
  { month: 'Feb 2022', 'Projet A': 5, 'Projet B': 5 },
  { month: 'Mar 2022', 'Projet A': 7, 'Projet B': 4 }
];

const budgetData = [
  { name: 'Completed', value: 32 },
  { name: 'On Hold', value: 25 },
  { name: 'On Progress', value: 25 },
  { name: 'Pending', value: 18 }
];

const ChefDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [subProjects, setSubProjects] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Charger les projets
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      }
    }

    // Charger les sous-projets
    const storedSubProjects = localStorage.getItem('subProjects');
    if (storedSubProjects) {
      try {
        setSubProjects(JSON.parse(storedSubProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des sous-projets:", error);
      }
    }

    // Charger les incidents
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Erreur lors du chargement des incidents:", error);
      }
    }
  }, []);

  // Calculate subproject status distribution
  const getSubProjectStatusData = () => {
    const statusCounts = {
      'Terminé': 0,
      'En cours': 0,
      'En attente': 0,
      'Suspendu': 0
    };
    
    subProjects.forEach(subProject => {
      const status = subProject.status || 'En cours';
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts['En cours']++;
      }
    });
    
    return [
      { name: 'Terminé', value: statusCounts['Terminé'] || 0 },
      { name: 'En cours', value: statusCounts['En cours'] || 0 },
      { name: 'En attente', value: statusCounts['En attente'] || 0 },
      { name: 'Suspendu', value: statusCounts['Suspendu'] || 0 }
    ].filter(item => item.value > 0); // Only include statuses with values
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableaux de bord</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  />
                  <Legend align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* État d'avancement des projets Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">État d'avancement des projets</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Projet A" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Projet B" stroke="#4D4DFF" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État d'avancement des sous-projets */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">État d'avancement des sous-projets</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">Vue d'ensemble</Badge>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSubProjectStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {getSubProjectStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Progression des sous-projets récents</h3>
              {subProjects.slice(0, 5).map((subProject) => {
                // Generate a random progress value between 0-100 for demonstration
                const progress = subProject.progress || Math.floor(Math.random() * 100);
                
                return (
                  <div key={subProject.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subProject.name}</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-end">
                      <Badge 
                        className={`${
                          subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          subProject.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subProject.status || 'En cours'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {subProjects.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucun sous-projet trouvé.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Projets</h3>
            <p className="text-xl font-semibold text-blue-600">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Sous-projets</h3>
            <p className="text-xl font-semibold text-blue-600">{subProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Incidents</h3>
            <p className="text-xl font-semibold text-blue-600">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Budget Total</h3>
            <p className="text-xl font-semibold text-blue-600">100M Da</p>
          </CardContent>
        </Card>
      </div>

      {/* Incidents récents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Incidents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Projet</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Lieu</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 5).map((incident, index) => (
                  <tr 
                    key={incident.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${index !== incidents.slice(0, 5).length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="p-2">{incident.type || 'Général'}</td>
                    <td className="p-2">{incident.projectName || 'N/A'}</td>
                    <td className="p-2">{incident.createdAt || incident.date || 'N/A'}</td>
                    <td className="p-2">{incident.location || 'N/A'}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {incident.status || 'En cours'}
                      </span>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">Aucun incident récent</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefDashboardPage;
