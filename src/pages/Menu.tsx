import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import Img from '@/components/Img';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CATEGORIES, MENU_PRODUCTS, getProductSlug } from '@/data';
import { useCart } from '@/context/CartContext';

const CATEGORY_IMAGES: Record<string, string> = {
  TABOUNA: '/images/tabouna photo.jpg',
  CORNET: '/images/cornet photo.jpeg',
  CALZONE: '/images/pizza-calzone.jpg',
  LIBANAIS: '/images/splash_sandwich.jpg',
  CIABATTA: '/images/cibatta photo.jpg',
  MAKLOUB: '/images/makloub photo.jpg',
  PIZZA: '/images/splash_pizza.jpg',
  TRIANGLE: '/images/triangle photo.png',
  'BAGUETTE FARCIE': '/images/baguette farce.jpg',
  TACOS: '/images/tacos phoyo.jpg',
  PÂTES: '/images/pate.png',
  SALADES: '/images/splash_salade.jpg',
  'LES PLATS': '/images/poulet_croustillant.jpg',
  OMELETTE: '/images/splash_omelette.jpg',
  BOISSONS: '/images/splash_boissons.jpg',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  TABOUNA: 'Tabounas farcies, pains traditionnels tunisiens garnis',
  CORNET: 'Cornets croustillants généreusement garnis',
  CALZONE: 'Calzone farcis au fromage fondant',
  LIBANAIS: 'Sandwichs libanais aux saveurs orientales',
  CIABATTA: 'Ciabattas grillées à l\'italienne',
  MAKLOUB: 'Makloubs retournés, croustillants et savoureux',
  PIZZA: 'Pizzas artisanales cuites au four traditionnel',
  TRIANGLE: 'Triangles dorés et croustillants',
  'BAGUETTE FARCIE': 'Baguettes farcies généreusement garnies',
  TACOS: 'Tacos garnis de viandes et fromage fondant',
  PÂTES: 'Pâtes italiennes préparées maison',
  SALADES: 'Salades fraîches et croquantes',
  'LES PLATS': 'Plats principaux et grillades maison',
  OMELETTE: 'Omelettes aux œufs frais',
  BOISSONS: 'Boissons fraîches et rafraîchissements',
};

function ProductCard({ product }: { product: typeof MENU_PRODUCTS[0] }) {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAdd = useCallback(() => {
    addToCart({
      category: product.category,
      name: product.name,
      price: product.price,
      image: product.image,
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
  }, [addToCart, product]);

  return (
    <div
      ref={cardRef}
      className="menu-card group bg-white border border-splash-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-montserrat text-sm font-bold text-black group-hover:text-black/60 transition-colors duration-300">
            {product.name}
          </h3>
          <span className="font-montserrat text-sm font-extrabold text-black whitespace-nowrap">
            {product.price} DT
          </span>
        </div>
        <p className="mt-1.5 text-xs text-splash-gray leading-relaxed">
          {product.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/product/${getProductSlug(product)}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg border border-splash-border text-black text-xs font-montserrat font-bold hover:bg-splash-light-gray transition-all duration-300"
          >
            Détails
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-950 text-white text-xs font-montserrat font-bold hover:bg-gray-950/80 active:scale-95 transition-all duration-300"
          >
            <FiShoppingCart size={14} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, products }: { category: string; products: typeof MENU_PRODUCTS }) {
  const gridRef = useScrollAnimation<HTMLDivElement>({
    type: 'staggerCards',
    childSelector: '.product-card',
    stagger: 0.04,
  });

  return (
    <section className="py-12 md:py-16 border-b border-splash-border last:border-b-0">
      <div className="section-container">
        <div className="flex items-center gap-6 mb-10">
          <div className="size-20 rounded-2xl overflow-hidden border border-splash-border flex-shrink-0 shadow-sm">
            <Img src={CATEGORY_IMAGES[category]} alt={category} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold text-black tracking-tight uppercase">
              {category}
            </h2>
            <p className="text-sm text-splash-gray font-inter mt-1">
              {CATEGORY_DESCRIPTIONS[category]} - {products.length} {products.length > 1 ? 'plats' : 'plat'}
            </p>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div key={`${product.category}-${product.name}`} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Menu() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('TOUT');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      const found = CATEGORIES.find((c) => c.name === category.toUpperCase());
      if (found) setActiveCategory(found.name);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'TOUT') return MENU_PRODUCTS;
    return MENU_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'TOUT') return null;
    const groups: Record<string, typeof MENU_PRODUCTS> = {};
    MENU_PRODUCTS.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [activeCategory]);

  const displayCategories = useMemo(() => {
    if (!groupedByCategory) return [];
    return Object.keys(groupedByCategory);
  }, [groupedByCategory]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="NOTRE MENU" breadcrumb="Menu" />

      {/* Category Navigation */}
      <section className="py-6 md:py-8 border-b border-splash-border sticky top-20 z-40 bg-white shadow-sm">
        <div className="section-container">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-inter transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.name
                    ? 'bg-gray-950 text-white'
                    : 'bg-splash-light-gray text-splash-gray border border-splash-border hover:bg-gray-950 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Content */}
      {activeCategory === 'TOUT' ? (
        <div>
          {displayCategories.map((cat) => (
            <CategorySection key={cat} category={cat} products={groupedByCategory![cat]} />
          ))}
        </div>
      ) : (
        <section className="py-12 md:py-16">
          <div className="section-container">
            <div className="flex items-center gap-6 mb-10">
              <div className="size-20 rounded-2xl overflow-hidden border border-splash-border flex-shrink-0 shadow-sm">
                <Img src={CATEGORY_IMAGES[activeCategory]} alt={activeCategory} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold text-black tracking-tight uppercase">
                  {activeCategory}
                </h2>
                <p className="text-sm text-splash-gray font-inter mt-1">
                  {CATEGORY_DESCRIPTIONS[activeCategory]} - {filteredProducts.length} {filteredProducts.length > 1 ? 'plats' : 'plat'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={`${product.category}-${product.name}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-10 bg-gray-950">
        <div className="section-container text-center">
          <p className="font-montserrat text-lg md:text-xl font-bold text-white tracking-tight">
            LIVRAISON À DOMICILE - 2 DT
          </p>
          <p className="mt-2 text-sm text-white/60 font-inter">
            Commandez par téléphone ou via nos partenaires de livraison
          </p>
        </div>
      </section>
    </main>
  );
}
