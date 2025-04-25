
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  FileText, Home, File, Calendar,
  Settings, HelpCircle, Receipt
} from 'lucide-react';

const FinancierSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/financier/dashboard' },
    { icon: FileText, label: 'Projects', path: '/financier/projects' },
    { icon: File, label: 'Documents', path: '/financier/documents' },
    { icon: Receipt, label: 'Factures', path: '/financier/factures' },
    { icon: Calendar, label: 'Réunions', path: '/financier/reunions' },
    { icon: Settings, label: 'Paramètres', path: '/financier/parametres' },
    { icon: HelpCircle, label: 'About', path: '/financier/about' },
  ];

  return (
    <div className="min-w-[250px] bg-white border-r p-4 space-y-4">
      <div className="flex items-center gap-2 p-2">
        <img
          src="/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png"
          alt="Logo"
          className="h-8"
        />
        <div>
          <h2 className="font-bold text-blue-900">SONELGAZ</h2>
          <p className="text-sm text-blue-800">Projects</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
              isActive(item.path) && "bg-blue-50 text-blue-700 font-medium"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default FinancierSidebar;
