'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/components/assets/images/Frame 30.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgetPassword', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a237e 45%, #302b63 100%)' }} />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #e53935 0%, transparent 70%)', animation: 'blobPulse 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #5c6bc0 0%, transparent 70%)', animation: 'blobPulse 12s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -40 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col gap-10 px-16 max-w-[560px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Heart size={20} className="text-red-400" />
            </div>
            <Image src={logo} alt="MedScope" width={140} height={45} className="brightness-0 invert" />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black text-white leading-tight">
              Reset Your<br />
              <span style={{ background: 'linear-gradient(90deg, #ef5350, #ff8a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Password
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Enter your email address and we'll send you a link to reset your password securely.
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
            {[
              { num: '01', text: 'Enter your registered email address' },
              { num: '02', text: 'Check your inbox for a reset link' },
              { num: '03', text: 'Click the link and set a new password' },
            ].map(({ num, text }) => (
              <div key={num} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-xs font-black">{num}</span>
                </div>
                <span className="text-white/60 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative bg-white">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #1a237e 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Back button */}
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-med-navy flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <Image src={logo} alt="MedScope" width={120} height={38} />
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Check your inbox!</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    We sent a password reset link to{' '}
                    <span className="font-bold text-slate-700">{email}</span>.
                    <br />
                    <span className="text-slate-400 text-xs mt-1 block">
                      Didn't receive it? Check your spam folder.
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className="text-white py-4 px-8 rounded-2xl font-bold text-sm flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
                >
                  Back to Sign In <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => { setSuccess(false); setEmail(''); }}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Try a different email
                </button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-1.5">Forgot Password? 🔐</h2>
                  <p className="text-slate-500 text-sm">No worries, we'll send you reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className={`relative rounded-2xl transition-all duration-200 ${emailFocused ? 'ring-2 ring-med-navy/20' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${emailFocused ? 'text-med-navy' : 'text-slate-400'}`}>
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        placeholder="name@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:bg-white focus:border-med-navy/40"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2.5"
                      >
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <span className="text-red-500 text-[10px] font-black">!</span>
                        </div>
                        <p className="text-red-600 text-xs font-medium">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                        Sending...
                      </>
                    ) : (
                      <>Send Reset Link <ArrowRight size={17} /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Remember your password?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="text-med-red font-black hover:underline inline-flex items-center gap-1"
                  >
                    Sign in <ArrowRight size={13} />
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
