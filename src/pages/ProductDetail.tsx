import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import Img from '@/components/Img';
import { useCart } from '@/context/CartContext';
import {
  SUPPLÉMENTS_PRODUCTS,
  DELIVERY_FEE,
  WHATSAPP_NUMBER,
  getProductBySlug,
} from '@/data';

const ADDRESS_STORAGE_KEY = 'splashfood_delivery_address';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(slug);
  }, [slug]);

  const { addToCart } = useCart();

  const [selectedSupps, setSelectedSupps] = useState<Set<string>>(new Set());
  const [instructions, setInstructions] = useState('');
  const [address, setAddress] = useState(() => {
    try { return sessionStorage.getItem(ADDRESS_STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [addressError, setAddressError] = useState(false);

  useEffect(() => {
    try { sessionStorage.setItem(ADDRESS_STORAGE_KEY, address); } catch {}
  }, [address]);

  const toggleSupp = useCallback((name: string) => {
    setSelectedSupps((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    const selected = SUPPLÉMENTS_PRODUCTS.filter((s) => selectedSupps.has(s.name));
    addToCart({
      category: product.category,
      name: product.name,
      price: product.price,
      image: product.image,
      supplements: selected.length > 0 ? selected : undefined,
      instructions: instructions.trim() || undefined,
    });
    toast.success('Produit ajouté au panier', {
      style: {
        background: '#000000',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 20px',
      },
    });
  }, [product, selectedSupps, instructions, address, addToCart]);

  const total = useMemo(() => {
    if (!product) return 0;
    let sum = product.price;
    SUPPLÉMENTS_PRODUCTS.forEach((s) => {
      if (selectedSupps.has(s.name)) sum += s.price;
    });
    return sum + DELIVERY_FEE;
  }, [product, selectedSupps]);

  const whatsappMessage = useMemo(() => {
    if (!product) return '';
    const lines: string[] = [
      'Bonjour Splash Food Resto !',
      '',
      'Commande :',
      `- ${product.category} ${product.name} x1 — ${product.price} DT`,
    ];

    const selected = SUPPLÉMENTS_PRODUCTS.filter((s) => selectedSupps.has(s.name));
    if (selected.length > 0) {
      lines.push('');
      lines.push('Suppléments :');
      selected.forEach((s) => lines.push(`- ${s.name} — ${s.price} DT`));
    }

    lines.push('');
    lines.push(`Sous-total : ${product.price + selected.reduce((a, s) => a + s.price, 0)} DT`);
    lines.push(`Livraison : ${DELIVERY_FEE} DT`);
    lines.push(`Total : ${total} DT`);

    if (instructions.trim()) {
      lines.push('');
      lines.push(`Instructions : ${instructions.trim()}`);
    }

    if (address.trim()) {
      lines.push('');
      lines.push(`Adresse de livraison : ${address.trim()}`);
    }

    lines.push('');
    lines.push('Merci !');

    return encodeURIComponent(lines.join('\n'));
  }, [product, selectedSupps, instructions, address, total]);

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <PageHeader title="PRODUIT" breadcrumb="Produit" />
        <div className="section-container py-20 text-center">
          <p className="text-splash-gray mb-6">Produit introuvable</p>
          <Link to="/menu" className="text-black underline font-semibold">
            Retour au menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title={`${product.category} ${product.name}`} breadcrumb={`Menu / ${product.category}`} />

      <section className="py-10 md:py-16">
        <div className="section-container">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-splash-border text-sm font-montserrat font-bold text-black hover:bg-black hover:text-white hover:border-black transition-all duration-300 mb-8 group"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={16} />
            Retour au menu
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Left — Product Image & Info */}
            <div className="lg:col-span-3">
              <div className="sticky top-28">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-splash-border shadow-sm">
                  <Img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6">
                  <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight">
                    {product.category} {product.name}
                  </h1>
                  <p className="mt-3 text-base text-splash-gray leading-relaxed max-w-xl">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Order Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-white border border-splash-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-montserrat text-lg font-bold text-black uppercase tracking-tight mb-6">
                  Votre commande
                </h3>

                {/* Selected Product */}
                <div className="flex items-center justify-between pb-4 border-b border-splash-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-splash-border flex-shrink-0">
                      <Img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-bold text-black">{product.category} {product.name}</p>
                      <p className="text-xs text-splash-gray">{product.category}</p>
                    </div>
                  </div>
                  <span className="font-montserrat text-sm font-extrabold text-black">
                    {product.price} DT
                  </span>
                </div>

                {/* Suppléments */}
                <div className="py-4 border-b border-splash-border">
                  <p className="font-montserrat text-xs font-bold text-black uppercase tracking-wider mb-3">
                    Suppléments
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {SUPPLÉMENTS_PRODUCTS.map((s) => {
                      const isSelected = selectedSupps.has(s.name);
                      return (
                        <button
                          key={s.name}
                          onClick={() => toggleSupp(s.name)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-black bg-black/5'
                              : 'border-splash-border hover:border-black/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-black border-black text-white'
                                  : 'border-splash-border'
                              }`}
                            >
                              {isSelected && <FiCheck size={10} />}
                            </div>
                            <span className="font-inter text-sm text-black">{s.name}</span>
                          </div>
                          <span className="font-montserrat text-xs font-bold text-black">
                            {s.price} DT
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between py-3 border-b border-splash-border">
                  <span className="font-inter text-sm text-splash-gray">Livraison</span>
                  <span className="font-montserrat text-sm font-bold text-black">{DELIVERY_FEE} DT</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-4 border-b border-splash-border">
                  <span className="font-montserrat text-base font-extrabold text-black uppercase">Total</span>
                  <span className="font-montserrat text-xl font-extrabold text-black">{total} DT</span>
                </div>

                {/* Special Instructions */}
                <div className="py-4 border-b border-splash-border">
                  <label className="font-montserrat text-xs font-bold text-black uppercase tracking-wider block mb-2">
                    Instructions spéciales
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: m8ir hrissa, sans oignons, bien cuit..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-splash-border bg-white text-sm text-black placeholder:text-splash-gray/50 font-inter resize-none focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Address */}
                <div className="py-4 border-b border-splash-border">
                  <label className="font-montserrat text-xs font-bold text-black uppercase tracking-wider block mb-2">
                    Adresse de livraison <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); if (e.target.value.trim()) setAddressError(false); }}
                    placeholder="Ex: Avenue 14 Janvier, Kalaa Kebira, près du marché..."
                    rows={2}
                    className={`w-full px-3 py-2.5 rounded-lg border bg-white text-sm text-black placeholder:text-splash-gray/50 font-inter resize-none focus:outline-none transition-colors ${
                      addressError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-splash-border focus:border-black'
                    }`}
                  />
                  {addressError && (
                    <p className="text-xs text-red-500 font-inter mt-1">
                      Veuillez entrer votre adresse de livraison
                    </p>
                  )}
                </div>

                {/* Ajouter au panier */}
                <div className="pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white font-montserrat font-bold text-sm hover:bg-black/80 active:scale-[0.98] transition-all duration-300"
                  >
                    <FiShoppingCart size={16} />
                    Ajouter au panier
                  </button>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={() => {
                    if (!address.trim()) { setAddressError(true); return; }
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank', 'noopener');
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-montserrat font-bold text-sm text-white bg-[#25D366] hover:bg-[#1DA851] active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Commander via WhatsApp
                </button>
                <p className="mt-2 text-xs text-splash-gray text-center">
                  Vous serez redirigé vers WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
