import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-splash-border">
      <p className="text-xs text-splash-gray">{from}–{to} sur {total}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-splash-border bg-white hover:bg-splash-light-gray disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p = i + 1;
          if (totalPages > 5) {
            if (page <= 3) p = i + 1;
            else if (page >= totalPages - 2) p = totalPages - 4 + i;
            else p = page - 2 + i;
          }
          return (
            <button
              key={p} onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-black text-white' : 'border border-splash-border bg-white hover:bg-splash-light-gray'
              }`}
            >{p}</button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-splash-border bg-white hover:bg-splash-light-gray disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
