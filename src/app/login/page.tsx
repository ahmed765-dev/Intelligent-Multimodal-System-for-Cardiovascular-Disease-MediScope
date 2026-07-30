'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/components/assets/images/Frame 30.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Activity,
  Shield, Stethoscope, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FEATURES = [
  { icon: Shield, text: 'HIPAA-Compliant & Secure' },
  { icon: Activity, text: 'Real-Time Health Monitoring' },
  { icon: Stethoscope, text: 'Expert Cardiology Team' },
];

const STATS = [
  { value: '50K+', label: 'Patients Served' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' },
];

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a237e 45%, #302b63 100%)',
        }} />

        {/* Animated blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #e53935 0%, transparent 70%)', animation: 'blobPulse 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #5c6bc0 0%, transparent 70%)', animation: 'blobPulse 12s ease-in-out infinite reverse' }} />
        <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e53935 0%, transparent 70%)', animation: 'blobPulse 10s ease-in-out infinite 2s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col gap-12 px-16 max-w-[560px]"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Heart size={20} className="text-red-400" />
            </div>
            <Image src={logo} alt="MedScope" width={140} height={45} className="brightness-0 invert" />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Advanced Cardiac Care</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Your Health,<br />
              <span style={{ background: 'linear-gradient(90deg, #ef5350, #ff8a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Our Priority
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Access your personalized cardiovascular health dashboard and connect with expert cardiologists from anywhere.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-red-300" />
                </div>
                <span className="text-white/70 text-sm">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex flex-col gap-1 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4"
              >
                <span className="text-2xl font-black text-white">{value}</span>
                <span className="text-white/40 text-xs">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #1a237e 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Top-right corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #e53935, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-med-navy flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <Image src={logo} alt="MedScope" width={120} height={38} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-1.5">Welcome back </h2>
            <p className="text-slate-500 text-sm">Sign in to access your health dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <div className={`relative rounded-2xl transition-all duration-200 ${emailFocused ? 'ring-2 ring-med-navy/20' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${emailFocused ? 'text-med-navy' : 'text-slate-400'}`}>
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:border-med-navy/40"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
  type="button"
  onClick={() => router.push('/forgot-password')}
  className="text-[11px] font-bold text-med-red hover:text-red-700 transition-colors"
>
  Forgot password?
</button>
              </div>
              <div className={`relative rounded-2xl transition-all duration-200 ${passwordFocused ? 'ring-2 ring-med-navy/20' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${passwordFocused ? 'text-med-navy' : 'text-slate-400'}`}>
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:border-med-navy/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-[10px] font-black">!</span>
                  </div>
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="relative overflow-hidden text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
            >
              {/* Shimmer */}
              {!loading && (
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)' }} />
              )}
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {['HIPAA', 'ISO 27001', 'SSL Secured'].map((badge) => (
              <div key={badge} className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[10px] font-semibold">{badge}</span>
              </div>
            ))}
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-med-red font-black hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Create one <ArrowRight size={13} />
            </button>
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blobPulse {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.08) translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
