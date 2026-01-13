import React from 'react';
import { LayoutDashboard, Users, Truck, ArrowRightLeft, LogOut, PieChart, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, userEmail, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'transactions', label: 'Lançamentos', icon: ArrowRightLeft },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-confia-dark text-white shadow-xl 
        transform transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-confia-green/30">
          <div className="flex items-center gap-2">
              <div className="bg-confia-gold p-2 rounded-lg text-confia-dark">
                  <PieChart size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold font-display tracking-tight">CONFIA</h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-confia-green text-white shadow-md font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-confia-green/30 bg-black/10 mt-auto">
          <div className="mb-4 px-2">
              <p className="text-xs text-gray-400 uppercase font-semibold">Logado como</p>
              <p className="text-sm text-gray-200 truncate" title={userEmail}>{userEmail}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;