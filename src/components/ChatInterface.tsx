import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send,
  Image as ImageIcon,
  Sparkles,
  User,
  Shield,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  type: "text" | "grading";
  content: string;
  imageUrl?: string;
  annotations?: any[];
  score?: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, image?: File) => void;
  isTyping: boolean;
  onOpenSubmission: () => void;
  mode: "study" | "boss";
  setMode: (mode: "study" | "boss") => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isTyping,
  onOpenSubmission,
  mode,
  setMode,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const handleMockImageUpload = () => {
    // Only allow "grading" (boss battle) if mode is boss, or auto-switch
    if (mode !== "boss") setMode("boss");
    onSendMessage(
      "请帮我批改这道静力学习题",
      new File([""], "mock.jpg"),
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white/50 relative">
      {/* Header - Now simplified without the mode switcher */}
      <div className="h-20 flex items-center justify-end px-8 border-b border-slate-100 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              已获经验
            </div>
            <div className="text-sm font-medium text-slate-500">
              1,250 XP
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
            <Shield size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-20 py-8 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="w-full max-w-5xl mx-auto"
          >
            {msg.type === "text" ? (
              <div
                className={`flex gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    msg.role === "assistant"
                      ? "bg-black text-white border-black"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-[spin_10s_linear_infinite]"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <User size={20} />
                  )}
                </div>

                <div
                  className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1">
                    {msg.role === "assistant"
                      ? "MechHub AI"
                      : "你"}
                  </div>
                  <div
                    className={`text-base leading-relaxed ${
                      msg.role === "user"
                        ? "text-slate-800"
                        : "text-slate-600"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Math Formula Example (Static for now to mimic image) */}
                  {msg.content.includes("period formula") && (
                    <div className="my-4 p-6 bg-slate-50 rounded-xl flex justify-center">
                      <span className="text-2xl font-serif italic">
                        T ≈ 2π√(L/g)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Grading View (Boss Battle Mode Result)
              <div className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800">
                    批改结果
                  </span>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
                  {/* Left: Image with Annotations */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px]">
                    <img
                      src={msg.imageUrl}
                      alt="Homework"
                      className="w-full h-full object-contain"
                    />
                    {msg.annotations?.map((ann) => (
                      <div
                        key={ann.id}
                        className="absolute border-2 bg-white/10 backdrop-blur-sm rounded-lg flex items-start justify-end p-2 cursor-pointer hover:bg-white/20 transition-colors group"
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                          width: `${ann.width}%`,
                          height: `${ann.height}%`,
                          borderColor:
                            ann.type === "correct"
                              ? "#22C55E"
                              : ann.type === "incorrect"
                                ? "#EF4444"
                                : "#3B82F6",
                        }}
                      >
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm ${
                            ann.type === "correct"
                              ? "bg-green-500"
                              : ann.type === "incorrect"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        >
                          {ann.type === "correct"
                            ? "正确"
                            : ann.type === "incorrect"
                              ? "错误"
                              : "建议"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Feedback Breakdown */}
                  <div className="w-full lg:w-80 flex flex-col gap-4">
                    <h4 className="font-bold text-lg text-slate-800">
                      AI 反馈详情
                    </h4>

                    <div className="space-y-4">
                      {msg.annotations?.map((ann, idx) => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {ann.type === "correct" ? (
                              <CheckCircle2
                                size={18}
                                className="text-green-500"
                              />
                            ) : (
                              <AlertCircle
                                size={18}
                                className="text-red-500"
                              />
                            )}
                            <span className="font-bold text-sm text-slate-700">
                              步骤 {idx + 1}:{" "}
                              {ann.type === "correct"
                                ? "正确"
                                : "发现问题"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {ann.comment}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        总分
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                          {msg.score}
                        </span>
                        <span className="text-slate-400">
                          / 100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="w-full max-w-5xl mx-auto flex gap-6">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="flex items-center gap-2 py-3">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 bg-slate-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: 0.2,
                }}
                className="w-2 h-2 bg-slate-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: 0.4,
                }}
                className="w-2 h-2 bg-slate-400 rounded-full"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 md:px-20 bg-white border-t border-slate-100 sticky bottom-0 z-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm"
        >
          {/* Integrated Mode Switcher */}
          <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
            {/* Active Pill Background */}
            <motion.div
              className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
              layoutId="activeModeInput"
              initial={false}
              animate={{
                left:
                  mode === "study" ? "4px" : "calc(50% + 2px)",
                width: "calc(50% - 6px)",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />

            <button
              type="button"
              onClick={() => setMode("study")}
              className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                mode === "study"
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <GraduationCap size={14} />
              提问
            </button>
            <button
              type="button"
              onClick={() => setMode("boss")}
              className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                mode === "boss"
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-700"
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
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === "boss"
                ? "传入你的过程进行批改..."
                : "有问题尽管问..."
            }
            className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-base min-w-0"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:scale-105 shadow-md hover:shadow-lg flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          MechHub AI：也要动动脑子哦！请核对所有计算。
        </div>
      </div>
    </div>
  );
};