import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { useCartStore } from './hooks/useCart';

function AppContent() {
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header onCartClick={toggleCart} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </main>
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
