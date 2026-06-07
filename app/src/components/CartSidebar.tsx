import { useEffect, useMemo, useState } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Img from '@/components/Img';
import { useCart, getCartProductKey, getCartItemUnitPrice } from '@/context/CartContext';
import { useSettings } from '@/hooks/useMenuApi';

const ADDRESS_STORAGE_KEY = 'splashfood_delivery_address';

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalItems, subtotal, increment, decrement, removeFromCart } = useCart();
  const { settings } = useSettings();
  const [address, setAddress] = useState(() => {
    try { return sessionStorage.getItem(ADDRESS_STORAGE_KEY) || ''; } catch { return ''; }
  });

  const deliveryFee = settings ? Number(settings.delivery_fee) || 2 : 2;
  const whatsappNumber = settings?.whatsapp_number || '21699744593';

  useEffect(() => {
    try { sessionStorage.setItem(ADDRESS_STORAGE_KEY, address); } catch {}
  }, [address]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      try {
        const saved = sessionStorage.getItem(ADDRESS_STORAGE_KEY);
        if (saved !== null) setAddress(saved);
      } catch {}
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const [addressError, setAddressError] = useState(false);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const whatsappMessage = useMemo(() => {
    if (items.length === 0) return '';
    const lines: string[] = [
      'Bonjour Splash Food Resto !',
      '',
      'Ma commande :',
    ];
    items.forEach(({ product, quantity }) => {
      const unitPrice = getCartItemUnitPrice(product);
      lines.push(`- ${product.category} ${product.name} x${quantity} — ${(unitPrice * quantity).toFixed(3)} DT`);
      if (product.supplements && product.supplements.length > 0) {
        product.supplements.forEach((s) => lines.push(`  + ${s.name} — ${s.price} DT`));
      }
      if (product.instructions) {
        lines.push(`  Note : ${product.instructions}`);
      }
    });
    lines.push('');
    lines.push(`Sous-total : ${subtotal.toFixed(3)} DT`);
    lines.push(`Livraison : ${deliveryFee} DT`);
    lines.push(`Total : ${total.toFixed(3)} DT`);
    lines.push('');
    lines.push(`Adresse de livraison : ${address.trim()}`);
    lines.push('');
    lines.push('Merci !');
    return encodeURIComponent(lines.join('\n'));
  }, [items, subtotal, total, address, deliveryFee]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (e.target.value.trim()) setAddressError(false);
  };

  const handleWhatsAppClick = () => {
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank', 'noopener');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          onClick={closeCart}
          aria-label="Fermer le panier"
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-400 ease-out flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-splash-border">
            <div>
              <h2 className="font-montserrat text-lg font-extrabold text-black uppercase tracking-tight">
                Votre panier
              </h2>
              <p className="text-xs text-splash-gray font-inter mt-0.5">
                {totalItems} {totalItems > 1 ? 'articles' : 'article'}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 -mr-2 text-black hover:text-splash-gray transition-colors"
              aria-label="Fermer le panier"
            >
              <FiX size={22} />
            </button>
          </div>

          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="size-20 rounded-full bg-splash-light-gray flex items-center justify-center mb-5">
                <FiShoppingCart size={32} className="text-splash-gray" />
              </div>
              <p className="font-montserrat text-base font-bold text-black">
                Votre panier est vide
              </p>
              <p className="text-sm text-splash-gray font-inter mt-1 mb-6 text-center">
                Ajoutez des produits depuis notre menu
              </p>
              <Link
                to="/menu"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-950 text-white text-sm font-montserrat font-bold rounded-xl hover:bg-gray-950/80 transition-all duration-300"
              >
                Commencer vos achats
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {items.map(({ product, quantity }) => {
                  const key = getCartProductKey(product);
                  const unitPrice = getCartItemUnitPrice(product);
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-xl border border-splash-border bg-white"
                    >
                      <div className="size-16 rounded-lg overflow-hidden border border-splash-border flex-shrink-0">
                        <Img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-montserrat text-sm font-bold text-black truncate">
                          {product.category} {product.name}
                        </p>
                        {product.supplements && product.supplements.length > 0 && (
                          <p className="text-xs text-splash-gray font-inter truncate mt-0.5">
                            + {product.supplements.map((s) => s.name).join(', ')}
                          </p>
                        )}
                        {product.instructions && (
                          <p className="text-xs text-splash-gray/70 font-inter truncate mt-0.5 italic">
                            "{product.instructions}"
                          </p>
                        )}
                        <p className="font-montserrat text-sm font-extrabold text-black mt-0.5">
                          {(unitPrice * quantity).toFixed(3)} DT
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => decrement(key)}
                            className="flex items-center justify-center size-7 rounded-lg border border-splash-border text-black hover:bg-splash-light-gray transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="font-montserrat text-sm font-bold text-black w-6 text-center tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(key)}
                            className="flex items-center justify-center size-7 rounded-lg border border-splash-border text-black hover:bg-splash-light-gray transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(key)}
                        className="p-2 text-splash-gray hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Retirer du panier"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-splash-border px-6 py-5 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-splash-gray">Sous-total</span>
                  <span className="font-montserrat text-sm font-bold text-black">
                    {subtotal.toFixed(3)} DT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-splash-gray">Livraison</span>
                  <span className="font-montserrat text-sm font-bold text-black">
                    {deliveryFee} DT
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-splash-border">
                  <span className="font-montserrat text-base font-extrabold text-black uppercase">
                    Total
                  </span>
                  <span className="font-montserrat text-lg font-extrabold text-black">
                    {total.toFixed(3)} DT
                  </span>
                </div>

                <div className="pt-2 space-y-3">
                  <div>
                    <label htmlFor="cart-address" className="font-montserrat text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                      Adresse de livraison <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="cart-address"
                      value={address}
                      onChange={handleAddressChange}
                      placeholder="Ex: Avenue 14 Janvier, Kalaa Kebira..."
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

                  <Link
                    to="/menu"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-black text-black font-montserrat font-bold text-sm hover:bg-gray-950 hover:text-white transition-all duration-300"
                  >
                    Continuer vos achats
                  </Link>
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-montserrat font-bold text-sm text-white bg-[#25D366] hover:bg-[#1DA851] active:scale-[0.98] transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="size-5 fill-white flex-shrink-0" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Commander via WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
