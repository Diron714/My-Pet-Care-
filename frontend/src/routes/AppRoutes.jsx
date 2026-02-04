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
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Protected Customer Routes */}
        <Route
          path="/customer/*"
          element={
            <RequireAuth roles={['customer']}>
              <CustomerRoutes />
            </RequireAuth>
          }
        />
        
        {/* Protected Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <RequireAuth roles={['doctor']}>
              <DoctorRoutes />
            </RequireAuth>
          }
        />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth roles={['staff', 'admin']}>
              <AdminRoutes />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

