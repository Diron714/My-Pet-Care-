import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/customer/Dashboard';
import PetListing from '../pages/customer/PetListing';
import PetDetails from '../pages/customer/PetDetails';
import ProductListing from '../pages/customer/ProductListing';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Orders from '../pages/customer/Orders';
import OrderDetails from '../pages/customer/OrderDetails';
import DoctorList from '../pages/customer/DoctorList';
import DoctorDetails from '../pages/customer/DoctorDetails';
import Appointments from '../pages/customer/Appointments';
import AppointmentDetails from '../pages/customer/AppointmentDetails';
import BookAppointment from '../pages/customer/BookAppointment';
import PetProfiles from '../pages/customer/PetProfiles';
import PetProfileForm from '../pages/customer/PetProfileForm';
import HealthRecords from '../pages/customer/HealthRecords';
import ExchangeRequests from '../pages/customer/ExchangeRequests';
import PreBookings from '../pages/customer/PreBookings';
import Chat from '../pages/customer/Chat';
import Feedback from '../pages/customer/Feedback';
import Notifications from '../pages/customer/Notifications';
import Offers from '../pages/customer/Offers';
import Reminders from '../pages/customer/Reminders';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="pets" element={<PetListing />} />
      <Route path="pets/:id" element={<PetDetails />} />
      <Route path="products" element={<ProductListing />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:id" element={<OrderDetails />} />
      <Route path="doctors" element={<DoctorList />} />
      <Route path="doctors/:id" element={<DoctorDetails />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="appointments/:id" element={<AppointmentDetails />} />
      <Route path="appointments/book" element={<BookAppointment />} />
      <Route path="pet-profiles" element={<PetProfiles />} />
      <Route path="pet-profiles/new" element={<PetProfileForm />} />
      <Route path="pet-profiles/:id/edit" element={<PetProfileForm />} />
      <Route path="health-records" element={<HealthRecords />} />
      <Route path="exchanges" element={<ExchangeRequests />} />
      <Route path="pre-bookings" element={<PreBookings />} />
      <Route path="chat" element={<Chat />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="offers" element={<Offers />} />
      <Route path="reminders" element={<Reminders />} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default CustomerRoutes;

