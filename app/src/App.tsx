import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
import SmoothScroll from '@/components/SmoothScroll';
import FloatingCartButton from '@/components/FloatingCartButton';
import CartSidebar from '@/components/CartSidebar';
import { CartProvider } from '@/context/CartContext';

const Home = lazy(() => import('@/pages/Home'));
const Menu = lazy(() => import('@/pages/Menu'));
const About = lazy(() => import('@/pages/About'));
const Delivery = lazy(() => import('@/pages/Delivery'));
const Contact = lazy(() => import('@/pages/Contact'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <SmoothScroll>
        <PageLoader />
        <ScrollToTop />
        <Navbar />
        <Suspense
          fallback={
            <div className="min-h-screen bg-surface flex items-center justify-center">
              <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/livraison" element={<Delivery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
          </Routes>
        </Suspense>
        <Footer />
        <FloatingCartButton />
        <CartSidebar />
      </SmoothScroll>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
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
        }}
      />
    </CartProvider>
  );
}
