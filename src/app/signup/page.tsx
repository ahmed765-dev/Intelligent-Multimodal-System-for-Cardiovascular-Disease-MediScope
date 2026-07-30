'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/components/assets/images/Frame 30.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Heart,
  Activity, Shield, CheckCircle2, UserPlus, Stethoscope,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─── password strength ─── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ef5350', '#ffa726', '#42a5f5', '#66bb6a'];

/* ─── left panel items ─── */
const TESTIMONIALS = [
  { name: 'Dr. Sarah K.', role: 'Cardiologist', text: 'MedScope transformed how I monitor patients remotely.', rating: 5 },
  { name: 'Ahmed M.', role: 'Patient', text: 'My recovery progress tracked in real time — incredible.', rating: 5 },
];

const STEPS = [
  { num: '01', label: 'Create your account' },
  { num: '02', label: 'Complete health profile' },
  { num: '03', label: 'Connect with specialists' },
];

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (getStrength(form.password) < 2) { setError('Please choose a stronger password.'); return; }
    setLoading(true);
    setError('');
    try {
      await signup(form);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);
  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a237e 50%, #1b5e20 100%)',
        }} />

        {/* Animated blobs */}
        <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #26a69a 0%, transparent 70%)', animation: 'blobPulse 9s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5c6bc0 0%, transparent 70%)', animation: 'blobPulse 11s ease-in-out infinite reverse' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -40 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col gap-10 px-14 max-w-[520px]"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Heart size={20} className="text-emerald-400" />
            </div>
            <Image src={logo} alt="MedScope" width={130} height={42} className="brightness-0 invert" />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Join 50,000+ Patients</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Start Your<br />
              <span style={{ background: 'linear-gradient(90deg, #4db6ac, #80cbc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Health Journey
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Create your account and get access to personalized cardiac monitoring within minutes.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {STEPS.map(({ num, label }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/80 text-xs font-black">{num}</span>
                </div>
                <span className="text-white/70 text-sm">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial carousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 min-h-[110px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                <div className="flex gap-0.5">
                  {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm italic leading-relaxed">
                  "{TESTIMONIALS[testimonialIdx].text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={13} className="text-white/70" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{TESTIMONIALS[testimonialIdx].name}</p>
                    <p className="text-white/40 text-[10px]">{TESTIMONIALS[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="absolute bottom-3 right-4 flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === testimonialIdx ? 'bg-white w-4' : 'bg-white/30'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-white relative overflow-y-auto">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #1a237e 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1b5e20, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[460px] relative z-10 py-6"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-med-navy flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <Image src={logo} alt="MedScope" width={120} height={38} />
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-black text-slate-900 mb-1.5">Create Account </h2>
            <p className="text-slate-500 text-sm">Fill in the details below to get started for free</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Full Name */}
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ahmed Samir"
              icon={<User size={17} />}
              focused={focused === 'name'}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              required
            />

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              icon={<Mail size={17} />}
              focused={focused === 'email'}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              required
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <div className={`relative rounded-2xl transition-all duration-200 ${focused === 'password' ? 'ring-2 ring-med-navy/20' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-med-navy' : 'text-slate-400'}`}>
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:bg-white focus:border-med-navy/40"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-1.5 mt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#e2e8f0' }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
              <div className={`relative rounded-2xl transition-all duration-200 ${focused === 'confirm' ? 'ring-2 ring-med-navy/20' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'confirm' ? 'text-med-navy' : 'text-slate-400'}`}>
                  <Lock size={17} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:bg-white ${
                    form.confirmPassword
                      ? passwordsMatch ? 'border-emerald-300 focus:border-emerald-400' : 'border-red-200 focus:border-red-300'
                      : 'border-slate-200 focus:border-med-navy/40'
                  }`}
                  required
                />
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  {form.confirmPassword && passwordsMatch && (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                </div>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
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

            {/* Terms */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="text-med-navy font-semibold cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-med-navy font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="relative overflow-hidden text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-slate-200 flex-1" />
            <div className="flex items-center gap-3">
              {['HIPAA', 'ISO 27001', 'SSL'].map((b) => (
                <div key={b} className="flex items-center gap-1 text-slate-400">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  <span className="text-[10px] font-semibold">{b}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-med-red font-black hover:underline inline-flex items-center gap-1"
            >
              Sign in <ArrowRight size={13} />
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

/* ─── Reusable Input Field ─── */
function InputField({
  label, name, type, value, onChange, placeholder, icon, focused, onFocus, onBlur, required,
}: {
  label: string; name: string; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; icon: React.ReactNode; focused: boolean;
  onFocus: () => void; onBlur: () => void; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className={`relative rounded-2xl transition-all duration-200 ${focused ? 'ring-2 ring-med-navy/20' : ''}`}>
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-med-navy' : 'text-slate-400'}`}>
          {icon}
        </div>
        <input
          type={type} name={name} value={value} onChange={onChange}
          onFocus={onFocus} onBlur={onBlur}
          placeholder={placeholder} required={required}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:border-med-navy/40"
        />
      </div>
    </div>
  );
}
