import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import {
  useProducts, useCategories, useCreateProduct, useUpdateProduct,
  useDeleteProduct, useToggleProduct, type Product
} from '../hooks/useApi';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import Pagination from '../components/Pagination';
import { getPreference, setPreference } from '../lib/localStorage';
import { imageUrl } from '../lib/imageUrl';

const fmt = (n: number) => n.toFixed(3).replace('.', ',');

function ProductForm({
  initial, categories, onSubmit, loading
}: {
  initial?: Product;
  categories: { id: number; name: string }[];
  onSubmit: (form: FormData) => void;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(String(initial?.price || ''));
  const [categoryId, setCategoryId] = useState(String(initial?.category_id || ''));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(!file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('price', price);
    fd.append('category_id', categoryId);
    if (imageFile) fd.append('image', imageFile);
    if (removeImage) fd.append('remove_image', '1');
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nom du produit *</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Tabouna Poulet" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Prix (DT) *</label>
          <input className="input" type="number" step="0.001" min="0" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.000" />
        </div>
        <div>
          <label className="label">Catégorie *</label>
          <select className="input" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Choisir…</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description du produit…" />
      </div>
      <ImageUpload value={initial?.image_url} onChange={handleImageChange} label="Photo du produit" />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer le produit'}
        </button>
      </div>
    </form>
  );
}

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(() => getPreference<string>('product_category', ''));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPreference('product_category', categoryFilter); setPage(1); }, [categoryFilter]);

  const { data, isLoading } = useProducts({ search: debouncedSearch, category: categoryFilter || undefined, page, limit: 20 });
  const { data: catData } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const toggleProduct = useToggleProduct();

  const products = data?.data || [];
  const categories = catData?.data || [];

  const openCreate = () => { setEditing(undefined); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };

  const handleSubmit = async (form: FormData) => {
    if (editing) {
      await updateProduct.mutateAsync({ id: editing.id, form });
    } else {
      await createProduct.mutateAsync(form);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct.mutateAsync(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-splash-gray" />
          <input
            className="input pl-9" placeholder="Rechercher un produit…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-48"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus size={15} /> Nouveau produit
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-splash-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide w-14">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-splash-gray uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Prix</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-splash-gray uppercase tracking-wide">Actif</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-splash-gray uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-splash-border animate-pulse">
                    <td className="px-4 py-3"><div className="w-10 h-10 bg-splash-light-gray rounded-lg" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-40" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-splash-light-gray rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-16 ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-9 bg-splash-light-gray rounded-full mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-splash-light-gray rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-splash-gray text-sm">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} className="border-b border-splash-border last:border-0 hover:bg-splash-light-gray/30 transition-colors">
                  <td className="px-4 py-3">
                    {product.image_url ? (
                      <img src={imageUrl(product.image_url)} alt={product.name} loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover border border-splash-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-splash-light-gray flex items-center justify-center text-splash-gray text-xs">
                        {product.name[0]}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    {product.description && <p className="text-xs text-splash-gray mt-0.5 truncate max-w-xs">{product.description}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex px-2 py-0.5 rounded-lg bg-splash-light-gray text-xs font-medium">
                      {product.category_name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(product.price)} DT</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleProduct.mutate(product.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.is_active ? 'bg-black' : 'bg-splash-border'}`}
                      title={product.is_active ? 'Désactiver' : 'Activer'}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm ${product.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-splash-light-gray transition-colors" title="Modifier">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Supprimer">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
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

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le produit' : 'Nouveau produit'} size="md">
        <ProductForm
          initial={editing}
          categories={categories}
          onSubmit={handleSubmit}
          loading={createProduct.isPending || updateProduct.isPending}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Supprimer le produit" size="sm">
        <p className="text-sm text-splash-gray mb-6">Cette action est irréversible. Le produit sera masqué du menu.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Annuler</button>
          <button onClick={() => deleteId && handleDelete(deleteId)} disabled={deleteProduct.isPending} className="btn-danger flex-1">
            {deleteProduct.isPending ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
