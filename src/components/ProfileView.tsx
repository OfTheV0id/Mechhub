import React from 'react';
import { 
  Zap, 
  Target, 
  BookOpen, 
  Lock, 
  Activity,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-white p-8">
      {/* Header Profile Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">力学大师之路：张同学的档案</h2>
        
        <div className="relative">
          {/* Circular Progress / Avatar Wrapper */}
          <div className="w-40 h-40 rounded-full p-2 border-4 border-slate-100 relative flex items-center justify-center">
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90 stroke-current text-blue-500" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" className="text-slate-100" />
               <circle cx="50" cy="50" r="46" fill="none" strokeWidth="4" strokeDasharray="289" strokeDashoffset="100" strokeLinecap="round" />
            </svg>
            <img 
              src="https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
            Lv.12 学徒
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold text-slate-800">1250 / 2000 经验值</div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-slate-800 mb-4">成就徽章</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BadgeCard 
            icon={<Zap className="text-amber-500" />} 
            title="静力学巨星" 
            status="earned" 
          />
          <BadgeCard 
            icon={<Activity className="text-blue-500" />} 
            title="运动学之王" 
            status="earned" 
          />
          <BadgeCard 
            icon={<Target className="text-slate-400" />} 
            title="动力学征服者" 
            status="earned" 
          />
          <BadgeCard 
            icon={<BookOpen className="text-slate-400" />} 
            title="流体力学奇才" 
            status="earned" 
          />
          <BadgeCard 
            icon={<Lock className="text-slate-300" />} 
            title="热力学泰坦" 
            status="locked" 
          />
          <BadgeCard 
            icon={<Lock className="text-slate-300" />} 
            title="振动大师" 
            status="locked" 
          />
        </div>
      </div>

      {/* Skill Tree */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-6">技能树</h3>
        <div className="relative flex items-center justify-between px-4 min-w-[600px] overflow-x-auto py-8">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2" />
          
          <SkillNode title="静力学与平衡" status="unlocked" active />
          <SkillNode title="运动学" status="unlocked" />
          <SkillNode title="动力学" status="unlocked" />
          <SkillNode title="能量与动量" status="locked" />
          <SkillNode title="流体" status="locked" />
          <SkillNode title="热力学" status="locked" />
          <SkillNode title="狭义相对论" status="locked" />
        </div>
      </div>
    </div>
  );
};

const BadgeCard = ({ icon, title, status }: { icon: React.ReactNode, title: string, status: 'earned' | 'locked' }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
    status === 'earned' 
      ? 'bg-white border-slate-200 shadow-sm' 
      : 'bg-slate-50 border-slate-100 opacity-60'
  }`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
      status === 'earned' ? 'bg-slate-50' : 'bg-slate-100'
    }`}>
      {icon}
    </div>
    <div>
      <div className="font-semibold text-slate-700 text-sm">{title}</div>
      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
        {status === 'earned' ? <><span className="text-green-500">✓</span> 已获得</> : '未解锁'}
      </div>
    </div>
  </div>
);

const SkillNode = ({ title, status, active }: { title: string, status: 'unlocked' | 'locked', active?: boolean }) => (
  <div className="flex flex-col items-center gap-2 relative group cursor-pointer">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all z-10 ${
      active 
        ? 'bg-white border-blue-500 shadow-lg scale-110' 
        : status === 'unlocked' 
          ? 'bg-blue-500 border-blue-100' 
          : 'bg-slate-200 border-slate-100'
    }`}>
      {status === 'locked' && <Lock size={14} className="text-slate-400" />}
    </div>
    <div className={`text-xs font-medium text-center max-w-[80px] ${
      active ? 'text-blue-600' : status === 'unlocked' ? 'text-slate-600' : 'text-slate-400'
    }`}>
      {title}
    </div>
  </div>
);
