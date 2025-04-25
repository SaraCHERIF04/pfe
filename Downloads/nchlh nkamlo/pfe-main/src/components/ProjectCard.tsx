
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ProjectStatus = 'En cours' | 'Terminé' | 'En attente' | 'Annulé';

type ProjectMember = {
  id: string;
  name: string;
  avatar: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline?: string;
  members: ProjectMember[];
  documentsCount: number;
};

type ProjectCardProps = {
  project: Project;
};

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case 'En cours':
      return 'bg-blue-50 text-blue-600';
    case 'Terminé':
      return 'bg-green-50 text-green-600';
    case 'En attente':
      return 'bg-yellow-50 text-yellow-600';
    case 'Annulé':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-4 flex justify-between">
        <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            getStatusColor(project.status)
          )}
        >
          {project.status}
        </span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{project.description}</p>
      
      {project.deadline && (
        <div className="mb-3 text-xs text-gray-500">
          <span className="font-medium">Date limite:</span> {project.deadline}
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((member) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="h-6 w-6 rounded-full border border-white"
              title={member.name}
            />
          ))}
          {project.members.length > 4 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 text-xs text-gray-600">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-1 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          {project.documentsCount} documents
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Link 
          to={`/project/${project.id}`}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Voir les détails"
        >
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
