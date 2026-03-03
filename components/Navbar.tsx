
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { UserRole } from '../types.ts';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('info', 'Đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống.');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">shopping_bag</span>
              <span className="font-bold text-xl text-gray-900 tracking-tight">ShopStudent</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Trang chủ
              </Link>
              <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Sản phẩm
              </Link>
              {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="border-transparent text-primary hover:text-blue-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex relative mx-4">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
               </span>
               <input 
                  type="text" 
                  className="bg-gray-100 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all w-64"
                  placeholder="Tìm kiếm sản phẩm..."
               />
            </div>

            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative group h-full flex items-center">
                {/* 
                  SỬA LỖI: Thêm vùng đệm (padding) thay vì mt-2 để chuột không rời khỏi vùng hover của group.
                  Đồng thời dùng invisible/visible + opacity thay cho hidden để mượt hơn.
                */}
                <button className="flex items-center gap-2 focus:outline-none py-2 px-1">
                  <img className="h-8 w-8 rounded-full object-cover border border-gray-200" src={user.avatar} alt={user.name} />
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:rotate-180 transition-transform">expand_more</span>
                </button>
                
                <div className="absolute right-0 top-full w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 origin-top-right z-[100]">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tài khoản</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span> Hồ sơ
                    </Link>
                    <Link to="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span> Đơn mua
                    </Link>
                    <div className="h-px bg-gray-50 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95">Đăng nhập</Link>
              </div>
            )}
            
            <div className="flex items-center sm:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
