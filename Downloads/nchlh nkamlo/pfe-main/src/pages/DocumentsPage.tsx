
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus } from 'lucide-react';
import { Document } from '@/types/Document';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load documents from localStorage
    const docsString = localStorage.getItem('documents');
    if (docsString) {
      try {
        const docs = JSON.parse(docsString);
        // Sort documents by dateAdded in descending order (newest first)
        const sortedDocs = [...docs].sort((a, b) => {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        });
        setDocuments(sortedDocs);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  }, []);
  
  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'x';
    try {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        const project = projects.find((p: any) => p.id === projectId);
        return project ? project.name : 'x';
      }
    } catch (error) {
      console.error('Error getting project name:', error);
    }
    return 'x';
  };
  
  const getSubProjectName = (subProjectId?: string) => {
    if (!subProjectId) return 'yyy';
    try {
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        const subProjects = JSON.parse(subProjectsString);
        const subProject = subProjects.find((sp: any) => sp.id === subProjectId);
        return subProject ? subProject.name : 'yyy';
      }
    } catch (error) {
      console.error('Error getting subproject name:', error);
    }
    return 'yyy';
  };
  
  const handleViewDocument = (doc: Document) => {
    navigate(`/documents/${doc.id}`);
  };
  
  const handleEditDocument = (doc: Document) => {
    navigate(`/documents/edit/${doc.id}`);
  };
  
  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      try {
        const updatedDocs = documents.filter(doc => doc.id !== docId);
        setDocuments(updatedDocs);
        localStorage.setItem('documents', JSON.stringify(updatedDocs));
        
        // Also remove from projects
        const projectsString = localStorage.getItem('projects');
        if (projectsString) {
          const projects = JSON.parse(projectsString);
          const updatedProjects = projects.map((project: any) => {
            if (project.documents) {
              project.documents = project.documents.filter((doc: any) => doc.id !== docId);
            }
            return project;
          });
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }
        
        // Also remove from subProjects
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const subProjects = JSON.parse(subProjectsString);
          const updatedSubProjects = subProjects.map((subProject: any) => {
            if (subProject.documents) {
              subProject.documents = subProject.documents.filter((doc: any) => doc.id !== docId);
            }
            return subProject;
          });
          localStorage.setItem('subProjects', JSON.stringify(updatedSubProjects));
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(doc.projectId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSubProjectName(doc.subProjectId).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Documents</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un document"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={() => navigate('/documents/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Sous projet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.dateAdded}</TableCell>
                  <TableCell>{getProjectName(doc.projectId)}</TableCell>
                  <TableCell>{getSubProjectName(doc.subProjectId)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun document trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentsPage;
