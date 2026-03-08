import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 relative">
        {isAuthenticated && <Sidebar />}
        <main
          className={`flex-1 relative ${isAuthenticated ? 'p-6 md:p-8 bg-gradient-to-br from-sky-50/50 via-white to-blue-50/30' : 'py-10 px-4 sm:px-6 lg:px-8'}`}
        >
          <div className="max-w-7xl mx-auto relative">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

