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
  FileText,
  Heart,
  Gift,
  Bell,
  Clock,
  PawPrint,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!user) return null;

  const navItemClass = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border-l-4 ${
      active
        ? 'border-slate-800 bg-slate-100 text-slate-800 font-semibold'
        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
    }`;

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <Link key={item.path} to={item.path} className={navItemClass(active)}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-slate-800' : 'text-slate-500'}`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const Section = ({ title, items }) => (
    <div className="mb-6">
      <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-0.5">{items.map(renderNavItem)}</div>
    </div>
  );

  const SidebarShell = ({ children, bottomCard }) => (
    <aside className="w-64 min-h-screen flex flex-col bg-slate-50/95 border-r border-slate-200">
      <div className="p-5 pb-2">
        <Link to={user.role === 'customer' ? '/customer/dashboard' : user.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'} className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">My Pet Care+</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {children}
      </nav>
      {bottomCard && <div className="p-3 border-t border-slate-200">{bottomCard}</div>}
    </aside>
  );

  // Customer Sidebar
  if (user.role === 'customer') {
    const menuItems = [
      { path: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/customer/pets', label: 'Browse Pets', icon: Heart },
      { path: '/customer/products', label: 'Products', icon: Package },
      { path: '/customer/cart', label: 'Cart', icon: ShoppingCart },
      { path: '/customer/orders', label: 'Orders', icon: FileText },
      { path: '/customer/doctors', label: 'Doctors', icon: Users },
      { path: '/customer/appointments', label: 'Appointments', icon: Calendar },
      { path: '/customer/pet-profiles', label: 'My Pets', icon: Heart },
      { path: '/customer/health-records', label: 'Health Records', icon: FileText },
    ];
    const moreItems = [
      { path: '/customer/exchanges', label: 'Exchanges', icon: Package },
      { path: '/customer/pre-bookings', label: 'Pre-Bookings', icon: Clock },
      { path: '/customer/chat', label: 'Chat', icon: MessageSquare },
      { path: '/customer/feedback', label: 'Feedback', icon: MessageSquare },
      { path: '/customer/notifications', label: 'Notifications', icon: Bell },
      { path: '/customer/offers', label: 'Offers', icon: Gift },
      { path: '/customer/reminders', label: 'Reminders', icon: Clock },
    ];
    const bottomCard = (
      <Link to="/customer/offers" className="block p-4 rounded-2xl bg-sky-50 border border-sky-100">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-sky-600" />
          <span className="font-semibold text-slate-800 text-sm">Offers & loyalty</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">Earn points and get exclusive deals.</p>
        <span className="text-sm font-medium text-slate-700 hover:text-slate-900">View offers</span>
      </Link>
    );
    return (
      <SidebarShell bottomCard={bottomCard}>
        <Section title="Menu" items={menuItems} />
        <Section title="More" items={moreItems} />
      </SidebarShell>
    );
  }

  // Doctor Sidebar
  if (user.role === 'doctor') {
    const menuItems = [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/profile', label: 'Profile', icon: Users },
      { path: '/doctor/schedule', label: 'Schedule', icon: Calendar },
      { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      { path: '/doctor/health-records', label: 'Health Records', icon: FileText },
      { path: '/doctor/chat', label: 'Chat', icon: MessageSquare },
    ];
    return (
      <SidebarShell>
        <Section title="Menu" items={menuItems} />
      </SidebarShell>
    );
  }

  // Admin Sidebar
  if (user.role === 'admin' || user.role === 'staff') {
    const menuItems = [
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
      <SidebarShell>
        <Section title="Menu" items={menuItems} />
      </SidebarShell>
    );
  }

  return null;
};

export default Sidebar;
