import React, { useState, useRef } from 'react';
import { Plus, Trash2, Search, X, ArrowUpCircle, ArrowDownCircle, Upload, ScanLine } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { analyzeReceipt } from '../services/geminiService';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'expense', amount: 0, date: new Date().toISOString().split('T')[0], category: 'Outros', description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure amount is number
    await onAdd({ ...formData, amount: Number(formData.amount) });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
        type: 'expense', amount: 0, date: new Date().toISOString().split('T')[0], category: 'Outros', description: ''
    });
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      setAnalyzing(true);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        const result = await analyzeReceipt(base64Data);
        
        if (result) {
            setFormData(prev => ({
                ...prev,
                amount: result.amount || prev.amount,
                date: result.date || prev.date,
                description: result.description || prev.description,
                category: result.category || prev.category,
                type: 'expense'
            }));
        } else {
            alert('Não foi possível analisar o recibo. Verifique a chave da API.');
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const filtered = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 font-display">Lançamentos</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto bg-confia-green hover:bg-confia-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Search className="text-gray-400" size={20} />
            <input 
            type="text" 
            placeholder="Filtrar descrição..." 
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setFilterType('all')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Todos</button>
            <button onClick={() => setFilterType('income')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${filterType === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}>Entradas</button>
            <button onClick={() => setFilterType('expense')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${filterType === 'expense' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}>Saídas</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Valor</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                      {t.type === 'income' 
                          ? <span className="flex items-center gap-1 text-emerald-600 font-medium"><ArrowUpCircle size={16}/> Entrada</span> 
                          : <span className="flex items-center gap-1 text-red-600 font-medium"><ArrowDownCircle size={16}/> Saída</span>
                      }
                  </td>
                  <td className="p-4 font-medium text-gray-900">{t.description}</td>
                  <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">{t.category}</span></td>
                  <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-confia-green' : 'text-red-500'}`}>
                      {t.type === 'expense' && '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="p-4 text-center">
                      <button 
                          onClick={() => onDelete(t.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                          <Trash2 size={16} />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold text-gray-800 border-t">
                <tr>
                    <td colSpan={4} className="p-4 text-right">Totais do Período:</td>
                    <td className="p-4 text-right">
                        <div className="flex flex-col">
                          <span className="text-emerald-600 text-xs">+ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}</span>
                          <span className="text-red-600 text-xs">- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}</span>
                          <span className="border-t border-gray-300 mt-1 pt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</span>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Novo Lançamento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* AI Receipt Upload */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <ScanLine size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-900">IA Scanner de Recibos</p>
                        <p className="text-xs text-blue-700">Preencha automaticamente com uma foto</p>
                    </div>
                </div>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={analyzing}
                    className="w-full sm:w-auto justify-center text-sm bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                    {analyzing ? 'Analisando...' : <><Upload size={14} /> Upload</>}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select 
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none bg-white"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                    >
                        <option value="income">Entrada</option>
                        <option value="expense">Saída</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input required type="date" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input list="categories" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    <datalist id="categories">
                        <option value="Vendas" />
                        <option value="Serviços" />
                        <option value="Alimentação" />
                        <option value="Transporte" />
                        <option value="Aluguel" />
                        <option value="Fornecedores" />
                        <option value="Outros" />
                    </datalist>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-confia-green text-white rounded-lg hover:bg-confia-dark">Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;