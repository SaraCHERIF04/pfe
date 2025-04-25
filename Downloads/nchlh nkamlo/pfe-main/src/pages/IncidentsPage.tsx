
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Eye, PenSquare, Trash2 } from 'lucide-react';
import { Incident } from '@/types/Incident';

const IncidentsPage = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load incidents from localStorage
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Error loading incidents:", error);
      }
    } else {
      // Demo data if none exists
      const demoData: Incident[] = Array.from({ length: 8 }, (_, i) => ({
        id: `inc-${i + 1}`,
        type: "colum1",
        signaledBy: "aya",
        date: "15/01/2024",
        time: "14H30",
        location: "ALGER",
        projectName: "Project A",
        subProjectName: "Sub Project 1",
        description: "Description de l'incident...",
        documents: [],
        createdAt: new Date().toISOString()
      }));
      
      localStorage.setItem('incidents', JSON.stringify(demoData));
      setIncidents(demoData);
    }
  }, []);

  const filteredIncidents = incidents.filter(incident =>
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.signaledBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const handleDeleteIncident = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet incident ?")) {
      const updatedIncidents = incidents.filter(incident => incident.id !== id);
      setIncidents(updatedIncidents);
      localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un incident"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <Button onClick={() => navigate('/incidents/new')} className="bg-blue-600 hover:bg-blue-700">
            Créer nouveau
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Signalé par</TableHead>
              <TableHead>date</TableHead>
              <TableHead>l'heure</TableHead>
              <TableHead>lieu</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((incident, index) => (
                <TableRow key={incident.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.signaledBy}</TableCell>
                  <TableCell>{incident.date}</TableCell>
                  <TableCell>{incident.time}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/incidents/edit/${incident.id}`)}
                    >
                      <PenSquare className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteIncident(incident.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun incident trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default IncidentsPage;
