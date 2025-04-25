
import React from 'react';

export type SubProject = {
  id: string;
  name: string;
  description: string;
  status: 'En attente' | 'En cours' | 'Terminé';
  daysAgo: number;
  projectId: string;
  startDate?: string;
  endDate?: string;
  members: {
    id: string;
    name?: string;
    avatar: string;
    role?: string;
  }[];
  documentsCount: number;
  documents?: Array<{id: string, title: string, url: string}>;
};

type SubProjectCardProps = {
  subProject: SubProject;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const SubProjectCard: React.FC<SubProjectCardProps> = ({ subProject }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{subProject.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subProject.status)}`}>
          {subProject.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subProject.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-500">{subProject.daysAgo} jours</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {subProject.members.slice(0, 3).map((member, index) => (
              <img 
                key={`${member.id}-${index}`}
                src={member.avatar} 
                alt={member.name || 'member'} 
                className="h-6 w-6 rounded-full border border-white"
              />
            ))}
            {subProject.members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                +{subProject.members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {subProject.documentsCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProjectCard;
