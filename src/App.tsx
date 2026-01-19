import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface, Message } from './components/ChatInterface';
import { AssignmentModal } from './components/AssignmentModal';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { AuthPage } from './components/AuthPage';
import { Toaster, toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { LogOut } from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Mock data for initial messages or empty state
const INITIAL_MESSAGES: Message[] = [];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('home'); // 'home', 'chat', 'profile'
  const [chatMode, setChatMode] = useState<'study' | 'boss'>('study');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mock function to handle sending messages
  const handleSendMessage = async (text: string, image?: File) => {
    // If not in chat view, switch to chat
    if (activeView !== 'chat') {
        setActiveView('chat');
    }

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content: text,
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI delay and response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse: Message;

      if (image || chatMode === 'boss') {
        // Mock Grading Response (Boss Battle)
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'grading',
          content: "批改完成。请查看下方的详细分析。",
          imageUrl: "https://images.unsplash.com/photo-1727522974735-44251dfe61b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwZGlhZ3JhbSUyMG1lY2hhbmljcyUyMHNrZXRjaGVzfGVufDF8fHx8MTc2ODc5NTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          score: 85,
          annotations: [
            {
              id: 'a1',
              x: 35,
              y: 30,
              width: 25,
              height: 15,
              comment: "初速度的推导是正确的。",
              type: 'correct'
            },
            {
              id: 'a2',
              x: 50,
              y: 60,
              width: 30,
              height: 20,
              comment: "最后的计算有一个算术错误，请重新检查你的乘法。",
              type: 'incorrect'
            },
            {
               id: 'a3',
               x: 10,
               y: 70,
               width: 30,
               height: 25,
               comment: "你在受力图中遗漏了摩擦力矢量。",
               type: 'info'
             }
          ]
        };
      } else {
        // Mock Text Response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'text',
          content: "单摆运动是简谐运动的一个经典例子。对于小角度摆动，周期 T 大约等于 2π√(L/g)，其中 L 是摆长，g 是重力加速度。你想和我一起推导这个公式吗？",
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleStartNewQuest = () => {
    setMessages([]);
    setActiveView('home');
    setChatMode('study');
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
      loading: '正在提交任务...',
      success: '任务提交成功！',
      error: '提交失败'
    });
  };
  
  const handleSignOut = async () => {
      await supabase.auth.signOut();
      setSession(null);
  };

  if (loading) {
      return <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>;
  }

  if (!session) {
      return (
        <>
            <Toaster position="top-center" richColors />
            <AuthPage onLoginSuccess={() => {}} />
        </>
      );
  }

  return (
    <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
      <Toaster position="top-center" richColors />
      
      <div className="flex flex-col h-full">
         <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onNewQuest={handleStartNewQuest}
        />
        <div className="mt-auto p-4 border-r border-slate-100 bg-white">
             <button onClick={handleSignOut} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors w-full px-4 py-2 rounded-lg hover:bg-slate-50">
                 <LogOut size={14} />
                 退出登录
             </button>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {activeView === 'home' && (
            <HomeView onStartChat={(msg) => handleSendMessage(msg || "我们开始吧！")} />
        )}
        
        {activeView === 'chat' && (
            <ChatInterface 
                messages={messages}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                onOpenSubmission={() => setIsSubmissionOpen(true)}
                mode={chatMode}
                setMode={setChatMode}
            />
        )}

        {activeView === 'profile' && (
            <ProfileView />
        )}
      </main>

      <AssignmentModal 
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        onSubmit={handleSubmitAssignment}
      />
    </div>
  );
}
