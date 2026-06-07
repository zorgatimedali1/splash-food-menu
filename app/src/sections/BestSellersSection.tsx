import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'sonner';
import SectionTitle from '@/components/SectionTitle';
import Img from '@/components/Img';
import { useBestSellers, getProductSlug } from '@/hooks/useMenuApi';
import { useCart } from '@/context/CartContext';
import 'swiper/css';
import 'swiper/css/navigation';

export default function BestSellersSection() {
  const { bestSellers, loading } = useBestSellers();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  if (loading || bestSellers.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-padding bg-splash-light-gray">
      <div className="section-container">
        <div className="flex items-end justify-between mb-14">
          <SectionTitle title="NOS MEILLEURES VENTES" centered={false} className="mb-0" />
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className="size-11 rounded-xl border border-splash-border bg-white flex items-center justify-center text-black hover:border-black hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Précédent"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className="size-11 rounded-xl border border-splash-border bg-white flex items-center justify-center text-black hover:border-black hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Suivant"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {bestSellers.map((item) => (
            <SwiperSlide key={item.id}>
              <BestSellerCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function BestSellerCard({ item }: { item: { id: number; name: string; description: string | null; price: number; image_url: string | null; category_name: string } }) {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const slug = getProductSlug(item.category_name, item.name);

  const handleAdd = useCallback(() => {
    addToCart({
      category: item.category_name,
      name: item.name,
      price: item.price,
      image: item.image_url || '',
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
    if (cardRef.current) {
      cardRef.current.style.transform = 'scale(0.97)';
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.transform = '';
      }, 200);
    }
  }, [addToCart, item]);

  return (
    <div
      ref={cardRef}
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ border: '2px solid #c8a94e' }}
    >
      <Link to={`/product/${slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Img
          src={item.image_url || ''}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-montserrat font-bold text-white"
          style={{ backgroundColor: '#c8a94e' }}
        >
          LE PLUS DEMANDÉ 🔥
        </span>
        <span
          className="absolute bottom-3 left-3 px-3 py-1 rounded-md text-xs font-montserrat font-bold text-white"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          PREMIUM
        </span>
      </Link>
      <div className="p-5">
        <Link to={`/product/${slug}`}>
          <h3 className="font-montserrat text-lg font-bold text-black group-hover:text-black/60 transition-colors duration-300">
            {item.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-splash-gray leading-relaxed">
          {item.description}
        </p>
        <p className="mt-3 font-montserrat text-lg font-extrabold" style={{ color: '#c8a94e' }}>
          ⭐ {item.price.toLocaleString('fr-FR')} DT
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/product/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-xs font-montserrat font-bold transition-all duration-300"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Commander
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-xs font-montserrat font-bold transition-all duration-300"
            style={{ backgroundColor: '#c8a94e' }}
          >
            <FiShoppingCart size={14} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
