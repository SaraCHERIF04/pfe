
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#008080', '#1E90FF', '#6495ED', '#87CEEB'];

type Project = {
  id: string;
  name: string;
  description?: string;
  status: string;
  chef?: string;
  region?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  members?: Array<{id: string, name: string, avatar: string}>;
};

const ProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project
        const projectsString = localStorage.getItem('projects');
        if (projectsString && id) {
          const projects = JSON.parse(projectsString);
          const projectData = projects.find((p: any) => p.id === id);
          if (projectData) {
            setProject(projectData);
          }
        }
        
        // Fetch incidents
        const incidentsString = localStorage.getItem('incidents');
        if (incidentsString && id) {
          const allIncidents = JSON.parse(incidentsString);
          const filteredIncidents = allIncidents.filter((incident: any) => incident.projectId === id);
          setIncidents(filteredIncidents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const getBudgetData = () => {
    return [
      { name: 'Completed', value: 32, fill: '#008080' },
      { name: 'On Hold', value: 25, fill: '#1E90FF' },
      { name: 'On Progress', value: 25, fill: '#6495ED' },
      { name: 'Pending', value: 18, fill: '#87CEEB' },
    ];
  };
  
  const getProjectProgressData = () => {
    return [
      { name: 'Oct 2021', projet: 4, budget: 8 },
      { name: 'Nov 2021', projet: 3, budget: 6 },
      { name: 'Dec 2021', projet: 5, budget: 4 },
      { name: 'Jan 2022', projet: 7, budget: 8 },
      { name: 'Feb 2022', projet: 6, budget: 9 },
      { name: 'Mar 2022', projet: 5, budget: 7 },
    ];
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600 mb-4">Projet non trouvé</p>
        <button 
          onClick={() => navigate('/project')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retour aux projets
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(`/project/details/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour au projet</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Tableaux de bord - {project.name}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getBudgetData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {getBudgetData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  align="right" 
                  verticalAlign="middle" 
                  layout="vertical"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Project Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">État d'avancement de projet</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getProjectProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projet" stroke="#FF6B6B" activeDot={{ r: 8 }} name="Projet A" />
                <Line type="monotone" dataKey="budget" stroke="#4D4DFF" name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* Project Stats */}
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Temps réel</h3>
              <p className="text-lg font-semibold text-blue-600">12 mois</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Temps prévu</h3>
              <p className="text-lg font-semibold text-blue-600">12 mois</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Différence</h3>
              <p className="text-lg font-semibold text-blue-600">0 mois</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Budget réel</h3>
              <p className="text-lg font-semibold text-blue-600">{project.budget || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Budget prévu</h3>
              <p className="text-lg font-semibold text-blue-600">{project.budget || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Différence</h3>
              <p className="text-lg font-semibold text-blue-600">0 Da</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Incidents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Incidents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Titre</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 5).map((incident, index) => (
                  <tr 
                    key={incident.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${index !== incidents.length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="p-2">{incident.title}</td>
                    <td className="p-2">{incident.createdAt}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {incident.status || 'En cours'}
                      </span>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">Aucun incident récent</td>
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

export default ProjectDashboardPage;
