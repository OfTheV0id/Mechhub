import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Brain, 
  Award, 
  Archive, 
  ArrowRight,
  GraduationCap,
  Shield,
  Image as ImageIcon
} from 'lucide-react';

interface HomeViewProps {
  onStartChat: (message?: string) => void;
  mode?: 'study' | 'boss';
  setMode?: (mode: 'study' | 'boss') => void;
  userName?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onStartChat,
  mode = 'study',
  setMode = () => {},
  userName = "同学"
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartChat(inputValue);
    }
  };

  const handleMockImageUpload = () => {
    if (mode !== 'boss') setMode('boss');
    // We can simulate an image upload by starting chat with a specific message that triggers image logic in parent
    onStartChat("请帮我批改这道静力学习题"); 
  };

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-white relative">
      <div className="max-w-4xl w-full flex flex-col items-center pt-[0px] pr-[0px] pb-[0px] pl-[100px] p-[0px]">
        
        {/* Hero Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 text-slate-800"
        >
          <div className="relative flex flex-col items-center py-6">
            <motion.div
              animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Rocket size={150} strokeWidth={1.2} className="text-slate-900 fill-slate-50 relative z-20" />
              
              {/* Speed Lines Exhaust */}
              <div className="absolute top-[75%] right-[75%] -z-10">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="overflow-visible transform rotate-[45deg] opacity-60">
                  <motion.path
                    d="M50 0 L50 60"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-slate-800"
                    animate={{ 
                      pathLength: [0.2, 0.6, 0.2],
                      pathOffset: [0, 1, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path
                    d="M30 10 L30 50"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-slate-800"
                    animate={{ 
                      pathLength: [0.2, 0.5, 0.2],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.2 }}
                  />
                  <motion.path
                    d="M70 10 L70 55"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-slate-800"
                    animate={{ 
                      pathLength: [0.2, 0.7, 0.2],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.1 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold text-slate-900 mb-[16px] tracking-tight text-center text-[80px] mt-[10px] mr-[0px] ml-[0px] not-italic font-[Abhaya_Libre_Medium]">
          Hello, {userName}
        </h1>


        {/* Bottom Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm">
            
            {/* Integrated Mode Switcher */}
            <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
                {/* Active Pill Background */}
                <motion.div 
                  className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                  layoutId="activeModeInputHome" // Distinct ID to avoid conflict if both mounted (though unlikely)
                  initial={false}
                  animate={{ 
                    left: mode === 'study' ? '4px' : 'calc(50% + 2px)',
                    width: 'calc(50% - 6px)',
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />

                <button 
                  type="button"
                  onClick={() => setMode('study')}
                  className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                    mode === 'study' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <GraduationCap size={14} />
                  提问
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('boss')}
                  className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                    mode === 'boss' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Shield size={14} />
                  批改
                </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

            <button 
               type="button"
               onClick={handleMockImageUpload}
               className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
               title="上传作业"
            >
               <ImageIcon size={20} />
            </button>

            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === 'boss' ? "传入你的过程进行批改..." : "问问你的 AI 学习搭档..."}
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0"
            />
            
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:scale-105 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}
