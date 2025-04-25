import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubProjectCard from '@/components/SubProjectCard';
import { useSearchQuery } from '@/components/Layout/MainLayout';

// Sample data for sub-projects with different statuses
const generateSampleSubProjects = () => {
  const statuses = ['En attente', 'En cours', 'Terminé'];
  const members = [
    { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    { id: '4', name: 'User 4', avatar: 'https://randomuser.me/api/portraits/women/58.jpg' },
  ];

  return Array.from({ length: 18 }, (_, i) => {
    const statusIndex = Math.floor(i / 6);
    const status = statuses[statusIndex % 3];
    
    return {
      id: `sp-${i + 1}`,
      name: `Nom sous_projet ${i + 1}`,
      description: 'Petite description du sous projet',
      status,
      daysAgo: 12,
      projectId: `p-${Math.floor(Math.random() * 5) + 1}`,
      members: members.slice(0, Math.floor(Math.random() * 4) + 1),
      documentsCount: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(), // Older as i increases
    };
  });
};

const SubProjectsPage = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [allSubProjects, setAllSubProjects] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Load sub-projects from localStorage on component mount or use sample data
  useEffect(() => {
    const savedSubProjects = localStorage.getItem('subProjects');
    if (savedSubProjects) {
      try {
        const parsedSubProjects = JSON.parse(savedSubProjects);
        // Sort by createdAt or timestamp to ensure newer items are at the top
        const sortedSubProjects = sortByNewest(parsedSubProjects);
        setAllSubProjects(sortedSubProjects);
      } catch (error) {
        console.error('Error parsing sub-projects from localStorage:', error);
        setAllSubProjects(sortByNewest(generateSampleSubProjects()));
      }
    } else {
      setAllSubProjects(sortByNewest(generateSampleSubProjects()));
    }
  }, []);

  // Helper function to sort items by newest first
  const sortByNewest = (items) => {
    // If items have createdAt or timestamp field, sort by that
    if (items.length > 0) {
      return [...items].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.timestamp || 0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.timestamp || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }
    // Otherwise, keep the existing order
    return items;
  };

  // Filter sub-projects by search term and status
  useEffect(() => {
    const combinedSearchTerm = searchQuery || localSearchTerm;
    let results = allSubProjects;
    
    // Apply search filter
    if (combinedSearchTerm) {
      results = results.filter(subProject =>
        subProject.name.toLowerCase().includes(combinedSearchTerm.toLowerCase()) ||
        subProject.description.toLowerCase().includes(combinedSearchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(subProject => subProject.status === statusFilter);
    }
    
    setFilteredSubProjects(results);
  }, [searchQuery, localSearchTerm, allSubProjects, statusFilter]);

  const handleSearch = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const statusCounts = {
    'En attente': allSubProjects.filter(sp => sp.status === 'En attente').length,
    'En cours': allSubProjects.filter(sp => sp.status === 'En cours').length,
    'Terminé': allSubProjects.filter(sp => sp.status === 'Terminé').length,
  };

  // Group projects by status for the UI
  const pendingProjects = filteredSubProjects.filter(sp => sp.status === 'En attente');
  const inProgressProjects = filteredSubProjects.filter(sp => sp.status === 'En cours');
  const completedProjects = filteredSubProjects.filter(sp => sp.status === 'Terminé');

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sous_projet</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un sous projet..."
              value={localSearchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            to="/sous-projet/new"
            className="bg-[#192759] text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Créer nouveau
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* En attente projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">En attente <span className="text-gray-500 text-sm">({statusCounts['En attente']})</span></h2>
          </div>
          <div className="space-y-4">
            {pendingProjects.length > 0 ? (
              pendingProjects.map(subProject => (
                <Link key={subProject.id} to={`/sous-projet/${subProject.id}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet en attente</div>
            )}
          </div>
        </div>

        {/* En cours projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">En cours <span className="text-gray-500 text-sm">({statusCounts['En cours']})</span></h2>
          </div>
          <div className="space-y-4">
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map(subProject => (
                <Link key={subProject.id} to={`/sous-projet/${subProject.id}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet en cours</div>
            )}
          </div>
        </div>

        {/* Terminé projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Terminé <span className="text-gray-500 text-sm">({statusCounts['Terminé']})</span></h2>
          </div>
          <div className="space-y-4">
            {completedProjects.length > 0 ? (
              completedProjects.map(subProject => (
                <Link key={subProject.id} to={`/sous-projet/${subProject.id}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet terminé</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProjectsPage;
