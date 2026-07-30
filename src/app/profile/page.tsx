'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import jsPDF from 'jspdf';
import {
  Heart, Droplets, Activity, AlertCircle, User,
  Bell, Shield, Clock, TrendingUp, Zap,
  FileText, CalendarDays, ChevronRight, Sparkles,
  Flame, Eye, Download, Share2, MoreHorizontal,
  ArrowUpRight, CircleDot, Pill, Stethoscope,
  BarChart3, LineChart, PieChart, Gauge   // ← جديد
} from 'lucide-react';
import Image from 'next/image';
import bodyImg from '@/components/assets/Page-1.png';

/* ────────────────────────── Types ────────────────────────── */
// Shape returned by GET /users/analysis
interface AnalysisResult {
  // CVD Risk record
  cvd_risk_score?: number;        // e.g. 0.37  (multiply × 100 for %)
  risk_level?: string;            // "LOW" | "MODERATE" | "HIGH"
  global_prediction?: string;     // "Heart Disease" | "No Heart Disease"

  // Echo Video record
  ef_percentage?: number;         // e.g. 62.4

  // Patient vitals (may or may not come from this endpoint)
  age?: number;
  gender?: string;
  heartRate?: number;
  bmi?: number;
  bloodSugar?: number;
  cholesterol?: number;
  systolicBP?: number;
  diastolicBP?: number;
  cigarettesPerDay?: number;

  // IDs for reference
  medical_record_id?: number;
  echo_video_id?: number;
}

const FALLBACK: AnalysisResult = {
  heartRate: 72,
  bmi: 24.5,
  bloodSugar: 92,
  cholesterol: 185,
  ef_percentage: 62,
  cvd_risk_score: 0.37,
  risk_level: 'LOW',
  global_prediction: 'No Heart Disease',
  systolicBP: 118,
  diastolicBP: 78,
  cigarettesPerDay: 0,
};

/* ────────────────────────── Helpers ────────────────────────── */
// Convert raw cvd_risk_score (0–1 or 0–100) → integer percent
function toCVDPercent(score?: number): number {
  if (score == null) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
}

/* ────────────────────────── Animated Counter ────────────────────────── */
const AnimatedNumber = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    const dur = duration * 1000;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <span>{displayed}</span>;
};

/* ────────────────────────── Progress Ring ────────────────────────── */
const ProgressRing = ({
  value, max, size = 80, strokeWidth = 6, color, delay = 0,
}: {
  value: number; max: number; size?: number; strokeWidth?: number; color: string; delay?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100" />
      <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
        transition={{ duration: 1.8, delay, ease: 'easeOut' }}
      />
    </svg>
  );
};

/* ────────────────────────── Sparkline ────────────────────────── */
const PATHS = [
  'M0 35 Q 10 30, 20 32 T 40 15 T 60 25 T 80 10 T 100 20',
  'M0 25 Q 15 10, 25 20 T 50 8 T 75 22 T 100 15',
  'M0 30 Q 12 20, 22 28 T 45 12 T 68 20 T 90 8 T 100 18',
];
const Sparkline = ({ color, delay = 0, index = 0 }: { color: string; delay?: number; index?: number }) => (
  <svg viewBox="0 0 100 40" className="w-full h-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay: delay + 0.5 }}
      d={PATHS[index % PATHS.length]} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
    />
  </svg>
);

