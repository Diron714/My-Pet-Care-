import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/doctor/Dashboard';
import ProfileManagement from '../pages/doctor/ProfileManagement';
import ScheduleManagement from '../pages/doctor/ScheduleManagement';
import Appointments from '../pages/doctor/Appointments';
import AppointmentDetails from '../pages/doctor/AppointmentDetails';
import HealthRecords from '../pages/doctor/HealthRecords';
import HealthRecordForm from '../pages/doctor/HealthRecordForm';
import Chat from '../pages/doctor/Chat';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/doctor/dashboard" element={<Dashboard />} />
      <Route path="/doctor/profile" element={<ProfileManagement />} />
      <Route path="/doctor/schedule" element={<ScheduleManagement />} />
      <Route path="/doctor/appointments" element={<Appointments />} />
      <Route path="/doctor/appointments/:id" element={<AppointmentDetails />} />
      <Route path="/doctor/health-records" element={<HealthRecords />} />
      <Route path="/doctor/health-records/new" element={<HealthRecordForm />} />
      <Route path="/doctor/health-records/:id/edit" element={<HealthRecordForm />} />
      <Route path="/doctor/chat" element={<Chat />} />
      <Route path="/doctor/*" element={<Navigate to="/doctor/dashboard" replace />} />
    </Routes>
  );
};

export default DoctorRoutes;

