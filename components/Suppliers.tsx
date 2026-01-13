import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  onAdd: (s: Omit<Supplier, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '', cnpj: '', phone: '', email: '', product_service: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    setIsModalOpen(false);
    setFormData({ name: '', cnpj: '', phone: '', email: '', product_service: '' });
  };

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.product_service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 font-display">Gestão de Fornecedores</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-confia-green hover:bg-confia-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou produto/serviço..." 
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="p-4">Razão Social</th>
                <th className="p-4">CNPJ</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Produto/Serviço</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{s.name}</td>
                  <td className="p-4">{s.cnpj}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{s.email}</span>
                      <span className="text-xs text-gray-400">{s.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">{s.product_service}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                      </button>
                      <button 
                          onClick={() => onDelete(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                          <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                  <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">Nenhum fornecedor encontrado.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Novo Fornecedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto ou Serviço</label>
                <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                  value={formData.product_service} onChange={e => setFormData({...formData, product_service: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-confia-green text-white rounded-lg hover:bg-confia-dark">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;