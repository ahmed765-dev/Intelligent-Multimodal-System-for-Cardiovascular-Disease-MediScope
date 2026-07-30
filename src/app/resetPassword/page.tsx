'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from '@/components/assets/images/Frame 30.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, Heart, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Password strength
  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(newPassword);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.patch(`/auth/resetPassword/${token}`, { password: newPassword });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
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
              Create New<br />
              <span style={{ background: 'linear-gradient(90deg, #ef5350, #ff8a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Password
              </span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Choose a strong password to keep your health data safe and secure.
            </p>
          </div>

          <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-3xl p-6">
            {[
              'At least 8 characters long',
              'Mix of uppercase & lowercase letters',
              'At least one number',
              'At least one special character',
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span className="text-white/60 text-sm">{tip}</span>
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
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-med-navy flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <Image src={logo} alt="MedScope" width={120} height={38} />
          </div>

          {/* No token warning */}
          {mounted && !token && !success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 flex items-start gap-3 mb-6"
            >
              <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 text-sm font-bold">Invalid Reset Link</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  This link is invalid or has expired.{' '}
                  <button onClick={() => router.push('/forgot-password')} className="font-bold underline">
                    Request a new one
                  </button>
                </p>
              </div>
            </motion.div>
          )}

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
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Password Reset!</h2>
                  <p className="text-slate-500 text-sm">
                    Your password has been changed successfully.
                    <br />
                    <span className="text-slate-400 text-xs">Redirecting to sign in...</span>
                  </p>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className="text-white py-4 px-8 rounded-2xl font-bold text-sm flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
                >
                  Go to Sign In <ArrowRight size={17} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-1.5">Reset Password 🔑</h2>
                  <p className="text-slate-500 text-sm">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* New Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      New Password
                    </label>
                    <div className={`relative rounded-2xl transition-all duration-200 ${focused === 'new' ? 'ring-2 ring-med-navy/20' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'new' ? 'text-med-navy' : 'text-slate-400'}`}>
                        <Lock size={17} />
                      </div>
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setFocused('new')}
                        onBlur={() => setFocused(null)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:bg-white focus:border-med-navy/40"
                        required
                        minLength={8}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {newPassword.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((lvl) => (
                            <div
                              key={lvl}
                              className="h-1 flex-1 rounded-full transition-all duration-300"
                              style={{ background: strength >= lvl ? strengthColors[strength] : '#e2e8f0' }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Confirm Password
                    </label>
                    <div className={`relative rounded-2xl transition-all duration-200 ${focused === 'confirm' ? 'ring-2 ring-med-navy/20' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'confirm' ? 'text-med-navy' : 'text-slate-400'}`}>
                        <Lock size={17} />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocused('confirm')}
                        onBlur={() => setFocused(null)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:bg-white focus:border-med-navy/40"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {/* Match indicator */}
                    {confirmPassword.length > 0 && (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${newPassword === confirmPassword ? 'text-emerald-500' : 'text-red-400'}`}>
                        {newPassword === confirmPassword ? (
                          <><CheckCircle2 size={12} /> Passwords match</>
                        ) : (
                          <><AlertCircle size={12} /> Passwords do not match</>
                        )}
                      </div>
                    )}
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
                    disabled={loading || !token}
                    className="relative overflow-hidden text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>Set New Password <ArrowRight size={17} /></>
                    )}
                  </motion.button>
                </form>
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}