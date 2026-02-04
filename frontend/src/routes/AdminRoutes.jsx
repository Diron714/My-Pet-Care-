import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import PetManagement from '../pages/admin/PetManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import UserManagement from '../pages/admin/UserManagement';
import ExchangeManagement from '../pages/admin/ExchangeManagement';
import PreBookingManagement from '../pages/admin/PreBookingManagement';
import OfferManagement from '../pages/admin/OfferManagement';
import FeedbackModeration from '../pages/admin/FeedbackModeration';
import NotificationManagement from '../pages/admin/NotificationManagement';
import Reports from '../pages/admin/Reports';
import Chat from '../pages/admin/Chat';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pets" element={<PetManagement />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/exchanges" element={<ExchangeManagement />} />
      <Route path="/pre-bookings" element={<PreBookingManagement />} />
      <Route path="/offers" element={<OfferManagement />} />
      <Route path="/feedback" element={<FeedbackModeration />} />
      <Route path="/notifications" element={<NotificationManagement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;

