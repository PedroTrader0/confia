import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { chatWithFinanceAI } from '../services/geminiService';
import { Transaction, DashboardStats } from '../types';

interface AIChatProps {
  transactions: Transaction[];
  stats: DashboardStats;
}

const AIChat: React.FC<AIChatProps> = ({ transactions, stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Olá! Sou o assistente virtual do CONFIA. Como posso ajudar nas suas finanças hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    // Prepare context
    const context = `
      Saldo Atual: R$ ${stats.balance.toFixed(2)}
      Receita Total: R$ ${stats.totalIncome.toFixed(2)}
      Despesa Total: R$ ${stats.totalExpense.toFixed(2)}
      Últimas transações: ${transactions.slice(0, 5).map(t => `${t.date}: ${t.description} (${t.amount})`).join('; ')}
    `;

    const aiResponse = await chatWithFinanceAI(userMessage, context);

    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-confia-green text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-confia-dark transition-all z-40 flex items-center justify-center animate-bounce-slow"
        >
          <Bot size={24} className="md:w-7 md:h-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-[80vh] md:h-[500px] md:w-96 md:bottom-6 md:right-6 bg-white rounded-t-2xl md:rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-confia-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-bold font-display">CONFIA AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-confia-gold transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-confia-green text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm text-sm text-gray-500 italic">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 pb-6 md:pb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre suas finanças..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-confia-green focus:ring-1 focus:ring-confia-green"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-confia-gold hover:bg-confia-goldHover text-confia-dark p-2 rounded-full transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;