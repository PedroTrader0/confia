import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  onAdd: (c: Omit<Customer, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Customers: React.FC<CustomersProps> = ({ customers, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '', cpf_cnpj: '', phone: '', email: '', notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    setIsModalOpen(false);
    setFormData({ name: '', cpf_cnpj: '', phone: '', email: '', notes: '' });
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf_cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 font-display">Gestão de Clientes</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-confia-green hover:bg-confia-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou CPF/CNPJ..." 
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">CPF/CNPJ</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Observações</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4">{c.cpf_cnpj}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{c.email}</span>
                      <span className="text-xs text-gray-400">{c.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 truncate max-w-xs">{c.notes}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar (Demo: N/A)">
                          <Edit2 size={16} />
                      </button>
                      <button 
                          onClick={() => onDelete(c.id)}
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
                      <td colSpan={5} className="p-8 text-center text-gray-400">Nenhum cliente encontrado.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" 
                    value={formData.cpf_cnpj} onChange={e => setFormData({...formData, cpf_cnpj: e.target.value})} />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-confia-green/20 focus:border-confia-green outline-none" rows={3}
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
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

export default Customers;