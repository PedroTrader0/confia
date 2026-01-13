import React, { useState, useEffect } from 'react';
import { supabase, mockService } from './supabaseClient';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Transactions from './components/Transactions';
import AIChat from './components/AIChat';
import { Customer, Supplier, Transaction, DashboardStats } from './types';
import { Menu, PieChart } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoMode, setDemoMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Check Supabase session or fallback to demo
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    if (session && supabase) {
      // Real Supabase Fetch
      const { data: c } = await supabase.from('clientes').select('*');
      const { data: s } = await supabase.from('fornecedores').select('*');
      const { data: t } = await supabase.from('lancamentos').select('*');
      
      if (c) setCustomers(c);
      if (s) setSuppliers(s);
      if (t) setTransactions(t);
    } else if (demoMode) {
      // Mock Fetch
      setCustomers(await mockService.getCustomers());
      setSuppliers(await mockService.getSuppliers());
      setTransactions(await mockService.getTransactions());
    }
  };

  useEffect(() => {
    if (session || demoMode) {
      fetchData();
    }
  }, [session, demoMode]);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setDemoMode(false);
    setSidebarOpen(false);
  };

  const calculateStats = (): DashboardStats => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense
    };
  };

  // --- Actions ---

  const addCustomer = async (data: Omit<Customer, 'id'>) => {
    if (session && supabase) {
      const { error } = await supabase.from('clientes').insert([{ ...data, usuario_id: session.user.id }]);
      if (error) alert('Erro ao salvar cliente: ' + error.message);
    } else {
      await mockService.createCustomer(data);
    }
    fetchData();
  };

  const deleteCustomer = async (id: string) => {
    if (session && supabase) {
       await supabase.from('clientes').delete().eq('id', id);
    } else {
       await mockService.deleteCustomer(id);
    }
    fetchData();
  };

  const addSupplier = async (data: Omit<Supplier, 'id'>) => {
    if (session && supabase) {
      const { error } = await supabase.from('fornecedores').insert([{ ...data, usuario_id: session.user.id }]);
       if (error) alert('Erro ao salvar fornecedor: ' + error.message);
    } else {
      await mockService.createSupplier(data);
    }
    fetchData();
  };

  const deleteSupplier = async (id: string) => {
    if (session && supabase) {
      await supabase.from('fornecedores').delete().eq('id', id);
    } else {
      await mockService.deleteSupplier(id);
    }
    fetchData();
  };

  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    if (session && supabase) {
      const { error } = await supabase.from('lancamentos').insert([{ ...data, usuario_id: session.user.id }]);
       if (error) alert('Erro ao salvar lançamento: ' + error.message);
    } else {
      await mockService.createTransaction(data);
    }
    fetchData();
  };

  const deleteTransaction = async (id: string) => {
    if (session && supabase) {
      await supabase.from('lancamentos').delete().eq('id', id);
    } else {
      await mockService.deleteTransaction(id);
    }
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-confia-light"><div className="animate-pulse text-confia-green text-xl font-bold">Carregando CONFIA...</div></div>;

  if (!session && !demoMode) {
    return <Auth onDemoLogin={() => setDemoMode(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        userEmail={session?.user?.email || 'usuario@demo.com'}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-confia-dark text-white p-4 flex items-center justify-between shadow-md z-30 shrink-0">
             <div className="flex items-center gap-2">
                <div className="bg-confia-gold p-1.5 rounded text-confia-dark">
                     <PieChart size={20} strokeWidth={2.5} />
                </div>
                <h1 className="font-bold font-display text-lg">CONFIA</h1>
             </div>
             <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <Menu size={24} />
             </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full scroll-smooth">
          {demoMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm text-sm" role="alert">
              <p className="font-bold">Modo de Demonstração</p>
              <p>Os dados são salvos localmente. Conecte o Supabase para nuvem.</p>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard stats={calculateStats()} transactions={transactions} />}
          {activeTab === 'customers' && <Customers customers={customers} onAdd={addCustomer} onDelete={deleteCustomer} />}
          {activeTab === 'suppliers' && <Suppliers suppliers={suppliers} onAdd={addSupplier} onDelete={deleteSupplier} />}
          {activeTab === 'transactions' && <Transactions transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
        </div>
      </main>
      
      <AIChat transactions={transactions} stats={calculateStats()} />
    </div>
  );
}

export default App;