/* ────────────────────────── Stat Card ────────────────────────── */
const StatCard = ({
  icon, label, value, unit, status, gradient, delay, trend, sparkIndex = 0,
}: {
  icon: React.ReactNode; label: string; value: string | number;
  unit: string; status?: string; gradient: string; delay: number; trend?: string; sparkIndex?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
    className="group relative bg-white rounded-[1.75rem] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] border border-slate-100 hover:border-slate-200/80 transition-all duration-500 overflow-hidden cursor-default"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${gradient}`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-5">
        <div className={`p-3 rounded-2xl ${gradient} bg-opacity-10 flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <ArrowUpRight size={12} />{trend}
          </span>
        )}
      </div>
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">{label}</h3>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{value}</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{unit}</span>
      </div>
      {status && (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mt-2
          ${status === 'Optimal' || status === 'Normal' || status === 'Available' || status === 'Low'
            ? 'text-emerald-600 bg-emerald-50'
            : status === 'Pending' || status === 'Moderate'
            ? 'text-amber-600 bg-amber-50'
            : status === 'High'
            ? 'text-rose-600 bg-rose-50'
            : 'text-blue-600 bg-blue-50'
          }`}>
          <CircleDot size={8} />{status}
        </span>
      )}
      <div className="mt-4">
        <Sparkline
          color={gradient.includes('rose') ? '#f43f5e' : gradient.includes('violet') ? '#8b5cf6' : gradient.includes('amber') ? '#f59e0b' : gradient.includes('sky') ? '#0ea5e9' : '#6366f1'}
          delay={delay}
          index={sparkIndex}
        />
      </div>
    </div>
  </motion.div>
);

/* ────────────────────────── Gauge Chart ────────────────────────── */
const GaugeChart = ({ value, delay }: { value: number; delay: number }) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  const angle = (clamped / 100) * 180 - 90;
  const riskLabel = clamped > 30 ? 'High Risk' : clamped > 15 ? 'Moderate' : 'Low Risk';
  const riskColor = clamped > 30 ? 'bg-red-500' : clamped > 15 ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay }}
      className="relative bg-white rounded-[2rem] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden"
    >
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Cardiovascular</h3>
            <p className="text-xl font-black text-slate-900 mt-0.5">CVD Risk Score</p>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Activity size={18} className="text-indigo-600" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-64 h-36">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              <defs>
                <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <filter id="gauge-glow">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 100 A 80 80 0 0 1 60 50" fill="none" stroke="#10b981" strokeWidth="14" opacity="0.12" strokeLinecap="round" />
              <path d="M 62 48 A 80 80 0 0 1 138 48" fill="none" stroke="#f59e0b" strokeWidth="14" opacity="0.12" />
              <path d="M 140 50 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="14" opacity="0.12" strokeLinecap="round" />
              <motion.path
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: `${(clamped / 100) * 251} 251` }}
                transition={{ duration: 2, delay: delay + 0.3, ease: 'easeOut' }}
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none" stroke="url(#gauge-grad)" strokeWidth="14" strokeLinecap="round"
                filter="url(#gauge-glow)"
              />
              <motion.g
                initial={{ rotate: -90 }}
                animate={{ rotate: angle }}
                transition={{ duration: 2, delay: delay + 0.3, ease: 'easeOut' }}
                style={{ originX: '100px', originY: '100px' }}
              >
                <line x1="100" y1="100" x2="100" y2="38" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="100" cy="100" r="7" fill="#1e293b" />
                <circle cx="100" cy="100" r="3" fill="white" />
              </motion.g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pt-14">
              <div className="text-center">
                <span className="text-4xl font-black text-slate-900 tabular-nums">
                  <AnimatedNumber value={clamped} duration={2} />
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">% Risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 1.5 }}
            className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white ${riskColor} ${clamped > 30 ? 'animate-pulse shadow-lg shadow-red-200' : ''}`}
          >
            {riskLabel}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ────────────────────────── Quick Info Card ────────────────────────── */
const QuickInfoRow = ({ label, value, unit, accent }: {
  label: string; value: string | number; unit?: string; accent: string;
}) => (
  <div className={`p-4 rounded-2xl bg-gradient-to-br ${accent} border border-slate-100/60`}>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] block mb-1">{label}</span>
    <div className="text-2xl font-black text-slate-900 tabular-nums">
      {value}
      {unit && <span className="text-xs font-bold text-slate-400 ml-1">{unit}</span>}
    </div>
  </div>
);

/* ────────────────────────── Tab Buttons ────────────────────────── */
const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={15} /> },
  { id: 'analytics', label: 'Analytics', icon: <LineChart size={15} /> },
  { id: 'history', label: 'History', icon: <Clock size={15} /> },
];

