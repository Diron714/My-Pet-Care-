import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from '../components/common/RequireAuth';
import PublicRoutes from './PublicRoutes';
import CustomerRoutes from './CustomerRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes must come before the catch-all so /doctor/* etc. are matched first */}
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
        <Route
          path="/admin/*"
          element={
            <RequireAuth roles={['staff', 'admin']}>
              <AdminRoutes />
            </RequireAuth>
          }
        />
        {/* Public routes last - catch-all /* matches everything not matched above */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

