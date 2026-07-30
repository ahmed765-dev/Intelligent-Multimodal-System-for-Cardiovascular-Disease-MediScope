'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import logo from './assets/images/Frame 30.png';
import { Home, Users, Star, User, LogOut, LogIn, Stethoscope, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showServices, setShowServices] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { name: 'Home', href: '/#home', icon: <Home size={16} /> },
    { name: 'Doctors', href: '/#doctors', icon: <Users size={16} /> },
    { name: 'Reviews', href: '/#reviews', icon: <Star size={16} /> },
  ];

  return (
    <nav 
      className={`flex items-center justify-between px-8 md:px-16 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-md py-3' : 'bg-transparent'
      }`}
    >
      <motion.a
        href="/"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center"
      >
        <Image src={logo} alt="MedScope" width={120} height={45} className="hover:scale-105 transition-transform cursor-pointer" />
      </motion.a>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            className="group flex items-center gap-1.5 text-med-navy font-semibold text-sm relative"
            whileHover={{ y: -2 }}
          >
            <span className="text-med-navy/60 group-hover:text-med-red transition-colors">{link.icon}</span>
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-med-red transition-all duration-300 group-hover:w-full" />
          </motion.a>
        ))}

        <div
          className="relative"
          onMouseEnter={() => setShowServices(true)}
          onMouseLeave={() => setShowServices(false)}
        >
          <button className="flex items-center gap-1.5 text-med-navy font-semibold text-sm group">
            <Stethoscope size={16} className="text-med-navy/60 group-hover:text-med-red transition-colors" />
            Services
            <ChevronDown size={14} className={`transition-transform duration-300 ${showServices ? 'rotate-180 text-med-red' : ''}`} />
          </button>

          <AnimatePresence>
            {showServices && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 flex flex-col w-56 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
              >
                <a href="/services/EchoVideo" className="flex items-center gap-3 px-4 py-3 text-sm text-med-navy hover:bg-slate-50 rounded-xl transition-all group">
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Heart size={16} className="text-med-red" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">EchoVideo</span>
                    <span className="text-[10px] text-slate-500">Real-time heart analysis</span>
                  </div>
                </a>
                <a href="/services/MedicalRecord" className="flex items-center gap-3 px-4 py-3 text-sm text-med-navy hover:bg-slate-50 rounded-xl transition-all group">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Stethoscope size={16} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Medical Record</span>
                    <span className="text-[10px] text-slate-500">Secure digital history</span>
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.a 
          href="/profile" 
          className="flex items-center gap-1.5 text-med-navy font-semibold text-sm group"
          whileHover={{ y: -2 }}
        >
          <User size={16} className="text-med-navy/60 group-hover:text-med-red transition-colors" />
          Profile
        </motion.a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-med-navy text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-med-navy/20 hover:bg-med-red transition-all duration-300"
          >
            <LogOut size={16} /> 
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 bg-med-navy text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-med-navy/20 hover:bg-emerald-600 transition-all duration-300"
          >
            <LogIn size={16} /> 
            <span className="hidden sm:inline">Login</span>
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;