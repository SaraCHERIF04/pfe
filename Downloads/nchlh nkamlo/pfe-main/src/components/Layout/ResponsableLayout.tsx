
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import ResponsableSidebar from './ResponsableSidebar';
import Header from './Header';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchQuery = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchQuery must be used within a SearchProvider');
  }
  return context;
};

const ResponsableLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex h-screen overflow-hidden">
        <ResponsableSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} isResponsable={true} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchContext.Provider>
  );
};

export default ResponsableLayout;
