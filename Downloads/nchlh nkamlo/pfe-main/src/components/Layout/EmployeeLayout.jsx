
import React, { useState } from 'react';
import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import Header from './Header';

const EmployeeLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Verify user is logged in as employee, if not redirect to login
  React.useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'employee') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />
      <div className="flex-1">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          isEmployee={true} 
        />
        <main className="px-6 py-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export function useSearchQuery() {
  return useOutletContext();
}

export default EmployeeLayout;
