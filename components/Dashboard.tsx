import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Transaction, DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  
  // Prepare data for charts
  const income = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const chartData = [
    { name: 'Entradas', value: stats.totalIncome },
    { name: 'Saídas', value: stats.totalExpense },
  ];

  const COLORS = ['#007F3D', '#EF4444'];

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
        <h3 className={`text-2xl font-bold font-display ${color}`}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </h3>
      </div>
      <div className={`p-3 rounded-full ${bg}`}>
        <Icon size={24} className={color.replace('text-', 'text-opacity-80 ')} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 font-display">Painel de Controle</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Saldo Atual" 
          value={stats.balance} 
          icon={Wallet} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Total Entradas" 
          value={stats.totalIncome} 
          icon={TrendingUp} 
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard 
          title="Total Saídas" 
          value={stats.totalExpense} 
          icon={TrendingDown} 
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard 
          title="Lucro Líquido" 
          value={stats.netProfit} 
          icon={DollarSign} 
          color={stats.netProfit >= 0 ? "text-confia-green" : "text-red-600"}
          bg="bg-yellow-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo Financeiro</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#007F3D" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição</h3>
          <div className="h-72 flex justify-center items-center">
             {stats.totalIncome === 0 && stats.totalExpense === 0 ? (
                 <div className="text-gray-400 text-sm">Sem dados para exibir</div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos Lançamentos</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                    <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Descrição</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3 text-right">Valor</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {transactions.slice(0, 5).map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                            <td className="p-3">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                            <td className="p-3 text-gray-900 font-medium">{t.description}</td>
                            <td className="p-3">
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 border border-gray-200">
                                    {t.category}
                                </span>
                            </td>
                            <td className={`p-3 text-right font-bold ${t.type === 'income' ? 'text-confia-green' : 'text-red-500'}`}>
                                {t.type === 'expense' ? '-' : '+'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400">Nenhum lançamento registrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
