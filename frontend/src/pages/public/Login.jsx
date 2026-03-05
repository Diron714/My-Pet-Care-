import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { PawPrint, ShieldCheck, Heart, Sparkles, ArrowRight, Globe } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Prevent body scroll so no scrollbar appears on login page
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success && result.user) {
        toast.success('Login successful!');
        setTimeout(() => {
          const role = result.user.role;
          if (role === 'customer') navigate('/customer/dashboard');
          else if (role === 'doctor') navigate('/doctor/dashboard');
          else if (role === 'admin' || role === 'staff') navigate('/admin/dashboard');
          else navigate('/login');
        }, 500);
      } else {
        const errorMsg = result.message || 'Login failed. Please check your credentials.';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-[#F8FAFC] overflow-hidden">
      {/* Left Side: International Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-full relative bg-slate-900 items-center justify-center p-10 overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">International Standard Excellence</span>
          </div>
          
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            MY PET <span className="text-blue-500">CARE+</span>
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed mb-6">
            Global intelligence platform for modern pet health, grooming, and specialized clinical care.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500 group">
              <ShieldCheck className="w-7 h-7 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-1 text-sm">Secure</h4>
              <p className="text-slate-500 text-xs font-medium">World-class encrypted data protection.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 transition-all duration-500 group">
              <Heart className="w-7 h-7 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold mb-1 text-sm">Caring</h4>
              <p className="text-slate-500 text-xs font-medium">Designed for global veterinary standards.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Pro Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-0 overflow-hidden items-center justify-center p-8 lg:p-14 shrink-0">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-right-4 duration-700 flex flex-col justify-center py-2">
          
          <div className="mb-6 text-center lg:text-left shrink-0">
            <div className="inline-block p-3 bg-slate-900 rounded-2xl mb-4 shadow-xl shadow-slate-900/20">
              <PawPrint className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sign in to your global account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 shrink-0">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                error={errors.email?.message}
                className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 transition-all !shadow-none font-semibold text-slate-900"
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="!rounded-2xl !border-slate-200 focus:!border-blue-500 !p-4 transition-all !shadow-none font-semibold text-slate-900"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer group-hover:border-slate-400" />
                  <ShieldCheck className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="ml-3 text-xs font-black text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Remember device</span>
              </label>
              <Link
                to="/forgot-password"
                className="flex items-center text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest border-b-2 border-blue-600/10 hover:border-blue-800/20"
              >
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full !py-4 !rounded-2xl !bg-slate-900 hover:!bg-blue-600 !text-white !font-black !text-sm uppercase !tracking-[0.3em] !shadow-2xl !shadow-slate-200 hover:!shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2" 
              loading={loading}
            >
              Secure Login <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 bg-[#F8FAFC] px-4">New to the network?</div>
            </div>

            <Link 
              to="/register" 
              className="mt-4 flex items-center justify-center w-full py-3.5 rounded-2xl border-2 border-slate-200 font-black text-xs text-slate-600 uppercase tracking-widest hover:bg-white hover:border-slate-400 transition-all"
            >
              Create Account
            </Link>
          </div>

          <p className="mt-5 text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] shrink-0">
            ISO 27001 Certified Gateway | <a href="#" className="text-blue-500 hover:underline">Global Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;