/* ────────────────────────── Page Header ────────────────────────── */
const PageHeader = ({
  userName, userEmail, onExport,
}: { userName: string; userEmail: string; onExport: () => void }) => (
  <motion.header
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative mb-10 overflow-hidden"
  >
    <div className="relative bg-gradient-to-br from-[#1a1f3a] via-[#1e2444] to-[#252b52] rounded-[2.5rem] px-8 md:px-12 py-10 overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-rose-500/10 rounded-full blur-[80px]" />
      <div className="absolute right-1/3 top-0 w-40 h-40 bg-violet-500/10 rounded-full blur-[60px]" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="relative"
          >
            <div className="w-[5.5rem] h-[5.5rem] rounded-[1.6rem] bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-500 p-[3px] shadow-xl shadow-indigo-500/30">
              <div className="w-full h-full rounded-[1.4rem] bg-[#1e2444] flex items-center justify-center overflow-hidden border-2 border-white/10">
                <span className="text-3xl font-black bg-gradient-to-br from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  {userName ? userName.slice(0, 2).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-[3px] border-[#1e2444] shadow-lg shadow-emerald-400/40"
            />
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5"
            >
              {userName || 'Patient'}
              <motion.div whileHover={{ rotate: 15, scale: 1.2 }}>
                <Shield className="text-indigo-400 w-5 h-5 fill-indigo-400/20" strokeWidth={2.5} />
              </motion.div>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                <User size={13} className="text-slate-500" /> Active Patient
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </span>
              {userEmail && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                  <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
                </>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <button className="p-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-2xl transition-all duration-300 group">
            <Bell size={18} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <button className="p-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-2xl transition-all duration-300 group">
            <Share2 size={18} className="text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.97]"
          >
            <Download size={16} /> Export Report
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/[0.06]"
      >
        {[
          { label: 'Total Checkups', value: '24', icon: <Stethoscope size={14} /> },
          { label: 'Last Visit', value: 'May 18', icon: <CalendarDays size={14} /> },
          { label: 'Health Score', value: '92%', icon: <TrendingUp size={14} /> },
          { label: 'Active Plans', value: '3', icon: <FileText size={14} /> },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 group cursor-default">
            <div className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.06] group-hover:bg-white/[0.1] transition-colors">
              <span className="text-indigo-400">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">{stat.label}</p>
              <p className="text-lg font-black text-white tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.header>
);

/* ════════════════════════════════════════════════════════════════
                          MAIN PROFILE PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

 useEffect(() => {
  if (user === undefined) return;

  const fetchResult = async () => {
    try {
      const res = await api.get('/result/getByPatient');
      const arr = res.data?.data ?? [];
      const record = arr[0] ?? null;

      if (record?.medical_record_id) {
        try {
          const medRes = await api.get(`/medical/getMedicalRecord/${record.medical_record_id}`);
          console.log('MEDICAL RECORD =>', medRes.data);
          const med = medRes.data?.data ?? medRes.data;

          setData({
            ...record,
            systolicBP: med?.sysBP ?? med?.systolicBP,
            diastolicBP: med?.diaBP ?? med?.diastolicBP,
          });
        } catch (medErr) {
          console.error('Medical record fetch error:', medErr);
          setData(record);
        }
      } else {
        setData(record);
      }
    } catch (err: any) {
      console.error('Result fetch error:', err);
      setError('Could not load latest analysis — showing cached data.');
      setData(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, [user]);

  // Derived display values
  const cvdPercent = toCVDPercent(data?.cvd_risk_score);
  const efValue = data?.ef_percentage != null ? Math.round(data.ef_percentage) : '—';
  const riskLabel = data?.risk_level
    ? data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1).toLowerCase()
    : '—';
  const predictionPercent = data?.global_prediction != null
  ? toCVDPercent(Number(data.global_prediction))
  : null;
const predictionValue = predictionPercent != null ? predictionPercent : '—';
const predictionStatus = predictionPercent != null
  ? (predictionPercent >= 60 ? 'High' : predictionPercent >= 30 ? 'Moderate' : 'Low')
  : 'Pending';
  const smokingProgress = data?.cigarettesPerDay != null
    ? Math.max(0, 100 - data.cigarettesPerDay * 5)
    : 100;

  // Pulse Pressure = Systolic BP − Diastolic BP
  const pulsePressure = (data?.systolicBP != null && data?.diastolicBP != null)
    ? data.systolicBP - data.diastolicBP
    : '—';
  const pulsePressureStatus = typeof pulsePressure === 'number'
    ? (pulsePressure < 25 ? 'Low' : pulsePressure <= 60 ? 'Normal' : 'High')
    : 'Pending';

  /* ── Export Report as PDF ───────────────────────────────── */
  const handleExportReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 22;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Patient Health Report', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += 12;

    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    // Patient info
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Patient Information', 15, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Name: ${user?.name || '—'}`, 15, y);
    y += 7;
    doc.text(`Email: ${user?.email || '—'}`, 15, y);
    y += 12;

    // Health metrics
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Health Metrics', 15, y);
    y += 9;

    const rows: [string, string][] = [
      ['Ejection Fraction', `${efValue}${data?.ef_percentage != null ? '%' : ''}`],
      ['CVD Risk Score', `${cvdPercent}%`],
      ['Risk Level', riskLabel],
      ['Global Prediction', `${predictionValue}${predictionPercent != null ? '%' : ''}`],
      ['Pulse Pressure', `${pulsePressure}${pulsePressure !== '—' ? ' mmHg' : ''}`],
      ['Systolic BP', data?.systolicBP != null ? `${data.systolicBP} mmHg` : '—'],
      ['Diastolic BP', data?.diastolicBP != null ? `${data.diastolicBP} mmHg` : '—'],
      ['Cigarettes / Day', data?.cigarettesPerDay != null ? `${data.cigarettesPerDay}` : '—'],
    ];

    doc.setFontSize(11);
    rows.forEach(([label, value], idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(248, 249, 251);
        doc.rect(13, y - 5.5, pageWidth - 26, 9, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(label, 17, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(String(value), 100, y);
      y += 9;
    });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y, pageWidth - 15, y);

    // Footer disclaimer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This report is auto-generated and should not replace professional medical advice.',
      pageWidth / 2,
      285,
      { align: 'center' }
    );

    const safeName = (user?.name || 'patient').trim().replace(/\s+/g, '_');
    doc.save(`${safeName}_health_report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-200/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-rose-200/10 rounded-full blur-[80px]" />
      </div>

      <main className="flex-1 px-4 sm:px-6 md:px-12 py-8 max-w-[1400px] mx-auto w-full">
        <PageHeader
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          onExport={handleExportReport}
        />

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2.5 bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold px-5 py-3.5 rounded-2xl"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-100 w-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            /* ── Loading ── */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[500px]"
            >
              <div className="relative">
                <div className="w-20 h-20 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={26} className="text-indigo-500 animate-pulse" />
                </div>
              </div>
              <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                Analyzing Biometric Data
              </p>
              <div className="flex gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── Dashboard ── */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >

              {/* ── Left Column ── */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                {/* Ejection Fraction */}
                <StatCard
                  icon={<Activity size={20} className="text-rose-500" />}
                  label="Ejection Fraction"
                  value={efValue}
                  unit="%"
                  status={data?.ef_percentage != null ? 'Available' : 'Pending'}
                  gradient="bg-gradient-to-br from-rose-50 to-rose-100/50"
                  delay={0.1}
                  trend="+2.1%"
                  sparkIndex={0}
                />

                {/* Global Prediction */}
               <StatCard
  icon={<Heart size={20} className="text-violet-500" />}
  label="Global Prediction"
  value={predictionValue}
  unit={predictionPercent != null ? '%' : ''}
  status={predictionStatus}
  gradient="bg-gradient-to-br from-violet-50 to-violet-100/50"
  delay={0.2}
  sparkIndex={1}
/>

                {/* Pulse Pressure */}
                <StatCard
                  icon={<Gauge size={20} className="text-amber-500" />}
                  label="Pulse Pressure"
                  value={pulsePressure}
                  unit={pulsePressure !== '—' ? 'mmHg' : ''}
                  status={pulsePressureStatus}
                  gradient="bg-gradient-to-br from-amber-50 to-amber-100/50"
                  delay={0.3}
                  sparkIndex={2}
                />
              </div>

              {/* ── Middle Column ── */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* CVD Gauge */}
                <GaugeChart value={cvdPercent} delay={0.15} />

                {/* Quick Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="bg-white rounded-[2rem] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-500" />
                      Quick Insights
                    </h3>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreHorizontal size={16} className="text-slate-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <QuickInfoRow
                      label="CVD Score"
                      value={data?.cvd_risk_score != null ? `${cvdPercent}%` : '—'}
                      accent="from-slate-50 to-slate-100/30"
                    />
                    <QuickInfoRow
                      label="Risk Level"
                      value={riskLabel}
                      accent="from-indigo-50/60 to-indigo-100/30"
                    />
                    <QuickInfoRow
                      label="EF %"
                      value={efValue}
                      unit={data?.ef_percentage != null ? '%' : ''}
                      accent="from-slate-50 to-slate-100/30"
                    />
                  </div>
                </motion.div>

                
              </div>

              {/* ── Right Column: Body Mapping ── */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#12152a] via-[#171b34] to-[#1d2140] rounded-[2.5rem] p-8 text-white relative flex flex-col shadow-2xl shadow-indigo-950/20 overflow-hidden h-full"
                >
                  <div className="absolute -right-24 -top-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
                  <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-rose-500/8 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute right-1/3 bottom-1/3 w-32 h-32 bg-violet-500/10 rounded-full blur-[50px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                          <Eye size={12} /> Body Mapping
                        </h3>
                        <p className="text-2xl font-black text-white">Digital Twin</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 bg-white/[0.06] rounded-2xl border border-white/[0.06] backdrop-blur-lg cursor-pointer hover:bg-white/[0.1] transition-colors"
                      >
                        <Activity className="text-indigo-400" size={18} />
                      </motion.div>
                    </div>

                    {/* Body image */}
                    <div className="flex-1 flex items-center justify-center my-4 relative min-h-[280px]">
                      <motion.div
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent z-20"
                      />
                      <Image
                        src={bodyImg}
                        alt="Body mapping digital twin"
                        className="w-44 h-auto object-contain z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-transform duration-700 hover:scale-110"
                      />

                     
                    </div>

                    {/* Bottom section */}
                    <div className="mt-auto space-y-5 pt-6 border-t border-white/[0.04]">
                      {/* Smoking / cigarettes */}
                      <div>
                        <div className="flex justify-between mb-2.5">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Flame size={10} className="text-amber-400" /> Smoking Control
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${smokingProgress === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {smokingProgress === 100 ? 'Non-Smoker' : `${data?.cigarettesPerDay} cig/day`}
                          </span>
                        </div>
                        <div className="w-full bg-white/[0.04] rounded-full h-2.5 p-0.5 border border-white/[0.06]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${smokingProgress}%` }}
                            transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
                            className={`h-full rounded-full ${smokingProgress === 100
                              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'bg-gradient-to-r from-amber-500 to-orange-400'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-white/15">
                          <span>0% Risk</span>
                          <span className="text-white/30">{data?.cigarettesPerDay ?? 0} cig/day</span>
                        </div>
                      </div>

                      {/* Quick stat pills */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm">
                          <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] block mb-1">CVD Risk</span>
                          <span className={`text-xl font-black tabular-nums ${cvdPercent > 30 ? 'text-rose-400' : cvdPercent > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {cvdPercent}<span className="text-xs text-white/20 ml-0.5">%</span>
                          </span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl backdrop-blur-sm">
                          <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] block mb-1">EF Score</span>
                          <span className="text-xl font-black text-indigo-400 tabular-nums">
                            {efValue}{data?.ef_percentage != null && <span className="text-xs text-white/20 ml-0.5">%</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}