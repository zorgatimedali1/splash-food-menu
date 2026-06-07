import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useSupplements, useCreateSupplement, useUpdateSupplement, useDeleteSupplement, type Supplement } from '../hooks/useApi';
import Modal from '../components/Modal';

function SupplementForm({
  initial, onSubmit, loading
}: {
  initial?: Supplement;
  onSubmit: (data: { name: string; price: number }) => void;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(String(initial?.price || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, price: parseFloat(price) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nom du supplément *</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Fromage" />
      </div>
      <div>
        <label className="label">Prix (DT) *</label>
        <input className="input" type="number" step="0.5" min="0" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.000" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer le supplément'}
      </button>
    </form>
  );
}

export default function Supplements() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplement | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useSupplements();
  const createSupplement = useCreateSupplement();
  const updateSupplement = useUpdateSupplement();
  const deleteSupplement = useDeleteSupplement();

  const supplements = data?.data || [];

  const handleSubmit = async (formData: { name: string; price: number }) => {
    if (editing) await updateSupplement.mutateAsync({ id: editing.id, ...formData });
    else await createSupplement.mutateAsync(formData);
    setModalOpen(false);
  };

  const handleToggle = async (s: Supplement) => {
    await updateSupplement.mutateAsync({ id: s.id, is_active: s.is_active ? 0 : 1 });
  };

  const handleDelete = async () => {
    if (deleteId) await deleteSupplement.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus size={15} /> Nouveau supplément
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-splash-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Nom</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Prix</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-splash-gray uppercase tracking-wide">Actif</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-splash-border animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-16 ml-auto" /></td>
                  <td className="px-4 py-3"><div className="h-5 w-9 bg-splash-light-gray rounded-full mx-auto" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : supplements.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-splash-gray text-sm">Aucun supplément</td>
              </tr>
            ) : supplements.map(s => (
              <tr key={s.id} className="border-b border-splash-border last:border-0 hover:bg-splash-light-gray/30 transition-colors">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">+{s.price.toFixed(3)} DT</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(s)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${s.is_active ? 'bg-black' : 'bg-splash-border'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm ${s.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(s); setModalOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-splash-light-gray transition-colors">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le supplément' : 'Nouveau supplément'} size="sm">
        <SupplementForm initial={editing} onSubmit={handleSubmit} loading={createSupplement.isPending || updateSupplement.isPending} />
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Supprimer le supplément" size="sm">
        <p className="text-sm text-splash-gray mb-6">Ce supplément sera définitivement supprimé.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Annuler</button>
          <button onClick={handleDelete} disabled={deleteSupplement.isPending} className="btn-danger flex-1">
            {deleteSupplement.isPending ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
