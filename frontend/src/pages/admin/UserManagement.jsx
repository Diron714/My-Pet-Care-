import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { ToggleLeft, ToggleRight, Edit, Users, User, Stethoscope, Shield, Search, Filter, RefreshCw, CheckCircle, XCircle, Mail, Calendar, ShieldCheck, UserCheck, UserX, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    verified: '',
    search: '',
  });
  const { user: currentUser } = useAuth();
  const canEditRoles = currentUser?.role === 'admin';

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.verified) params.append('verified', filters.verified);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/admin/users?${params.toString()}`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user.user_id}/status`, {
        is_active: !user.is_active,
      });
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!canEditRoles) {
      toast.error('Only admin users can change roles.');
      return;
    }
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      loadUsers();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to change user roles.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'customer':
        return User;
      case 'doctor':
        return Stethoscope;
      case 'staff':
        return Shield;
      case 'admin':
        return Crown;
      default:
        return User;
    }
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case 'customer':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
        };
      case 'doctor':
        return {
          gradient: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
        };
      case 'staff':
        return {
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
        };
      case 'admin':
        return {
          gradient: 'from-amber-500 to-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
        };
      default:
        return {
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
        };
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) return <Layout><Loading /></Layout>;

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const verifiedUsers = users.filter(u => u.is_verified).length;
  const customers = users.filter(u => u.role === 'customer').length;
  const doctors = users.filter(u => u.role === 'doctor').length;

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage user accounts, roles, and permissions</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</p>
                <p className="text-2xl font-black text-emerald-600">{activeUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Verified</p>
                <p className="text-2xl font-black text-blue-600">{verifiedUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customers</p>
                <p className="text-2xl font-black text-blue-600">{customers}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card card-muted group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctors</p>
                <p className="text-2xl font-black text-emerald-600">{doctors}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="input-field"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ role: '', status: '', verified: '', search: '' })}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {users.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Users}
              title="No users found"
              message="No users match the selected filters"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              const roleStyles = getRoleStyles(user.role);

              return (
                <div
                  key={user.user_id}
                  className={`card hover:shadow-xl transition-all duration-300 border-l-4 ${roleStyles.border}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${roleStyles.gradient} flex items-center justify-center shadow-lg flex-shrink-0 text-white font-bold text-xl`}>
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${roleStyles.bg} ${roleStyles.text} flex items-center gap-1`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${user.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                          }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Joined: {formatDate(user.created_at)}</span>
                    </div>

                    {/* Verification Status */}
                    <div className={`p-3 rounded-xl border ${user.is_verified
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-amber-50 border-amber-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {user.is_verified ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-amber-600" />
                          )}
                          <span className={`text-xs font-semibold ${user.is_verified ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                            {user.is_verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className={`flex-1 ${user.is_active
                            ? '!bg-rose-50 !text-rose-700 hover:!bg-rose-100'
                            : '!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100'
                          }`}
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="w-4 h-4 inline mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 inline mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.user_id, e.target.value)}
                        disabled={!canEditRoles}
                        className={`input-field text-xs !py-2 flex-1 ${roleStyles.bg} ${roleStyles.text} border ${roleStyles.border} ${!canEditRoles ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <option value="customer">Customer</option>
                        <option value="doctor">Doctor</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
