
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import ProductList from './pages/ProductList.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Checkout from './pages/Checkout.tsx';
import PaymentSuccess from './pages/PaymentSuccess.tsx';
import OrderHistory from './pages/OrderHistory.tsx';
import UserProfile from './pages/UserProfile.tsx';
import AIChatbot from './components/AIChatbot.tsx';
import { UserRole } from './types.ts';

// Protected Route for Admin - Fix: Make children optional to avoid missing prop error in some TS environments
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Protected Route for Users - Fix: Make children optional to avoid missing prop error in some TS environments
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                
                {/* Private Routes */}
                <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                <Route path="payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
                <Route path="history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
            <AIChatbot />
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;