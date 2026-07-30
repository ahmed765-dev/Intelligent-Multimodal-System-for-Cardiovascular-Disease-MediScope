'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import {
  ShieldCheck,
  Activity,
  Play,
  FileVideo,
  ChevronRight,
  Layers,
  Upload,
  RefreshCw,
  Heart,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import bgImg from '@/components/assets/images/ChatGPT Image Feb 21, 2026, 09_46_37 PM.png';

// ── Constants ──────────────────────────────────────────────
const TIMEOUT_MS = 300_000; // 5 minutes
const MAX_RETRIES = 2;

// ── Types ──────────────────────────────────────────────────
type UploadStatus = 'idle' | 'waking' | 'uploading' | 'analyzing' | 'success' | 'error';

const STATUS_MESSAGES: Record<UploadStatus, string> = {
  idle: 'Upload Video File',
  waking: 'Waking up AI server...',
  uploading: 'Uploading video...',
  analyzing: 'Analyzing frames...',
  success: 'Analysis Complete',
  error: 'Analysis Failed',
};

// ── EF Classification ──────────────────────────────────────
function classifyEF(ef: number): { label: string; color: string; bg: string; border: string } {
  if (ef >= 55) return { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  if (ef >= 40) return { label: 'Mildly Reduced', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  return { label: 'Reduced', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
}

// ── Sleep helper ───────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ══════════════════════════════════════════════════════════
export default function EchoVideo() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [efResult, setEfResult] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // ── Fake progress bar ──────────────────────────────────────
  const startFakeProgress = useCallback(() => {
    setProgress(0);
    let val = 0;
    const iv = setInterval(() => {
      const step = val < 30 ? 3 : val < 60 ? 1.5 : val < 85 ? 0.5 : 0.1;
      val = Math.min(val + step, 90);
      setProgress(val);
      if (val >= 90) clearInterval(iv);
    }, 400);
    return iv;
  }, []);

  // ── Core upload + AI call ──────────────────────────────────
  const runAnalysis = useCallback(async (file: File, attempt = 0) => {
    const progressIv = startFakeProgress();

    try {
      // Step 1 — wake up
      setStatus('waking');
      await sleep(1500);

      // Step 2 — upload to backend
      setStatus('uploading');

      const formData = new FormData();
      formData.append('video', file);

      await api.post('/echo/createEchoVideo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: TIMEOUT_MS,
      });

      clearInterval(progressIv);

      // Step 3 — fetch the AI-calculated result for this patient
      setStatus('analyzing');

      const resultRes = await api.get('/result/getByPatient');
      console.log('Result response:', resultRes.data);

      const data = resultRes.data?.data ?? resultRes.data;
      const latest = Array.isArray(data) ? data[data.length - 1] : data;

      const ef = latest?.ef_percentage ?? null;
      const risk =
        ef !== null
          ? ef >= 55
            ? 'LOW'
            : ef >= 40
            ? 'MODERATE'
            : 'HIGH'
          : null;

      setRiskLevel(risk);
      setProgress(100);
      await sleep(400);

      setEfResult(ef);
      setStatus('success');
    } catch (err: any) {
      clearInterval(progressIv);

      // Retry logic
      if (attempt < MAX_RETRIES) {
        setRetryCount(attempt + 1);
        setStatus('waking');
        await sleep(3000);
        return runAnalysis(file, attempt + 1);
      }

      if (err.code === 'ECONNABORTED') {
        setErrorMsg('Request timed out after 5 minutes. Please try a shorter video.');
      } else if (!navigator.onLine) {
        setErrorMsg('No internet connection. Please check your network and try again.');
      } else {
        setErrorMsg(
          `Analysis failed: ${
            err.response?.data?.message ?? err.message ?? 'Unknown error'
          }. Please try again.`
        );
      }
      setStatus('error');
    }
  }, [startFakeProgress]);

  // ── File input handler ─────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEfResult(null);
    setRiskLevel(null);
    setErrorMsg('');
    setRetryCount(0);
    setSelectedFile(file);
    await runAnalysis(file);
  };

  const handleRetry = () => {
    if (!selectedFile) return;
    setErrorMsg('');
    setRetryCount(0);
    runAnalysis(selectedFile);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const isLoading = ['waking', 'uploading', 'analyzing'].includes(status);
  const efInfo = efResult !== null ? classifyEF(efResult) : null;

  return (
    <div className="min-h-screen mesh-gradient flex flex-col font-sans selection:bg-indigo-100">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImg}
            alt="Cardiology Diagnostic Background"
            fill
            className="object-cover scale-105 blur-[2px] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-slate-900/40" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-80px)]">

          {/* ── LEFT: Hero Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full w-fit">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                Next-Gen Diagnostic Suite
              </span>
            </div>

            <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
                Echocardiogram
              </span>{' '}
              <br />
              Analysis
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-medium">
              Transform standard heart ultrasounds into deep biological insights.
              Our proprietary neural network analyzes valve motion and wall
              elasticity with 99.4% precision.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                  <ShieldCheck className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Hi-Res Mapping</h4>
                  <p className="text-slate-500 text-xs">Sub-millimeter tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl group-hover:bg-rose-500/20 transition-colors">
                  <Activity className="text-rose-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Dynamic Flow</h4>
                  <p className="text-slate-500 text-xs">Real-time hemodynamics</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <button
                onClick={() => setShowDemo(true)}
                className="text-white/60 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors group"
              >
                <Play className="fill-white/20 group-hover:fill-white" size={16} /> Watch Demo
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Upload Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-dark rounded-[3rem] p-10 border-white/5 shadow-[0_0_100px_rgba(99,102,241,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 blur-[50px]" />

              <div className="relative z-10 flex flex-col items-center text-center gap-8">

                {/* Icon */}
                <div className="w-24 h-24 rounded-3xl bg-slate-800/50 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                  {isLoading ? (
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full"
                      />
                      <Layers className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={18} />
                    </div>
                  ) : status === 'success' ? (
                    <Heart className="text-emerald-400" size={40} strokeWidth={1.5} />
                  ) : status === 'error' ? (
                    <WifiOff className="text-rose-400" size={40} strokeWidth={1.5} />
                  ) : (
                    <FileVideo size={40} className="text-slate-600 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Diagnostic Gateway</h3>
                  <p className="text-slate-500 text-sm max-w-[280px]">
                    Drag ultrasound recordings here or browse your secure local partition.
                  </p>
                </div>

                {/* Drop zone */}
                <div
                  onClick={isLoading ? undefined : handleUploadClick}
                  className={`w-full border-2 border-dashed rounded-3xl p-12 flex flex-col items-center gap-4 group/box transition-all
                    ${isLoading
                      ? 'border-indigo-500/30 bg-indigo-500/5 cursor-not-allowed'
                      : 'border-slate-700/50 hover:border-indigo-500/40 hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  <div className={`p-4 rounded-2xl transition-all
                    ${isLoading
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800/50 group-hover/box:bg-indigo-500 group-hover/box:text-white text-slate-400'
                    }`}>
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                        <RefreshCw size={24} />
                      </motion.div>
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>

                  <span className={`text-xs font-black uppercase tracking-[0.2em] transition-colors
                    ${isLoading ? 'text-indigo-400' : 'text-slate-500 group-hover/box:text-indigo-400'}`}>
                    {STATUS_MESSAGES[status]}
                  </span>

                  {/* Progress bar */}
                  {isLoading && (
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  )}

                  {/* Retry count */}
                  {retryCount > 0 && isLoading && (
                    <span className="text-[10px] text-slate-600 font-bold">
                      Retry attempt {retryCount}/{MAX_RETRIES}...
                    </span>
                  )}

                  {/* File name */}
                  {selectedFile && !isLoading && status !== 'idle' && (
                    <span className="text-[10px] text-slate-600 font-bold truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  )}
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-3 gap-8 w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase">Max Size</span>
                    <span className="text-sm font-bold text-white">500 MB</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase">Format</span>
                    <span className="text-sm font-bold text-white">MP4 / AVI</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase">Encryption</span>
                    <span className="text-sm font-bold text-white">AES-256</span>
                  </div>
                </div>

                {/* Results / Error */}
                <AnimatePresence mode="wait">
                  {status === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col gap-3"
                    >
                      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-400 text-xs font-bold w-full">
                        {errorMsg}
                      </div>
                      <button
                        onClick={handleRetry}
                        className="w-full bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-colors"
                      >
                        <RefreshCw size={14} /> Try Again
                      </button>
                    </motion.div>
                  )}

                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col gap-3"
                    >
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 text-xs font-bold w-full flex items-center justify-center gap-2">
                        <ShieldCheck size={16} /> Scan Synchronized Successfully
                      </div>

                      {efResult !== null && efInfo && (
                        <div className={`${efInfo.bg} border ${efInfo.border} p-5 rounded-2xl w-full flex flex-col gap-3`}>
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Ejection Fraction
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">Cardiac pumping efficiency</p>
                            </div>
                            <span className={`${efInfo.color} text-3xl font-black`}>
                              {efResult.toFixed(1)}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                efResult >= 55 ? 'bg-emerald-500' :
                                efResult >= 40 ? 'bg-yellow-500' : 'bg-rose-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(efResult, 100)}%` }}
                              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[9px] text-slate-600">0%</span>
                            <span className={`text-[10px] font-black ${efInfo.color}`}>{efInfo.label}</span>
                            <span className="text-[9px] text-slate-600">100%</span>
                          </div>
                        </div>
                      )}

                      {/* Risk Level */}
                      {riskLevel !== null && (
                        <div className={`p-4 rounded-2xl w-full flex items-center justify-between border ${
                          riskLevel === 'LOW'
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : riskLevel === 'MODERATE'
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-rose-500/10 border-rose-500/20'
                        }`}>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Level</p>
                            <p className="text-xs text-slate-400 mt-0.5">Overall cardiac assessment</p>
                          </div>
                          <span className={`text-2xl font-black ${
                            riskLevel === 'LOW' ? 'text-emerald-400'
                            : riskLevel === 'MODERATE' ? 'text-amber-400'
                            : 'text-rose-400'
                          }`}>
                            {riskLevel}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={handleUploadClick}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white/60 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                      >
                        <Upload size={14} /> Scan Another Video
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Loading scan line */}
              {isLoading && (
                <motion.div
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm z-20 pointer-events-none"
                />
              )}
            </div>

            {/* Floating status badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-6 -right-6 glass-dark border-white/10 px-6 py-4 rounded-2xl shadow-2xl z-20 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLoading ? 'bg-indigo-500' : status === 'success' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                      <RefreshCw size={20} className="text-white" />
                    </motion.div>
                  ) : status === 'error' ? (
                    <WifiOff size={20} className="text-white" />
                  ) : (
                    <Activity size={20} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">Network Status</p>
                  <p className="text-sm font-black text-white">
                    {isLoading ? 'PROCESSING...' : status === 'error' ? 'RETRY NEEDED' : 'AI NODES ONLINE'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="video/*"
          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        />
      </main>

      {/* ── Demo Video Modal ── */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            key="demo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X size={20} />
              </button>
              <video
                src="/demo.mp4"
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx global>{`
        .glass-dark {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .mesh-gradient {
          background-color: #020617;
          background-image:
            radial-gradient(at 0% 0%, hsla(244, 55%, 33%, 0.1) 0, transparent 50%),
            radial-gradient(at 50% 0%, hsla(339, 49%, 30%, 0.05) 0, transparent 50%),
            radial-gradient(at 100% 0%, hsla(244, 55%, 33%, 0.1) 0, transparent 50%);
        }
      `}</style>
    </div>
  );
}