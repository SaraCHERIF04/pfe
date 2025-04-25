import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, AlertTriangle, ShoppingBag, BarChart, Info, Receipt } from 'lucide-react';

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

const EmployeeSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/employee/dashboard',
      icon: (
        <BarChart size={20} />
      ),
    },
    {
      name: 'Projets',
      path: '/employee/projects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'Sous-projets',
      path: '/employee/sous-projets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'Documents',
      path: '/employee/documents',
      icon: (
        <FileText size={20} />
      ),
    },
    {
      name: 'Réunions',
      path: '/employee/reunions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Incidents',
      path: '/employee/incidents',
      icon: (
        <AlertTriangle size={20} />
      ),
    },
    {
      name: 'Maître d\'ouvrage',
      path: '/employee/maitre-ouvrage',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Marché',
      path: '/employee/marche',
      icon: (
        <ShoppingBag size={20} />
      ),
    },
    {
      name: 'À propos',
      path: '/employee/about',
      icon: (
        <Info size={20} />
      ),
    },
    {
      name: 'Factures',
      path: '/employee/factures',
      icon: (
        <Receipt size={20} />
      ),
    },
  ];

  return (
    <aside className="min-h-screen w-[200px] border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-center border-b">
        <Link to="/employee" className="flex items-center gap-2">
          <img src="/public/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" alt="Sonelgaz Logo" className="h-10" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-[#192759]">SONELGAZ</span>
            <span className="text-xs text-gray-600">Employé</span>
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

export default EmployeeSidebar;
