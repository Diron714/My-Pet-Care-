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
    `flex items-center gap-3 pl-4 pr-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
      active
        ? 'bg-white/[0.12] text-white'
        : 'text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
    }`;

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`${navItemClass(active)} group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
        )}
        <Icon
          className={`w-5 h-5 flex-shrink-0 transition-colors ${
            active ? 'text-violet-300' : 'text-slate-500 group-hover/item:text-slate-300'
          }`}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const Section = ({ title, items }) => (
    <div className="mb-6">
      <p className="px-4 mb-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
        {title}
      </p>
      <div className="space-y-1">{items.map(renderNavItem)}</div>
    </div>
  );

  const SidebarShell = ({ children, bottomCard }) => (
    <aside className="w-[260px] min-h-screen flex flex-col bg-slate-900 border-r border-slate-800/80 shadow-[4px_0_32px_rgba(0,0,0,0.15)] [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.3)_transparent]">
      <div className="shrink-0 p-5 pb-4 border-b border-slate-800/80">
        <Link
          to={
            user.role === 'customer'
              ? '/customer/dashboard'
              : user.role === 'doctor'
                ? '/doctor/dashboard'
                : '/admin/dashboard'
          }
          className="flex items-center gap-3 rounded-xl p-2.5 -m-2.5 hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/25 ring-1 ring-white/20">
            <PawPrint className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">
            My Pet Care+
          </span>
        </Link>
      </div>
      <nav className="flex-1 min-h-0 px-3 py-5 overflow-y-auto">
        {children}
      </nav>
      {bottomCard && (
        <div className="shrink-0 p-4 border-t border-slate-800/80 bg-slate-800/40">
          {bottomCard}
        </div>
      )}
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
      <Link
        to="/customer/offers"
        className="block p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:from-violet-500/20 hover:to-violet-600/10 hover:border-violet-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-amber-500/25 flex items-center justify-center ring-1 ring-amber-400/20">
            <Gift className="w-4 h-4 text-amber-300" />
          </div>
          <span className="font-semibold text-white text-sm">Offers & loyalty</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">Earn points and get exclusive deals.</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-300">
          View offers
          <span className="opacity-80">→</span>
        </span>
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
