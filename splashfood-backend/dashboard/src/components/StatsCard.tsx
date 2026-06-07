import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  sub?: string;
  color?: string;
}

export default function StatsCard({ label, value, icon, sub, color = 'bg-splash-light-gray' }: Props) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-splash-gray uppercase tracking-wide">{label}</p>
        <p className="font-montserrat font-bold text-2xl mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-splash-gray mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
