
import React from 'react';
import { User } from '@/types/User';

type ProjectMembersListProps = {
  members: User[];
};

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({ members }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
      {members.length > 0 ? (
        members.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            <img 
              src={member.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
              alt={member.name} 
              className="h-20 w-20 rounded-full mb-4 object-cover"
            />
            <h3 className="text-lg font-medium">{member.name} {member.prenom}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          Aucun membre sélectionné pour ce projet
        </div>
      )}
    </div>
  );
};

export default ProjectMembersList;
