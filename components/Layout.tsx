import React from 'react';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  // Don't show Navbar/Footer on Admin Dashboard or Login
  const isSpecialPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  if (isSpecialPage) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;