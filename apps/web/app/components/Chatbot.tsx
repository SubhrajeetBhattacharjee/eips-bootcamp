'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageSquare, Bot, RefreshCcw, Send, X } from 'lucide-react';

const presetQuestions = [
  "What is EIP-1559 in one line?",
  "What does ERC-20 do?",
  "Explain EIP-4844 simply",
  "Where can I track upgrades?",
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    append,
    isLoading
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: 'Ask me anything about this site. I will give a short answer first, then links if useful.',
      }
    ]
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleReset = () => {
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        content: 'Ask me anything about this site. I will give a short answer first, then links if useful.',
      }
    ]);
  };

  const handlePresetClick = (question: string) => {
    append({
      role: 'user',
      content: question,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-emerald-500 text-black shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-[#0f1110] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#121413]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-500" />
            <h3 className="font-serif font-medium text-lg text-white leading-none">Site Assistant</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Short precise answers, then links if needed.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-2.5 py-1.5 rounded border border-white/10 bg-white/5 transition-colors"
          >
            <RefreshCcw size={12} /> Reset
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Preset Questions Area */}
      {messages.length === 1 && (
        <div className="px-5 pt-5 pb-2">
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handlePresetClick(q)}
                className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            {m.role === 'assistant' && m.id !== 'initial' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Assistant</span>
            )}
            <div
              className={`p-4 text-sm leading-relaxed max-w-[90%] ${
                m.role === 'user'
                  ? 'bg-emerald-500/10 text-emerald-50 border border-emerald-500/20 rounded-2xl rounded-tr-sm'
                  : 'bg-white/5 text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Assistant</span>
            <div className="p-4 bg-white/5 text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#121413] border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about EIPsInsight..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 text-emerald-500 hover:text-emerald-400 disabled:text-muted-foreground disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
