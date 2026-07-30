'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import doc1 from './assets/images/download (1).jpg';
import doc2 from './assets/images/download.jpg';
import doc3 from './assets/images/images (1).jpg';
import doc4 from './assets/images/images.jpg';
import medicalBg from './assets/images/medical-5459631_1280 1.png';
import { Heart, Star, Calendar, MessageSquare, Plus } from 'lucide-react';

const doctors = [
  { id: 1, name: 'DR. Ahmed Hassan', specialty: 'Cardiologist', image: doc1, available: true, patients: '1.2k+', rating: 4.9 },
  { id: 2, name: 'DR. Mohamed Ali', specialty: 'Neurologist', image: doc2, available: true, patients: '800+', rating: 4.8 },
  { id: 3, name: 'DR. Khaled Samir', specialty: 'Pediatrician', image: doc3, available: true, patients: '2k+', rating: 5.0 },
  { id: 4, name: 'DR. Mahmoud Fathy', specialty: 'Psychologist', image: doc4, available: false, patients: '600+', rating: 4.7 },
];

const Doctors = () => {
  return (
    <section id="doctors" className="relative py-24 px-6 md:px-16 overflow-hidden bg-white">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50/30 rounded-full blur-3xl -ml-40 -mb-40" />

      <Image
        src={medicalBg}
        alt="background"
        fill
        className="object-cover object-left opacity-[0.03] pointer-events-none"
      />

      <div className="container mx-auto relative z-10">
        
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-med-red font-bold tracking-[0.2em] uppercase text-xs"
          >
            Meet Our Experts
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-med-navy"
          >
            World Class Specialists
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            className="h-1.5 bg-med-red/20 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-med-navy/10 group-hover:-translate-y-2">
                
                {/* Image Section */}
                <div className="h-64 overflow-hidden relative">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-med-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${
                    doc.available 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-slate-500/90 text-white'
                  }`}>
                    {doc.available ? 'Available' : 'Busy'}
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <button className="w-10 h-10 rounded-xl bg-white text-med-navy flex items-center justify-center shadow-lg hover:bg-med-red hover:text-white transition-colors">
                      <Calendar size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white text-med-navy flex items-center justify-center shadow-lg hover:bg-med-navy hover:text-white transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white text-med-navy flex items-center justify-center shadow-lg hover:bg-med-red hover:text-white transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 px-2.5 bg-red-50 rounded-lg">
                      <span className="text-[10px] font-black text-med-red uppercase tracking-tighter">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-med-navy group-hover:text-med-red transition-colors duration-300">
                    {doc.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patients</span>
                      <span className="text-xs font-black text-med-navy">{doc.patients}</span>
                    </div>
                    <button className="ml-auto w-8 h-8 rounded-lg bg-slate-50 text-med-navy flex items-center justify-center group-hover:bg-med-navy group-hover:text-white transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <button className="px-10 py-4 bg-slate-100 text-med-navy font-bold rounded-2xl hover:bg-med-navy hover:text-white transition-all duration-300">
            View All Specialists
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Doctors;
