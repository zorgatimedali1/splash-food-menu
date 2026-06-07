import { useState } from 'react';
import { FiMail, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useMessages, useMarkMessageRead, useDeleteMessage, type ContactMessage } from '../hooks/useApi';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

const fmtDate = (s: string) => new Date(s).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Messages() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<number | undefined>(undefined);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useMessages({ is_read: filter, page });
  const markRead = useMarkMessageRead();
  const deleteMsg = useDeleteMessage();

  const messages = data?.data || [];

  const handleOpen = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) await markRead.mutateAsync(msg.id);
  };

  const handleDelete = async () => {
    if (deleteId) await deleteMsg.mutateAsync(deleteId);
    setDeleteId(null);
    if (selected?.id === deleteId) setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-xl border border-splash-border overflow-hidden">
          {[
            { label: 'Tous', value: undefined },
            { label: 'Non lus', value: 0 },
            { label: 'Lus', value: 1 },
          ].map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => { setFilter(opt.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === opt.value ? 'bg-black text-white' : 'bg-white text-splash-gray hover:bg-splash-light-gray'
              }`}
            >{opt.label}</button>
          ))}
        </div>
        {data && <span className="text-sm text-splash-gray">{data.total} message{data.total !== 1 ? 's' : ''}</span>}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-splash-border">
              <th className="px-4 py-3 w-3" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Expéditeur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide hidden md:table-cell">Sujet</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide hidden lg:table-cell">Message</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-splash-border animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded" /></td>
                  ))}
                </tr>
              ))
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-splash-gray text-sm">Aucun message</td>
              </tr>
            ) : messages.map(msg => (
              <tr
                key={msg.id}
                className={`border-b border-splash-border last:border-0 cursor-pointer transition-colors ${
                  msg.is_read ? 'hover:bg-splash-light-gray/30' : 'bg-blue-50/30 hover:bg-blue-50/50 font-medium'
                }`}
                onClick={() => handleOpen(msg)}
              >
                <td className="px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${msg.is_read ? 'bg-transparent' : 'bg-blue-500'}`} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm">{msg.name}</p>
                  <p className="text-xs text-splash-gray">{msg.email}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-sm text-splash-gray">{msg.subject || '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-sm text-splash-gray">
                  <span className="truncate block max-w-xs">{msg.message}</span>
                </td>
                <td className="px-4 py-3 text-xs text-splash-gray whitespace-nowrap">{fmtDate(msg.created_at)}</td>
                <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {!msg.is_read && (
                      <button
                        onClick={() => markRead.mutate(msg.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-splash-light-gray transition-colors text-blue-500"
                        title="Marquer comme lu"
                      >
                        <FiCheckCircle size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(msg.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && (
          <div className="px-4 pb-4">
            <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Message detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label">De</p>
                <p className="font-medium">{selected.name}</p>
                <p className="text-splash-gray">{selected.email}</p>
              </div>
              <div>
                <p className="label">Reçu le</p>
                <p>{fmtDate(selected.created_at)}</p>
              </div>
            </div>
            {selected.subject && (
              <div>
                <p className="label">Sujet</p>
                <p className="text-sm font-medium">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="label">Message</p>
              <div className="bg-splash-light-gray rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Votre message'}`}
                className="btn-primary flex items-center gap-2"
              >
                <FiMail size={14} /> Répondre
              </a>
              <button
                onClick={() => { setDeleteId(selected.id); setSelected(null); }}
                className="btn-danger flex items-center gap-2"
              >
                <FiTrash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Supprimer le message" size="sm">
        <p className="text-sm text-splash-gray mb-6">Ce message sera définitivement supprimé.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Annuler</button>
          <button onClick={handleDelete} disabled={deleteMsg.isPending} className="btn-danger flex-1">
            {deleteMsg.isPending ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
