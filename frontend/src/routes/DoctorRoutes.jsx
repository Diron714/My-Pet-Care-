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
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<ProfileManagement />} />
      <Route path="schedule" element={<ScheduleManagement />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="appointments/:id" element={<AppointmentDetails />} />
      <Route path="health-records" element={<HealthRecords />} />
      <Route path="health-records/new" element={<HealthRecordForm />} />
      <Route path="health-records/:id/edit" element={<HealthRecordForm />} />
      <Route path="chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default DoctorRoutes;

