import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import RequireAuth from '../components/common/RequireAuth';
import Layout from '../components/layout/Layout';
import PublicRoutes from './PublicRoutes';
import CustomerRoutes from './CustomerRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';

// Persistent layout: sidebar/navbar stay mounted; only content (Outlet) changes — smooth tab-like transition
const DashboardShell = () => {
  const location = useLocation();
  return (
    <Layout>
      <div key={location.pathname} className="content-area animate-in fade-in duration-200">
        <Outlet />
      </div>
    </Layout>
  );
};

// Scroll to top on route change so new pages start from the top,
// even if the user clicked a button at the bottom of the previous page.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/customer/*"
          element={
            <RequireAuth roles={['customer']}>
              <CustomerRoutes />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <RequireAuth roles={['doctor']}>
              <DoctorRoutes />
            </RequireAuth>
          }
        />
        {/* Admin: persistent layout so only content area changes on tab/link click */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={['staff', 'admin']}>
              <DashboardShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<AdminRoutes />} />
        </Route>
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

