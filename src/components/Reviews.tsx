'use client';
import { motion, useInView as useFramerInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Star, Quote, Award, Users, Activity, Building2, FlaskConical } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Ahmed Abdel Salam',
    role: 'Patient',
    image: 'https://i.pravatar.cc/100?img=11',
    text: 'The cardiovascular diagnosis process was incredibly thorough and the doctors were extremely supportive throughout my recovery.',
  },
  {
    id: 2,
    name: 'Mona Bilal',
    role: 'Patient',
    image: 'https://i.pravatar.cc/100?img=47',
    text: 'I highly recommend MedScope for anyone seeking premium heart care. Their state-of-the-art technology is truly impressive.',
  },
  {
    id: 3,
    name: 'Ahmed Fergany',
    role: 'Patient',
    image: 'https://i.pravatar.cc/100?img=12',
    text: 'Excellent service and very professional staff. The digital medical records made managing my appointments so much easier.',
  },
  {
    id: 4,
    name: 'Ahmed Samir',
    role: 'Patient',
    image: 'https://i.pravatar.cc/100?img=13',
    text: 'A life-changing experience. The personalized treatment plan helped me regain my strength and confidence in my health.',
  },
  {
    id: 5,
    name: 'Andro Salib',
    role: 'Patient',
    image: 'https://i.pravatar.cc/100?img=13',
    text: 'The best cardiologists in the region. Their attention to detail and patient care is unmatched in the industry.',
  },
];

const stats = [
  { value: '300+', label: 'Specialists', icon: <Award size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: '18+', label: 'Years Exp', icon: <Activity size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
  { value: '30K', label: 'Recoveries', icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: '97+', label: 'Facilities', icon: <Building2 size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: '317+', label: 'Procedures', icon: <FlaskConical size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
];

function CountUp({ end, duration = 2, startOnView = true }: { end: string, duration?: number, startOnView?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useFramerInView(ref, { once: true });
  
  const parsed = end.replace(/[^0-9]/g, '');
  const suffix = end.replace(/[0-9]/g, '');
  const endNum = parseInt(parsed);

  useEffect(() => {
    if (startOnView && !isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * endNum));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endNum, duration, isInView, startOnView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ReviewCard({ name, role, image, text }: any) {
  return (
    <div className="bg-white rounded-3xl p-8 w-[350px] shadow-xl shadow-slate-200/50 border border-slate-50 flex-shrink-0 group hover:border-med-red/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <Quote size={32} className="text-slate-100 group-hover:text-med-red/10 transition-colors" />
      </div>
      <p className="text-slate-600 italic leading-relaxed mb-8 text-sm">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={image} alt={name} className="w-12 h-12 rounded-2xl object-cover" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-med-navy group-hover:text-med-red transition-colors">{name}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: any) {
  return (
    <div className="flex overflow-hidden group py-4">
      <motion.div
        animate={{
          x: reverse ? [0, -100 + '%'] : [-100 + '%', 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex gap-6 pr-6 flex-nowrap"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <ReviewCard key={i} {...item} />
        ))}
      </motion.div>
    </div>
  );
}

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-slate-50/50 overflow-hidden relative">
      
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-med-red font-bold tracking-[0.2em] uppercase text-xs">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black text-med-navy">What Our Patients Say</h2>
          <div className="h-1.5 w-20 bg-med-red/20 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <MarqueeRow items={reviews} reverse={false} />
        <MarqueeRow items={reviews} reverse={true} />
      </div>

      <div className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-white shadow-lg shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <h4 className="text-3xl font-black text-med-navy mb-1">
                <CountUp end={stat.value} />
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
