'use client';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import heart from './assets/images/realistic-heart-shape-studio 1.png';
import heartbeat from './assets/images/health-846780_1280 1.png';
import { Activity, Heart, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const floatVariants: Variants = {
  animate: (delay: number) => ({
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  }),
};

const Hero = () => {
  const router = useRouter();
  return (
    <section id="home" className="relative mesh-gradient min-h-[95vh] flex items-center justify-center px-6 md:px-20 py-20 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-full h-full"
        >
          <Image
            src={heartbeat}
            alt="heartbeat"
            fill
            className="object-cover opacity-10"
            priority
          />
        </motion.div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-med-navy/10 px-4 py-2 rounded-full w-fit shadow-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 15}`}
                  alt={`patient${i}`}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-med-navy text-[10px] md:text-xs font-bold uppercase tracking-wider">
              Trusted by 10k+ <span className="text-med-red">Patients</span>
            </p>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-med-navy leading-tight tracking-tight">
            Advanced Care for <br />
            Your <span className="text-med-red inline-block relative">
              Heart
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute -bottom-2 left-0 h-1.5 bg-med-red/20 rounded-full"
              />
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            MedScope provides state-of-the-art cardiovascular diagnostics and personalized treatment plans to ensure your heart stays as strong as your spirit.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <motion.button
              onClick={() => router.push('/profile')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-med-navy text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-med-navy/25 hover:bg-med-navy/90 transition-all"
            >
              Check Your Health <ArrowRight size={18} />
            </motion.button>
            <motion.button
              onClick={() => router.push('/services/EchoVideo')}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/60 backdrop-blur-md border border-slate-200 text-med-navy px-8 py-4 rounded-2xl font-bold transition-all"
            >
              Explore Services
            </motion.button>
          </div>

          <div className="flex gap-8 pt-6">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-med-navy">99%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Success Rate</span>
            </div>
            <div className="w-[1px] h-10 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-med-navy">24/7</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Expert Support</span>
            </div>
          </div>
        </motion.div>

        <div className="relative flex justify-center items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-20"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                filter: ["drop-shadow(0 0 20px rgba(229,57,53,0.3))", "drop-shadow(0 0 40px rgba(229,57,53,0.6))", "drop-shadow(0 0 20px rgba(229,57,53,0.3))"]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              <Image
                src={heart}
                alt="Heart"
                width={500}
                height={500}
                className="drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              custom={0}
              variants={floatVariants}
              animate="animate"
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 glass p-4 md:p-5 rounded-2xl flex items-center gap-4 z-30"
            >
              <div className="p-3 bg-red-100 rounded-xl text-med-red">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Live BPM</p>
                <p className="text-lg md:text-xl font-black text-med-navy">72 <span className="text-xs font-normal text-slate-400">ms</span></p>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={floatVariants}
              animate="animate"
              className="absolute -bottom-6 -left-8 md:-bottom-8 md:-left-12 glass p-4 md:p-5 rounded-2xl flex items-center gap-4 z-30"
            >
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Protection</p>
                <p className="text-base md:text-lg font-black text-med-navy">Secured Data</p>
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={floatVariants}
              animate="animate"
              className="absolute top-1/2 -left-16 md:-left-20 glass p-3 md:p-4 rounded-2xl z-30 flex flex-col items-center gap-1"
            >
              <Heart className="text-med-red fill-med-red" size={20} />
              <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                <motion.div 
                  animate={{ width: ["10%", "90%", "40%", "80%", "10%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="h-full bg-med-red"
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-med-navy/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-med-navy/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-med-navy/5 rounded-full" />
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;

