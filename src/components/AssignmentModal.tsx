import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Calendar, ChevronRight, Check } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'graded';
  description: string;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentId: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const assignments: Assignment[] = [
    { id: '1', title: '静力学基础：受力分析', deadline: '2023-10-25', status: 'pending', description: '完成第3章习题 3-1 至 3-5，并提交分析过程。' },
    { id: '2', title: '运动学：点的合成运动', deadline: '2023-10-30', status: 'pending', description: '重点考察科氏加速度的计算。' },
    { id: '3', title: '动力学：动量定理', deadline: '2023-11-05', status: 'graded', description: '包含实验数据分析。' },
  ];

  const handleSubmit = () => {
    if (selectedId) {
      onSubmit(selectedId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">提交作业</h3>
                    <p className="text-sm text-slate-500 mt-1">选择要将当前对话关联到的作业</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                {assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    onClick={() => assignment.status !== 'graded' && setSelectedId(assignment.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedId === assignment.id 
                        ? 'border-[#0B57D0] bg-blue-50/50' 
                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                    } ${assignment.status === 'graded' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${selectedId === assignment.id ? 'bg-blue-100 text-[#0B57D0]' : 'bg-white text-slate-500'}`}>
                                <FileText size={18} />
                            </div>
                            <span className="font-semibold text-slate-700">{assignment.title}</span>
                        </div>
                        {selectedId === assignment.id && (
                            <div className="w-6 h-6 rounded-full bg-[#0B57D0] flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 ml-10 mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-4 ml-10 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> 截止: {assignment.deadline}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                            assignment.status === 'graded' ? 'bg-green-100 text-green-700' : 
                            assignment.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {assignment.status === 'graded' ? '已批改' : assignment.status === 'submitted' ? '已提交' : '待提交'}
                        </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                    onClick={onClose}
                    className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-full transition-colors"
                >
                    取消
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={!selectedId}
                    className="px-6 py-2.5 bg-[#0B57D0] text-white font-medium rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                >
                    确认提交
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
