import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

export default function FloatingCartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center size-14 bg-gray-950 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label="Ouvrir le panier"
    >
      <FiShoppingCart size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-6 bg-white text-black text-xs font-bold font-montserrat rounded-full border-2 border-black animate-[bounce-in_0.4s_cubic-bezier(0.68,-0.55,0.27,1.55)]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
