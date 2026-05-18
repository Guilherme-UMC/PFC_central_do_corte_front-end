import React, {useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createContext,useContext } from 'react';

const SearchContext = createContext({ search: '', setSearch: () => {} });
export const useSearch = () => useContext(SearchContext);

const RootLayout = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
 
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div className="app">
        <Navbar search={search} onSearchChange={setSearch} />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    </SearchContext.Provider>
  );
};
 
export default RootLayout;