import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main
          className={`flex-1 ${isAuthenticated ? 'p-6 md:p-8' : 'py-10 px-4 sm:px-6 lg:px-8'}`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

