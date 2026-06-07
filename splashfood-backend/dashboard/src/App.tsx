import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { isAuthenticated } from './lib/auth';

// Lazy-load all pages
const Login     = lazy(() => import('./pages/Login'));
const Overview  = lazy(() => import('./pages/Overview'));
const Products  = lazy(() => import('./pages/Products'));
const Categories = lazy(() => import('./pages/Categories'));
const Supplements = lazy(() => import('./pages/Supplements'));
const Orders    = lazy(() => import('./pages/Orders'));
const Messages  = lazy(() => import('./pages/Messages'));
const Settings  = lazy(() => import('./pages/Settings'));

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Aperçu',
  '/admin/products': 'Produits',
  '/admin/categories': 'Catégories',
  '/admin/supplements': 'Suppléments',
  '/admin/orders': 'Commandes',
  '/admin/messages': 'Messages',
  '/admin/settings': 'Paramètres',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: true },
  },
});

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RequireAuth() {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

function DashboardLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen bg-splash-light-gray overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-64 transition-all duration-200" id="main-content">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<Overview />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/supplements" element={<Supplements />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/messages" element={<Messages />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
