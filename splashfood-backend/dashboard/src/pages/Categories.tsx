import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, type Category } from '../hooks/useApi';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import { imageUrl } from '../lib/imageUrl';

function CategoryForm({
  initial, onSubmit, loading
}: {
  initial?: Category;
  onSubmit: (form: FormData) => void;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order || 0));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(!file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name.toUpperCase());
    fd.append('description', description);
    fd.append('sort_order', sortOrder);
    if (imageFile) fd.append('image', imageFile);
    if (removeImage) fd.append('remove_image', '1');
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nom de la catégorie *</label>
        <input className="input uppercase" value={name} onChange={e => setName(e.target.value.toUpperCase())} required placeholder="Ex: PIZZA" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description…" />
      </div>
      <div>
        <label className="label">Ordre d'affichage</label>
        <input className="input" type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
      </div>
      <ImageUpload value={initial?.image_url} onChange={handleImageChange} label="Image de la catégorie" />
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer la catégorie'}
      </button>
    </form>
  );
}

export default function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = data?.data || [];

  const handleSubmit = async (form: FormData) => {
    if (editing) await updateCategory.mutateAsync({ id: editing.id, form });
    else await createCategory.mutateAsync(form);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) await deleteCategory.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <FiPlus size={15} /> Nouvelle catégorie
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="w-full aspect-video bg-splash-light-gray rounded-xl mb-3" />
              <div className="h-4 bg-splash-light-gray rounded w-3/4" />
              <div className="h-3 bg-splash-light-gray rounded w-1/2 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="card p-4 group">
              {cat.image_url ? (
                <img src={imageUrl(cat.image_url)} alt={cat.name} loading="lazy"
                  className="w-full aspect-video object-cover rounded-xl mb-3 border border-splash-border" />
              ) : (
                <div className="w-full aspect-video bg-splash-light-gray rounded-xl mb-3 flex items-center justify-center">
                  <span className="font-montserrat font-bold text-2xl text-splash-gray">{cat.name[0]}</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-montserrat font-bold text-sm truncate">{cat.name}</p>
                  <p className="text-xs text-splash-gray mt-0.5">
                    {(cat as Category & { product_count?: number }).product_count || 0} produit(s)
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => { setEditing(cat); setModalOpen(true); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-splash-light-gray transition-colors"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
              <span className="mt-2 inline-flex px-2 py-0.5 rounded-lg bg-splash-light-gray text-xs text-splash-gray">
                Ordre #{cat.sort_order}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
        <CategoryForm initial={editing} onSubmit={handleSubmit} loading={createCategory.isPending || updateCategory.isPending} />
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Supprimer la catégorie" size="sm">
        <p className="text-sm text-splash-gray mb-6">La catégorie sera masquée. Les produits liés ne seront pas supprimés.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Annuler</button>
          <button onClick={handleDelete} disabled={deleteCategory.isPending} className="btn-danger flex-1">
            {deleteCategory.isPending ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
