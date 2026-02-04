import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Calendar,
  Users,
  MessageSquare,
  MessageCircle,
  Settings,
  FileText,
  Heart,
  Gift,
  Bell,
  Clock,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!user) return null;

  // Customer Sidebar
  if (user.role === 'customer') {
    const customerMenu = [
      { path: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/customer/pets', label: 'Browse Pets', icon: Heart },
      { path: '/customer/products', label: 'Products', icon: Package },
      { path: '/customer/cart', label: 'Cart', icon: ShoppingCart },
      { path: '/customer/orders', label: 'Orders', icon: FileText },
      { path: '/customer/doctors', label: 'Doctors', icon: Users },
      { path: '/customer/appointments', label: 'Appointments', icon: Calendar },
      { path: '/customer/pet-profiles', label: 'My Pets', icon: Heart },
      { path: '/customer/health-records', label: 'Health Records', icon: FileText },
      { path: '/customer/exchanges', label: 'Exchanges', icon: Package },
      { path: '/customer/pre-bookings', label: 'Pre-Bookings', icon: Clock },
      { path: '/customer/chat', label: 'Chat', icon: MessageSquare },
      { path: '/customer/feedback', label: 'Feedback', icon: MessageSquare },
      { path: '/customer/notifications', label: 'Notifications', icon: Bell },
      { path: '/customer/offers', label: 'Offers', icon: Gift },
      { path: '/customer/reminders', label: 'Reminders', icon: Clock },
    ];

    return (
      <aside className="w-64 bg-white/80 backdrop-blur border-r border-slate-100 min-h-screen p-4">
        <nav className="space-y-1">
          {customerMenu.map((item) => {
            const Icon = item.icon;
            return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Doctor Sidebar
  if (user.role === 'doctor') {
    const doctorMenu = [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/profile', label: 'Profile', icon: Users },
      { path: '/doctor/schedule', label: 'Schedule', icon: Calendar },
      { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      { path: '/doctor/health-records', label: 'Health Records', icon: FileText },
      { path: '/doctor/chat', label: 'Chat', icon: MessageSquare },
    ];

    return (
      <aside className="w-64 bg-white/80 backdrop-blur border-r border-slate-100 min-h-screen p-4">
        <nav className="space-y-1">
          {doctorMenu.map((item) => {
            const Icon = item.icon;
            return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Admin Sidebar
  if (user.role === 'admin' || user.role === 'staff') {
    const adminMenu = [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/pets', label: 'Pets', icon: Heart },
      { path: '/admin/products', label: 'Products', icon: Package },
      { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/exchanges', label: 'Exchanges', icon: Package },
      { path: '/admin/pre-bookings', label: 'Pre-Bookings', icon: Clock },
      { path: '/admin/offers', label: 'Offers', icon: Gift },
      { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
      { path: '/admin/notifications', label: 'Notifications', icon: Bell },
      { path: '/admin/reports', label: 'Reports', icon: FileText },
      { path: '/admin/chat', label: 'Chat', icon: MessageCircle },
    ];

    return (
      <aside className="w-64 bg-white/80 backdrop-blur border-r border-slate-100 min-h-screen p-4">
        <nav className="space-y-1">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  return null;
};

export default Sidebar;

