
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, User, Info, Settings } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" 
            alt="Sonelgaz" 
            className="h-8"
          />
          <div>
            <h1 className="font-bold text-blue-900">SONELGAZ</h1>
            <p className="text-sm text-blue-800">Projects</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        <NavLink 
          to="/admin/users/new" 
          className={({ isActive }) => 
            `flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-100'
            }`
          }
        >
          <User size={20} className="text-blue-800" />
          <span>Gérer Compte</span>
        </NavLink>
        
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-100'
            }`
          }
        >
          <Users size={20} className="text-blue-800" />
          <span>Listes des utilisateurs</span>
        </NavLink>
        
        <NavLink 
          to="/admin/about" 
          className={({ isActive }) => 
            `flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-100'
            }`
          }
        >
          <Info size={20} className="text-blue-800" />
          <span>About US</span>
        </NavLink>
        
        <NavLink 
          to="/admin/parametres" 
          className={({ isActive }) => 
            `flex items-center space-x-3 p-3 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-100'
            }`
          }
        >
          <Settings size={20} className="text-blue-800" />
          <span>Paramètres</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
