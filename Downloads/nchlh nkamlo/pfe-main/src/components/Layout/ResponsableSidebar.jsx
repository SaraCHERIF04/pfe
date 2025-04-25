
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, AlertTriangle, Settings, Info } from 'lucide-react';

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

const ResponsableSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/responsable/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'Incidents',
      path: '/responsable/incidents',
      icon: <AlertTriangle size={20} />
    },
    {
      name: 'Paramètres',
      path: '/responsable/parametres',
      icon: <Settings size={20} />
    },
    {
      name: 'About Us',
      path: '/responsable/about',
      icon: <Info size={20} />
    }
  ];

  return (
    <aside className="min-h-screen w-[200px] border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/responsable" className="flex items-center gap-2">
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
            active={location.pathname.startsWith(item.path)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default ResponsableSidebar;
