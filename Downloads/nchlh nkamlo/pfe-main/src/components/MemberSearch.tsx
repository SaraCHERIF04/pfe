import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { User } from '@/types/User';

interface MemberSearchProps {
  onSelect: (member: User) => void;
  selectedMembers: User[];
  roles?: ('admin' | 'chef' | 'employee' | 'responsable' | 'financier')[];
}

const MemberSearch: React.FC<MemberSearchProps> = ({ 
  onSelect, 
  selectedMembers,
  roles 
}) => {
  const [searchMember, setSearchMember] = useState('');
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = () => {
      try {
        const usersString = localStorage.getItem('users');
        if (usersString) {
          const users = JSON.parse(usersString);
          if (Array.isArray(users)) {
            const selectedMemberIds = new Set(selectedMembers.map(m => m.id));
            let availableUsers = users.filter(user => !selectedMemberIds.has(user.id));
            
            // Filter by roles if specified
            if (roles && roles.length > 0) {
              availableUsers = availableUsers.filter(user => roles.includes(user.role));
            }
            
            setAvailableMembers(availableUsers);
          }
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setAvailableMembers([]);
      }
    };

    loadUsers();
  }, [selectedMembers, roles]);

  const filteredMembers = availableMembers.filter(member =>
    member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    (member.prenom && member.prenom.toLowerCase().includes(searchMember.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchMember}
          onChange={(e) => setSearchMember(e.target.value)}
          placeholder="Rechercher un membre..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="font-medium">{member.name} {member.prenom}</div>
                <Button
                  onClick={() => onSelect(member)}
                  variant="ghost"
                  className="text-[#192759] hover:text-blue-700"
                >
                  Ajouter
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aucun membre trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSearch;
