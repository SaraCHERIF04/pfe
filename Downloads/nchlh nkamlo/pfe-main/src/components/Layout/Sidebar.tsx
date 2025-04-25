import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, AlertTriangle, Users, Building, ShoppingBag, CalendarDays, Settings, Info, BarChart, Receipt } from 'lucide-react';

const SidebarMenuItem = ({ item, active }) => {
  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 transition-all',
        active
          ? 'bg-[#192759] text-white'
          : 'text-gray-600 hover:bg-blue-50 hover:text-[#192759]'
      )}
    >
      <div className={cn('flex h-6 w-6 items-center justify-center', active ? 'text-white' : 'text-gray-500')}>
        {item.icon}
      </div>
      <span className={active ? 'font-medium' : 'font-normal'}>{item.name}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Projets',
      path: '/project',
      icon: <FileText size={20} />,
    },
    {
      name: 'Sous-projet',
      path: '/sous-projet',
      icon: <FileText size={20} />,
    },
    {
      name: 'Incidents',
      path: '/incidents',
      icon: <AlertTriangle size={20} />,
    },
    {
      name: 'Documents',
      path: '/documents',
      icon: <FileText size={20} />,
    },
    {
      name: 'Réunion',
      path: '/reunion',
      icon: <CalendarDays size={20} />,
    },
    {
      name: 'Marché',
      path: '/marche',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Factures',
      path: '/factures',
      icon: <Receipt size={20} />,
    },
    {
      name: 'Paramètres',
      path: '/parametres',
      icon: <Settings size={20} />,
    },
    {
      name: 'About US',
      path: '/about',
      icon: <Info size={20} />,
    }
  ];

  const isActive = (item) => {
    if (item.path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname.includes('/dashboard'))) {
      return true;
    }
    
    // For project-related pages
    if (item.path === '/project' && 
        (location.pathname.startsWith('/project') || 
         location.pathname === '/')) {
      return true;
    }
    
    // For sous-projet-related pages
    if (item.path === '/sous-projet' && location.pathname.startsWith('/sous-projet')) {
      return true;
    }
    
    return location.pathname === item.path;
  };

  return (
    <aside className="min-h-screen w-[200px] border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <img src="/public/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" alt="Sonelgaz Logo" className="h-10" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-[#192759]">SONELGAZ</span>
            <span className="text-xs text-gray-600">Projects</span>
          </div>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.path}
            item={item}
            active={isActive(item)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
