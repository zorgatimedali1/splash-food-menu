import { useState } from 'react';
import { FiShoppingCart, FiDollarSign, FiShoppingBag, FiClock } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStats, useRevenueStats, useTopProducts, useRecentOrders } from '../hooks/useApi';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';

const PERIODS = [
  { value: 'daily', label: 'Jour' },
  { value: 'weekly', label: 'Semaine' },
  { value: 'monthly', label: 'Mois' },
];

const fmt = (n: number) => new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 0 }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

export default function Overview() {
  const [period, setPeriod] = useState('daily');
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: revenueData } = useRevenueStats(period);
  const { data: topData } = useTopProducts();
  const { data: recentData } = useRecentOrders();

  const stats = statsData?.data;
  const revenue = revenueData?.data || [];
  const topProducts = topData?.data || [];
  const recentOrders = recentData?.data || [];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Commandes totales"
          value={statsLoading ? '…' : fmt(stats?.total_orders || 0)}
          icon={<FiShoppingCart size={20} />}
          color="bg-blue-50"
        />
        <StatsCard
          label="Revenu total"
          value={statsLoading ? '…' : `${fmt(stats?.total_revenue || 0)} DT`}
          icon={<FiDollarSign size={20} />}
          color="bg-green-50"
        />
        <StatsCard
          label="Produits actifs"
          value={statsLoading ? '…' : fmt(stats?.active_products || 0)}
          icon={<FiShoppingBag size={20} />}
          color="bg-purple-50"
        />
        <StatsCard
          label="En attente"
          value={statsLoading ? '…' : fmt(stats?.pending_orders || 0)}
          icon={<FiClock size={20} />}
          sub="commandes en attente"
          color="bg-yellow-50"
        />
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-base">Revenus</h2>
          <div className="flex rounded-xl border border-splash-border overflow-hidden">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p.value ? 'bg-black text-white' : 'bg-white text-splash-gray hover:bg-splash-light-gray'
                }`}
              >{p.label}</button>
            ))}
          </div>
        </div>
        {revenue.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-splash-gray">Pas de données</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#808080' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#808080' }} tickLine={false} axisLine={false} tickFormatter={v => `${v} DT`} />
              <Tooltip
                contentStyle={{ border: '1px solid #E5E5E5', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`${fmt(v)} DT`, 'Revenu']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-montserrat font-bold text-base mb-4">Top Produits</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-splash-gray py-4 text-center">Pas de données</p>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 8).map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-splash-gray w-5 shrink-0">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-splash-gray">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{fmt(p.order_count)} cmd</p>
                    <p className="text-xs text-splash-gray">{fmt(p.total_revenue)} DT</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-6">
          <h2 className="font-montserrat font-bold text-base mb-4">Commandes récentes</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-splash-gray py-4 text-center">Aucune commande</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between gap-2 py-2 border-b border-splash-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">#{order.id} {order.customer_name || 'Anonyme'}</p>
                    <p className="text-xs text-splash-gray">{fmtDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold">{order.total ? `${fmt(order.total)} DT` : '—'}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
