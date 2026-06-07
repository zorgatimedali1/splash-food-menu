import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import Img from '@/components/Img';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCategories, useProducts, getProductSlug } from '@/hooks/useMenuApi';
import { useCart } from '@/context/CartContext';
import type { ProductDTO, CategoryDTO } from '@/lib/api';

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

function ProductCard({ product }: { product: ProductDTO }) {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAdd = useCallback(() => {
    addToCart({
      category: product.category_name,
      name: product.name,
      price: product.price,
      image: product.image_url || '/images/placeholder.jpg',
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
          src={product.image_url || '/images/placeholder.jpg'}
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
            to={`/product/${getProductSlug(product.category_name, product.name)}`}
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

function CategorySection({ category, products, imageUrl }: { category: string; products: ProductDTO[]; imageUrl?: string }) {
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
            <Img src={imageUrl || ''} alt={category} className="w-full h-full object-cover" />
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
            <div key={`p-${product.id}`} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-splash-border rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-splash-light-gray" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-splash-light-gray rounded w-3/4" />
            <div className="h-3 bg-splash-light-gray rounded w-full" />
            <div className="h-3 bg-splash-light-gray rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('TOUT');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: prodLoading } = useProducts();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      const found = categories.find((c: CategoryDTO) => c.name === category.toUpperCase());
      if (found) setActiveCategory(found.name);
    }
  }, [searchParams, categories]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'TOUT') return products;
    return products.filter((p) => p.category_name === activeCategory);
  }, [activeCategory, products]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'TOUT') return null;
    const groups: Record<string, ProductDTO[]> = {};
    products.forEach((p) => {
      if (!groups[p.category_name]) groups[p.category_name] = [];
      groups[p.category_name].push(p);
    });
    return groups;
  }, [activeCategory, products]);

  const displayCategories = useMemo(() => {
    if (!groupedByCategory) return [];
    return Object.keys(groupedByCategory);
  }, [groupedByCategory]);

  const catImageMap = useMemo(() => {
    const m: Record<string, string> = {};
    categories.forEach((c) => { if (c.image_url) m[c.name] = c.image_url; });
    return m;
  }, [categories]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <main className="min-h-screen bg-white">
      <PageHeader title="NOTRE MENU" breadcrumb="Menu" />

      <section className="py-6 md:py-8 border-b border-splash-border sticky top-20 z-40 bg-white shadow-sm">
        <div className="section-container">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          >
            {catLoading ? (
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 bg-splash-light-gray rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              categories.map((cat: CategoryDTO) => (
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
              ))
            )}
            <button
              type="button"
              onClick={() => setActiveCategory('TOUT')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-inter transition-all duration-300 whitespace-nowrap ${
                activeCategory === 'TOUT'
                  ? 'bg-gray-950 text-white'
                  : 'bg-splash-light-gray text-splash-gray border border-splash-border hover:bg-gray-950 hover:text-white'
              }`}
            >
              TOUT
            </button>
          </div>
        </div>
      </section>

      {prodLoading ? (
        <section className="py-12 md:py-16">
          <div className="section-container">
            <SkeletonGrid />
          </div>
        </section>
      ) : activeCategory === 'TOUT' ? (
        <div>
          {displayCategories.map((cat) => (
            <CategorySection key={cat} category={cat} products={groupedByCategory![cat]} imageUrl={catImageMap[cat]} />
          ))}
        </div>
      ) : (
        <section className="py-12 md:py-16">
          <div className="section-container">
            <div className="flex items-center gap-6 mb-10">
              <div className="size-20 rounded-2xl overflow-hidden border border-splash-border flex-shrink-0 shadow-sm">
                <Img src={catImageMap[activeCategory] || ''} alt={activeCategory} className="w-full h-full object-cover" />
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
                <ProductCard key={`p-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

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
