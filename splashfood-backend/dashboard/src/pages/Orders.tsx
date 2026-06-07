import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useOrders, useUpdateOrderStatus, type Order } from '../hooks/useApi';
import StatusBadge, { STATUS_CONFIG } from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import { getPreference, setPreference } from '../lib/localStorage';

const fmt = (n: number) => n.toFixed(3).replace('.', ',');
const fmtDate = (s: string) => new Date(s).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

interface ParsedItem {
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number;
  supplements?: { name: string; price: number }[];
  instructions?: string;
}

function parseItems(items: string): ParsedItem[] {
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function OrderRow({ order, onStatusChange }: { order: Order; onStatusChange: (id: number, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const items = parseItems(order.items);

  return (
    <>
      <tr
        className="border-b border-splash-border hover:bg-splash-light-gray/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-4 py-3 font-mono text-sm font-medium">#{order.id}</td>
        <td className="px-4 py-3">
          <p className="font-medium text-sm">{order.customer_name || '—'}</p>
          {order.customer_phone && <p className="text-xs text-splash-gray">{order.customer_phone}</p>}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-sm text-splash-gray truncate max-w-xs">{order.customer_address || '—'}</p>
        </td>
        <td className="px-4 py-3 text-center text-sm">{items.length} article{items.length !== 1 ? 's' : ''}</td>
        <td className="px-4 py-3 text-right font-semibold tabular-nums text-sm">
          {order.total ? `${fmt(order.total)} DT` : '—'}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>
        <td className="px-4 py-3 text-xs text-splash-gray whitespace-nowrap">{fmtDate(order.created_at)}</td>
        <td className="px-4 py-3 text-right">
          {expanded ? <FiChevronUp size={16} className="text-splash-gray ml-auto" /> : <FiChevronDown size={16} className="text-splash-gray ml-auto" />}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-splash-border bg-splash-light-gray/20">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order items */}
              <div>
                <p className="text-xs font-semibold text-splash-gray uppercase tracking-wide mb-3">Articles commandés</p>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between gap-2 text-sm">
                      <div>
                        <span className="font-medium">{item.quantity || 1}× {item.product_name || item.name || 'Produit'}</span>
                        {item.supplements && item.supplements.length > 0 && (
                          <p className="text-xs text-splash-gray mt-0.5">+ {item.supplements.map(s => s.name).join(', ')}</p>
                        )}
                        {item.instructions && <p className="text-xs text-splash-gray italic mt-0.5">"{item.instructions}"</p>}
                      </div>
                      <span className="font-semibold shrink-0">{item.price ? `${fmt(item.price)} DT` : ''}</span>
                    </div>
                  ))}
                  {order.delivery_fee !== null && (
                    <div className="flex justify-between text-sm text-splash-gray border-t border-splash-border pt-2 mt-2">
                      <span>Livraison</span>
                      <span>{fmt(order.delivery_fee || 0)} DT</span>
                    </div>
                  )}
                  {order.total !== null && (
                    <div className="flex justify-between text-sm font-bold border-t border-splash-border pt-2">
                      <span>Total</span>
                      <span>{fmt(order.total)} DT</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order info + status */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-splash-gray uppercase tracking-wide mb-2">Informations</p>
                  <div className="space-y-1 text-sm">
                    {order.customer_name && <p><span className="text-splash-gray">Nom:</span> {order.customer_name}</p>}
                    {order.customer_phone && <p><span className="text-splash-gray">Tél:</span> {order.customer_phone}</p>}
                    {order.customer_address && <p><span className="text-splash-gray">Adresse:</span> {order.customer_address}</p>}
                    {order.notes && <p><span className="text-splash-gray">Notes:</span> <span className="italic">{order.notes}</span></p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-splash-gray uppercase tracking-wide mb-2">Changer le statut</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                      <button
                        key={status}
                        onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, status); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          order.status === status
                            ? cfg.className + ' opacity-100'
                            : 'bg-white border-splash-border text-splash-gray hover:border-black hover:text-black'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Orders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(() => getPreference<string>('order_status', ''));
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => { setPreference('order_status', statusFilter); setPage(1); }, [statusFilter]);

  const { data, isLoading } = useOrders({
    status: statusFilter || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
    page, limit: 50,
  });
  const updateStatus = useUpdateOrderStatus();

  const orders = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="input w-48" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([v, cfg]) => (
            <option key={v} value={v}>{cfg.label}</option>
          ))}
        </select>
        <input type="date" className="input w-40" value={fromDate} onChange={e => setFromDate(e.target.value)} title="Du" />
        <input type="date" className="input w-40" value={toDate} onChange={e => setToDate(e.target.value)} title="Au" />
        {(statusFilter || fromDate || toDate) && (
          <button onClick={() => { setStatusFilter(''); setFromDate(''); setToDate(''); }} className="btn-secondary">
            Réinitialiser
          </button>
        )}
        {data && (
          <span className="ml-auto self-center text-sm text-splash-gray">{data.total} commande{data.total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-splash-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide hidden md:table-cell">Adresse</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-splash-gray uppercase tracking-wide">Articles</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-splash-border animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-splash-gray text-sm">Aucune commande trouvée</td>
                </tr>
              ) : orders.map(order => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                />
              ))}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="px-4 pb-4">
            <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
