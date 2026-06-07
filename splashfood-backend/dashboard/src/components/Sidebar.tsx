import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiShoppingBag, FiTag, FiPlusSquare, FiShoppingCart,
  FiMail, FiSettings, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { getPreference, setPreference } from '../lib/localStorage';
import { useState, useEffect } from 'react';

const NAV = [
  { to: '/admin', label: 'Aperçu', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Produits', icon: FiShoppingBag },
  { to: '/admin/categories', label: 'Catégories', icon: FiTag },
  { to: '/admin/supplements', label: 'Suppléments', icon: FiPlusSquare },
  { to: '/admin/orders', label: 'Commandes', icon: FiShoppingCart },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/settings', label: 'Paramètres', icon: FiSettings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => getPreference<boolean>('sidebar_collapsed', false));

  useEffect(() => { setPreference('sidebar_collapsed', collapsed); }, [collapsed]);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-black text-white flex flex-col transition-all duration-200 z-40 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/10 h-16 ${collapsed ? 'justify-center px-2' : 'px-6'}`}>
        {!collapsed && (
          <span className="font-montserrat font-800 text-sm tracking-widest">SPLASH FOOD</span>
        )}
        {collapsed && <span className="font-montserrat font-bold text-xs">SF</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-center h-12 border-t border-white/10 text-white/40 hover:text-white transition-colors"
        title={collapsed ? 'Agrandir' : 'Réduire'}
      >
        {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>
    </aside>
  );
}
