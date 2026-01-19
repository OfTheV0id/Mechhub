import React from 'react';
import { motion } from 'motion/react';
import { Settings, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col md:flex-row"
      >
        {/* Background Decorative Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path 
                d="M0,0 L30,40 L70,10 L100,60" 
                stroke="#E2E8F0" 
                strokeWidth="0.5" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path 
                d="M0,80 L20,50 L60,90 L100,20" 
                stroke="#E2E8F0" 
                strokeWidth="0.5" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              />
              <circle cx="30" cy="40" r="1" fill="#CBD5E1" />
              <circle cx="70" cy="10" r="1" fill="#CBD5E1" />
              <circle cx="20" cy="50" r="1" fill="#CBD5E1" />
              <circle cx="60" cy="90" r="1" fill="#CBD5E1" />
           </svg>
        </div>

        {/* Left Content Section */}
        <div className="flex-1 p-8 md:p-16 flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 md:mb-24">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                <Settings className="animate-spin-slow" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight font-[Abhaya_Libre_ExtraBold] text-[32px]">MechHub</span>
            </div>
            
            <button 
              onClick={onLogin}
              className="px-6 py-2 rounded-full border border-slate-200 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all font-[Abhaya_Libre_ExtraBold] text-[20px] text-[rgb(28,44,67)]"
            >
              Login
            </button>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight"
            >
              Theoretical Mechanics,<br />
              <span className="text-slate-400">Reimagined by AI.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={onStart}
                className="group bg-black text-white text-lg font-medium px-8 py-4 rounded-full flex items-center gap-2 hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                Start Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
          
          {/* Footer Decoration */}
          <div className="mt-12 text-slate-400 text-sm">
             Designed for Engineering Students
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 relative bg-slate-50/50 flex items-center justify-center p-8 overflow-hidden">
          {/* Abstract Geometric Overlay */}
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-slate-300 rounded-full" />
             <div className="absolute top-1/3 right-1/3 w-48 h-48 border border-slate-300 rounded-full" />
             <div className="absolute top-20 right-20 w-32 h-32 bg-slate-100 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative z-10 w-full max-w-md aspect-square"
          >
             <img 
               src="https://images.unsplash.com/photo-1597884322847-a5031b9937c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBtZXRhbCUyMGd5cm9zY29wZSUyMDNkJTIwcmVuZGVyJTIwY2xlYW4lMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY4ODI1ODE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
               alt="Mechanical Gyroscope 3D Illustration"
               className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply" 
             />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
