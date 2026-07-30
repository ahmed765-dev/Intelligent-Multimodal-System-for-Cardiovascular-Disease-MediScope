'use client';
import { Facebook, Instagram, Twitter, Linkedin, Heart, Mail, Phone, MapPin, ArrowRight, Github } from 'lucide-react';
import Image from 'next/image';
import logo from './assets/images/Frame 30.png';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/ahmed.samir.10195',
    color: '#1877F2',
    bg: 'hover:bg-[#1877F2]',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/_ahmedsamir.7/',
    color: '#E1306C',
    bg: 'hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888]',
  },
  {
    icon: Twitter,
    label: 'X / Twitter',
    href: 'https://x.com/ahmed_samir722',
    color: '#000000',
    bg: 'hover:bg-black',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ahmed-abdel-salam-10766b3a9/',
    color: '#0A66C2',
    bg: 'hover:bg-[#0A66C2]',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/ahmedsmie200',
    color: '#333',
    bg: 'hover:bg-[#333]',
  },
];

const quickLinks = [
  { name: 'Home', href: '/#home' },
  { name: 'Doctors', href: '/#doctors' },
  { name: 'Services', href: '/services/EchoVideo' },
  { name: 'Reviews', href: '/#reviews' },
];

const services = [

  { name: 'MedicalRecord', href: '/services/MedicalRecord' },
  { name: 'EchoVideo', href: '/services/EchoVideo' },
  { name: 'Check Results', href: '/profile' },
  
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0f1e] text-white overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1a237e]/30 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-72 h-72 bg-[#e53935]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1a237e]/20 rounded-full blur-3xl" />
      </div>

      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e53935] to-transparent" />

      <div className="relative container mx-auto px-6 pt-20 pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <Image src={logo} alt="MedScope" width={110} height={40} className="brightness-0 invert" />
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Leading the way in cardiovascular excellence. We deliver comprehensive heart care with precision and a personal touch — because every heartbeat matters.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href, bg }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center ${bg} hover:text-white hover:border-transparent transition-all duration-300 backdrop-blur-sm`}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>

            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-widest">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e53935]/60 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-[#e53935] hover:bg-[#c62828] rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#e53935] rounded-full" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 6 }}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    <ArrowRight size={13} className="text-[#e53935] opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 duration-200" />
                    {name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#e53935] rounded-full" />
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map(({ name, href }) => (
                <li key={name}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 6 }}
                    className="group flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    <ArrowRight size={13} className="text-[#e53935] opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 duration-200" />
                    {name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#e53935] rounded-full" />
              Contact Us
            </h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a
                  href="https://maps.google.com/?q=6+October,+Giza,+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#e53935]/10 border border-[#e53935]/20 text-[#e53935] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e53935] group-hover:text-white transition-all duration-300">
                    <MapPin size={16} />
                  </div>
                  <span className="pt-1.5 leading-relaxed">6 October, Giza, Egypt</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+201013188460"
                  className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1a237e]/20 border border-[#1a237e]/30 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a237e] group-hover:text-white transition-all duration-300">
                    <Phone size={16} />
                  </div>
                  +2 010 1318 8460
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@medscope.com"
                  className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <Mail size={16} />
                  </div>
                  support@medscope.com
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <p className="text-xs text-slate-400">
                Available <span className="text-emerald-400 font-semibold">24/7</span> for emergencies
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © 2026 MedScope Cardiovascular Hospital. All rights reserved.{' '}
            <span className="inline-flex items-center gap-1">
              Built with <Heart size={11} className="text-[#e53935] fill-[#e53935] inline mx-0.5" /> by{' '}
              <a
                href="https://www.linkedin.com/in/ahmed-abdel-salam-10766b3a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e53935] hover:text-white transition-colors font-semibold"
              >
                ENG. Ahmed Abdel Salam
              </a>
            </span>
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
