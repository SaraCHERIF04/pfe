
import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import FinancierSidebar from './FinancierSidebar';
import Header from './Header';

// Create a context for search functionality
export const SearchQueryContext = createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error('useSearchQuery must be used within a SearchQueryProvider');
  }
  return context;
};

const FinancierLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'financier') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex min-h-screen bg-gray-50">
        <FinancierSidebar />
        <div className="flex-1">
          <Header 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
          />
          <main className="px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchQueryContext.Provider>
  );
};

export default FinancierLayout;
