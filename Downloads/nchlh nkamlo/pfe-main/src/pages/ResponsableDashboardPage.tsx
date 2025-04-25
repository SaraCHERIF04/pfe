
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// For the pie chart
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

// For the line chart
const projectData = [
  { month: 'Oct 2021', projet1: 3, projet2: 4 },
  { month: 'Nov 2021', projet1: 4, projet2: 3 },
  { month: 'Dec 2021', projet1: 5, projet2: 2 },
  { month: 'Jan 2022', projet1: 6, projet2: 3 },
  { month: 'Feb 2022', projet1: 5, projet2: 5 },
  { month: 'Mar 2022', projet1: 7, projet2: 4 }
];

const ResponsableDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState([
    { name: 'Completed', value: 32 },
    { name: 'On Hold', value: 25 },
    { name: 'On Progress', value: 25 },
    { name: 'Pending', value: 18 }
  ]);

  useEffect(() => {
    // Load incidents
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Error loading incidents:", error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableaux de bord</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Budget</CardTitle>
            <Tabs defaultValue="thisWeek">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
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
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">État d'avancement des projets</CardTitle>
            <Tabs defaultValue="thisWeek">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
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
                  <Line type="monotone" dataKey="projet1" stroke="#8884d8" activeDot={{ r: 8 }} name="Projet A" />
                  <Line type="monotone" dataKey="projet2" stroke="#82ca9d" name="Projet B" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    className={`hover:bg-gray-50 cursor-pointer ${index !== incidents.length - 1 ? 'border-b' : ''}`}
                    onClick={() => navigate(`/responsable/incidents/${incident.id}`)}
                  >
                    <td className="p-2">{incident.type}</td>
                    <td className="p-2">{incident.projectName}</td>
                    <td className="p-2">{incident.date}</td>
                    <td className="p-2">{incident.location}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En cours
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
          {incidents.length > 5 && (
            <div className="mt-4 text-right">
              <button 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => navigate('/responsable/incidents')}
              >
                Voir tous les incidents
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsableDashboardPage;
