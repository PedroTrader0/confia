import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, LogIn, PieChart, AlertCircle } from 'lucide-react';

interface AuthProps {
  onDemoLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onDemoLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase não configurado. Use o modo de demonstração.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu email para confirmar.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Digite seu email para recuperar a senha.");
      return;
    }
    if (!supabase) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage("Email de recuperação enviado!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-confia-dark to-confia-green relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-white/5"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white/10"></div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-confia-light rounded-xl mb-4 text-confia-green">
                    <PieChart size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 font-display">CONFIA</h1>
                <p className="text-gray-500 mt-2">Seu ERP Financeiro Inteligente</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
            
            {message && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                    {message}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-confia-green hover:bg-confia-dark text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
                    {!loading && <LogIn size={18} />}
                </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm">
                <button 
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-gray-600 hover:text-confia-green font-medium"
                >
                    {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Fazer login'}
                </button>
                
                {mode === 'login' && (
                    <button onClick={handleResetPassword} className="text-gray-400 hover:text-gray-600">
                        Esqueci minha senha
                    </button>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                    onClick={onDemoLogin}
                    className="w-full bg-confia-gold hover:bg-confia-goldHover text-confia-dark font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                    Acessar Demonstração (Sem Login)
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                    Explore os recursos sem criar conta.
                </p>
            </div>
        </div>
    </div>
  );
};

export default Auth;
