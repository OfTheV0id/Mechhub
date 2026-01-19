import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Brain, 
  Award, 
  Archive, 
  ArrowRight
} from 'lucide-react';

interface HomeViewProps {
  onStartChat: (message?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartChat(inputValue);
    }
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
              <div className="absolute top-[55%] right-[55%] -z-10">
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

        <h1 className="text-4xl font-bold text-slate-900 mb-[16px] tracking-tight text-center text-[160px] mt-[10px] mr-[0px] ml-[0px] not-italic font-[Abhaya_Libre_Medium]">
          Hello!
        </h1>
        <p className="text-slate-500 text-lg mb-12 text-center max-w-lg">
          选择你的任务，成为力学大师！
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-16">
          <ActionCard 
            icon={<Brain className="text-blue-500" />}
            title="解锁新概念"
            description="开启通往新概念和精通之路。"
            buttonText="初学者路径"
            onClick={() => onStartChat("让我们开始初学者路径")}
          />
          <ActionCard 
            icon={<Rocket className="text-purple-500" />}
            title="征服测验！"
            description="完成测验挑战，检验你的运算能力。"
            buttonText="挑战模式"
            onClick={() => onStartChat("我想尝试挑战模式")}
          />
          <ActionCard 
            icon={<Award className="text-amber-500" />}
            title="赢取徽章"
            description="完成本次任务，赢取属于你的荣誉徽章。"
            buttonText="赢取徽章"
            onClick={() => onStartChat("我该如何赢得下一个徽章？")}
          />
          <ActionCard 
            icon={<Archive className="text-emerald-500" />}
            title="访问知识库"
            description="查看你收藏的力学笔记和关卡记录。"
            buttonText="访问知识库"
            onClick={() => onStartChat("显示我保存的笔记")}
          />
        </div>

        {/* Bottom Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div className="relative flex items-center p-[0px]">
            <div className="absolute left-4 text-slate-400">
               <Brain size={20} />
            </div>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="问问你的 AI 学习搭档..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-0 rounded-full py-4 pl-12 pr-14 outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400 text-lg text-[16px]"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center h-full">
    <div className="p-3 bg-slate-50 rounded-xl mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{title}</h3>
    <p className="text-slate-500 text-xs mb-6 leading-relaxed flex-1">
      {description}
    </p>
    <button 
      onClick={onClick}
      className="w-full py-2 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
    >
      {buttonText}
    </button>
  </div>
);
