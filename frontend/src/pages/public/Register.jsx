import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { registerSchema } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  UserPlus, 
  ArrowRight, 
  Globe, 
  CheckCircle2, 
  Lock,
  Smartphone,
  ChevronDown
} from 'lucide-react';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '' };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { strength, label: labels[strength] };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });

      if (result.success) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/otp-verification', { state: { email: data.email, otpType: 'email_verification' } });
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex bg-white font-sans antialiased">
      {/* Left Side: Cinematic Branding Section - sticky so it doesn't move when scrolling */}
      <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-0 lg:h-screen relative bg-slate-900 flex-col items-center justify-center p-16 overflow-hidden shrink-0">
        {/* Master Theme Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">International Standard Excellence</span>
          </div>
          
          <h1 className="text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9] uppercase">
            MY PET <br /><span className="text-blue-500 text-shadow-glow">CARE+</span>
          </h1>
          
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 max-w-sm">
            Join the world's most sophisticated healthcare ecosystem for specialized pet care.
          </p>

          <div className="grid grid-cols-2 gap-6 w-full text-left">
            <div className="p-7 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
              <ShieldCheck className="w-9 h-9 text-blue-500 mb-4" />
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Encrypted</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">ISO 27001 certified data protection protocols.</p>
            </div>
            <div className="p-7 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
              <CheckCircle2 className="w-9 h-9 text-emerald-500 mb-4" />
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Verified</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">Unified health records for global networks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Pro Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-right-4 duration-700">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block p-4 bg-slate-900 rounded-3xl mb-8 shadow-2xl shadow-blue-900/20">
              <UserPlus className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 uppercase">Enroll</h2>
            <p className="text-blue-700/50 font-black text-[10px] uppercase tracking-[0.25em]">Authorized Registration Portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                {...register('firstName')}
                error={errors.firstName?.message}
                className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('lastName')}
                error={errors.lastName?.message}
                className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
                required
              />
            </div>

            <Input
              label="Email Identity"
              type="email"
              placeholder="identity@global-pet.care"
              {...register('email')}
              error={errors.email?.message}
              className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
              required
            />

            <Input
              label="Contact Number"
              type="tel"
              placeholder="+94 7X XXX XXXX"
              {...register('phone')}
              error={errors.phone?.message}
              className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
              required
            />

            <div className="space-y-2">
              <Input
                label="Security Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
                required
              />
              {password && (
                <div className="px-1 pt-1">
                  <div className="flex gap-1 h-1 rounded-full overflow-hidden bg-slate-200">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 transition-all duration-700 ${
                          step <= passwordStrength.strength
                            ? passwordStrength.strength <= 2 ? 'bg-rose-500' : passwordStrength.strength <= 3 ? 'bg-amber-400' : 'bg-blue-500'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase mt-2 block tracking-widest">{passwordStrength.label} Security Level</span>
                </div>
              )}
            </div>

            <Input
              label="Verify Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 font-semibold text-slate-900 bg-white shadow-sm"
              required
            />

            <div className="space-y-2 w-full">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Permission <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  {...register('role')}
                  className="input-field w-full !rounded-2xl !border-2 !border-slate-200 bg-white focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 !p-4 !pr-12 transition-all font-semibold text-slate-900 outline-none appearance-none cursor-pointer shadow-sm peer"
                >
                  <option value="customer">Customer</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform duration-200 peer-focus:rotate-180 peer-focus:text-blue-500" />
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full !py-5 !rounded-2xl !bg-slate-900 hover:!bg-blue-600 !text-white !font-black !text-xs uppercase !tracking-[0.4em] !shadow-2xl !shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group" 
              loading={loading}
            >
              Initialize Profile <ArrowRight className="w-4 h-4 text-blue-400 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Existing identity?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors border-b-2 border-blue-600/10 ml-1 font-bold">
                Access Gateway
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;