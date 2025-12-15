import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { sendChatMessage } from './chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 PERSONNALISE LE MESSAGE DE BIENVENUE
// ═══════════════════════════════════════════════════════════════
const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Salut ! Je suis l'assistant AI.

Je peux t'aider avec :
• Comment fonctionne le site
• Répondre à tes questions
• Résoudre des problèmes

Qu'est-ce que je peux faire pour toi ?`,
  timestamp: new Date()
};
// ═══════════════════════════════════════════════════════════════

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll vers le bas quand nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for API (exclude welcome message)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const responseContent = await sendChatMessage(input.trim(), history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Oups, une erreur est survenue. Réessaie dans un moment !',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      {/* Backdrop - clic pour fermer */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat window */}
      <div className="relative flex h-[500px] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-gray-900 shadow-2xl sm:h-[600px]">
        
        {/* ═══ HEADER ═══ */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gray-950 p-4">
          <div className="flex items-center gap-3">
            {/* Avatar - personnalise la couleur */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-gray-900">
              <span className="text-lg font-bold">?</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Assistant AI</h3>
              <p className="text-xs text-gray-400">Toujours là pour t'aider</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* ═══ MESSAGES ═══ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                  message.role === 'user'
                    ? 'bg-yellow-400 text-gray-900'  // Message utilisateur
                    : 'bg-white/10 text-white'       // Message AI
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ═══ INPUT ═══ */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-yellow-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-gray-900 transition hover:bg-yellow-300 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
