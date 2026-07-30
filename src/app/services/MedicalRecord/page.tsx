'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Activity,
  Cigarette,
  Pill,
  Gauge,
  Syringe,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

export default function MedicalRecord() {
  // ── State ──────────────────────────────────────────────
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [currentSmoker, setCurrentSmoker] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [bpMeds, setBpMeds] = useState(false);
  const [prevalentHyp, setPrevalentHyp] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<null | {
    score: number;
    risk: string;
    color: string;
    pulsePressure: number;
  }>(null);
  const [scoreError, setScoreError] = useState('');

  // ── Calculate Score ────────────────────────────────────
  const handleCalculateScore = async () => {
    if (!gender || !age || !systolicBP || !diastolicBP) return;

    setScoreLoading(true);
    setScoreResult(null);
    setScoreError('');

    const payload = {
      male: gender === 'male' ? 1 : 0,
      age: Number(age),
      currentSmoker: currentSmoker ? 1 : 0,
      BPMeds: bpMeds ? 1 : 0,
      prevalentHyp: prevalentHyp ? 1 : 0,
      diabetes: diabetes ? 1 : 0,
      sysBP: Number(systolicBP),
      diaBP: Number(diastolicBP),
    };

    try {
      // 1) Save the medical record
      await api.post('/medical/createMedicalRecord', payload);

      // 2) Fetch the AI-calculated result for this patient (auth via JWT)
      const resultRes = await api.get('/result/getByPatient');
      console.log('Result response:', resultRes.data);

      const data = resultRes.data?.data ?? resultRes.data;
      const latest = Array.isArray(data) ? data[data.length - 1] : data;

     const rawScore = latest?.cvd_risk_score ?? 0;
const numScore = Math.min(100, Math.max(0, Math.round(Number(rawScore) * 100)));

      // Prefer pulse pressure returned from the backend; fall back to local calculation
      const pulsePressure =
        latest?.pulse_pressure ?? Number(systolicBP) - Number(diastolicBP);

      const risk =
        numScore <= 15 ? 'Low Risk' : numScore <= 30 ? 'Moderate Risk' : 'High Risk';

      const color =
        numScore <= 15 ? '#10b981' : numScore <= 30 ? '#f59e0b' : '#ef4444';

      setScoreResult({ score: numScore, risk, color, pulsePressure: Number(pulsePressure) });
    } catch (err: any) {
      console.error('API error:', err);
      setScoreError('Analysis failed. Please try again.');
    } finally {
      setScoreLoading(false);
    }
  };

  // ── Lifestyle Factors Config ───────────────────────────
  const lifestyleFactors = [
    {
      id: 'smoker',
      label: 'Current Smoker',
      icon: <Cigarette size={18} />,
      color:
        'from-orange-500/20 to-red-500/20 border-orange-300/50 text-orange-600',
      checked: currentSmoker,
      onChange: () => setCurrentSmoker((p) => !p),
    },
    {
      id: 'diabetes',
      label: 'Diabetes',
      icon: <Syringe size={18} />,
      color:
        'from-violet-500/20 to-purple-500/20 border-violet-300/50 text-violet-600',
      checked: diabetes,
      onChange: () => setDiabetes((p) => !p),
    },
    {
      id: 'bpmeds',
      label: 'BP Medications',
      icon: <Pill size={18} />,
      color:
        'from-blue-500/20 to-cyan-500/20 border-blue-300/50 text-blue-600',
      checked: bpMeds,
      onChange: () => setBpMeds((p) => !p),
    },
    {
      id: 'hypertension',
      label: 'Prevalent Hypertension',
      icon: <Gauge size={18} />,
      color:
        'from-rose-500/20 to-pink-500/20 border-rose-300/50 text-rose-600',
      checked: prevalentHyp,
      onChange: () => setPrevalentHyp((p) => !p),
    },
  ];

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      <Navbar />

      <main className="flex-1">
        {/* ── Lifestyle Score Section ── */}
        <section
          className="relative py-24 px-6 lg:px-12 overflow-hidden"
          style={{
            background:
              'linear-gradient(160deg, #dbeeff 0%, #eaf4ff 40%, #d0e8ff 100%)',
          }}
        >
          {/* Ambient blobs */}
          <div
            className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
            }}
          />

          <div className="max-w-3xl mx-auto relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/25 text-blue-700 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                <Activity size={13} />
                AI-Powered Cardiovascular Risk Engine
              </span>
            </motion.div>

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow:
                  '0 24px 80px rgba(30,80,180,0.14), 0 2px 8px rgba(30,80,180,0.06)',
              }}
            >
              {/* Blue header */}
              <div
                className="flex items-center gap-3 px-8 py-5"
                style={{
                  background:
                    'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Heart
                    size={19}
                    className="text-white"
                    fill="white"
                    fillOpacity={0.85}
                  />
                </div>
                <h2 className="text-white font-black text-lg leading-tight tracking-tight">
                  Calculate Lifestyle Score
                </h2>
              </div>

              {/* White body */}
              <div className="bg-white px-8 pt-6 pb-8">
                <p className="text-slate-600 text-[13px] font-bold mb-6 text-center tracking-wide">
                  Cardiovascular Health Profile
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                  {/* ── LEFT: Vitals ── */}
                  <div className="divide-y divide-slate-100">
                    {/* Gender */}
                    <div className="flex items-center gap-3 py-4">
                      <span className="w-32 flex-shrink-0 text-slate-800 text-sm font-bold flex items-center gap-1.5">
                        <span className="text-base">⚥</span> Gender
                      </span>
                      <div className="flex gap-4">
                        {(['male', 'female'] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className="flex items-center gap-2 group"
                          >
                            <span
                              className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                gender === g
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-slate-300 bg-white group-hover:border-blue-400'
                              }`}
                            >
                              {gender === g && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-[7px] h-[7px] rounded-full bg-white block"
                                />
                              )}
                            </span>
                            <span
                              className={`text-sm font-medium transition-colors ${
                                gender === g
                                  ? 'text-blue-700 font-semibold'
                                  : 'text-slate-500 group-hover:text-slate-700'
                              }`}
                            >
                              {g === 'male' ? 'Male' : 'Female'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age */}
                    <div className="flex items-center gap-3 py-4">
                      <label className="w-32 flex-shrink-0 text-slate-700 text-sm font-semibold">
                        Age
                      </label>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="48"
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-14 bg-white"
                          style={{ appearance: 'textfield' }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                          Years
                        </span>
                      </div>
                    </div>

                    {/* Systolic BP */}
                    <div className="flex items-center gap-3 py-4">
                      <label className="w-32 flex-shrink-0 text-slate-700 text-sm font-semibold flex items-center gap-1.5">
                        <span className="text-base">🩺</span> Systolic BP
                      </label>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={60}
                          max={250}
                          step={0.1}
                          value={systolicBP}
                          onChange={(e) => setSystolicBP(e.target.value)}
                          placeholder="127.5"
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-14 bg-white"
                          style={{ appearance: 'textfield' }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                          mmHg
                        </span>
                      </div>
                    </div>

                    {/* Diastolic BP */}
                    <div className="flex items-center gap-3 py-4">
                      <label className="w-32 flex-shrink-0 text-slate-700 text-sm font-semibold flex items-center gap-1.5">
                        <span className="invisible text-base">🩺</span>{' '}
                        Diastolic BP
                      </label>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={40}
                          max={150}
                          step={0.1}
                          value={diastolicBP}
                          onChange={(e) => setDiastolicBP(e.target.value)}
                          placeholder="80.0"
                          className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-14 bg-white"
                          style={{ appearance: 'textfield' }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                          mmHg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT: Lifestyle Factors ── */}
                  <div className="flex flex-col gap-2.5 md:pt-1">
                    <p className="text-slate-800 text-sm font-bold mb-1.5">
                      Lifestyle Factors
                    </p>
                    {lifestyleFactors.map((f) => (
                      <button
                        key={f.id}
                        onClick={f.onChange}
                        className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 text-left"
                        style={{
                          borderColor: f.checked ? '#3b82f6' : '#e2e8f0',
                          background: f.checked ? '#eff6ff' : '#ffffff',
                        }}
                      >
                        <span
                          className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                            f.checked
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-slate-300 group-hover:border-blue-400'
                          }`}
                        >
                          {f.checked && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              width="9"
                              height="7"
                              viewBox="0 0 9 7"
                              fill="none"
                            >
                              <path
                                d="M1 3.5L3 5.5L8 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          )}
                        </span>
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${f.color}`}
                        >
                          {f.icon}
                        </span>
                        <span
                          className={`text-sm font-medium transition-colors ${
                            f.checked
                              ? 'text-blue-800 font-semibold'
                              : 'text-slate-600 group-hover:text-slate-800'
                          }`}
                        >
                          {f.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── CTA Button ── */}
                <div className="mt-7">
                  <button
                    onClick={handleCalculateScore}
                    disabled={
                      scoreLoading ||
                      !gender ||
                      !age ||
                      !systolicBP ||
                      !diastolicBP
                    }
                    className="relative w-full overflow-hidden group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    style={{
                      background:
                        'linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
                      boxShadow: '0 6px 24px rgba(30,58,138,0.30)',
                    }}
                  >
                    <span
                      className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                      }}
                    />
                    <span className="relative flex items-center justify-center gap-2.5 py-3.5 px-6 text-white font-black text-sm tracking-wider">
                      {scoreLoading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Analyzing Profile…
                        </>
                      ) : (
                        <>
                          <Activity size={17} />
                          Analyze Lifestyle Data &amp; Calculate Score
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* ── Result / Error ── */}
                <AnimatePresence>
                  {scoreResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="mt-4 flex flex-col gap-3"
                    >
                      {/* CVD Risk Score */}
                      <div
                        className="flex items-center justify-between px-5 py-3.5 rounded-xl border-2"
                        style={{
                          borderColor: `${scoreResult.color}50`,
                          background: `${scoreResult.color}0d`,
                        }}
                      >
                        <div>
                          <p
                            className="text-[11px] font-black uppercase tracking-widest"
                            style={{ color: scoreResult.color }}
                          >
                            10-Year Risk Score
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Cardiovascular disease probability
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-3xl font-black leading-none"
                            style={{ color: scoreResult.color }}
                          >
                            {scoreResult.score}%
                          </p>
                          <p
                            className="text-[10px] font-black uppercase tracking-widest mt-1"
                            style={{ color: scoreResult.color }}
                          >
                            {scoreResult.risk}
                          </p>
                        </div>
                      </div>

                      {/* Pulse Pressure */}
                      <div className="flex items-center justify-between px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                            Pulse Pressure
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Difference between systolic &amp; diastolic
                          </p>
                        </div>
                        <p className="text-2xl font-black text-slate-700">
                          {scoreResult.pulsePressure.toFixed(1)} mmHg
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {scoreError && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-600 text-xs font-bold text-center"
                    >
                      {scoreError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-slate-400 text-[11px] font-medium text-center mt-4 leading-relaxed">
                  AI-generated for informational purposes only · Not a
                  substitute for clinical advice
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}