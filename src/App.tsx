import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';

function AppContent() {
  const [, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header onCartClick={() => setCartOpen(true)} />
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
