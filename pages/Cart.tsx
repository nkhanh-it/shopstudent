
import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
/* Import Link from react-router-dom and useNavigate from react-router to fix missing exported member errors */
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
      navigate('/checkout');
  };

  const handleRemove = (id: number, name: string) => {
      removeFromCart(id);
      showToast('warning', 'Giỏ hàng', `Đã xóa ${name} khỏi giỏ hàng.`);
  };

  const handleClear = () => {
      if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
          clearCart();
          showToast('info', 'Giỏ hàng', 'Giỏ hàng đã được làm trống.');
      }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse ring-4 ring-gray-100">
            <span className="material-symbols-outlined text-gray-300 text-8xl">shopping_cart</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
          Có vẻ như bạn chưa thêm sản phẩm nào. Hãy dạo một vòng cửa hàng để tìm những món đồ ưng ý nhé!
        </p>
        <Link to="/products" className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full shadow-xl text-white bg-gradient-to-r from-primary to-secondary hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1">
          <span className="material-symbols-outlined mr-2">storefront</span>
          Khám phá cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
             <Link to="/products" className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors shadow-sm">
                <span className="material-symbols-outlined block">arrow_back</span>
             </Link>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">Giỏ hàng <span className="text-lg font-medium text-gray-500 font-normal">({cartItems.length} sản phẩm)</span></h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12 lg:items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Chi tiết sản phẩm</span>
                <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">delete_sweep</span> Xóa tất cả
                </button>
             </div>
             <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 relative">
                    <Link to={`/product/${item.id}`}>
                        <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow cursor-pointer"
                        />
                    </Link>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                     <div className="flex-1">
                        <div className="flex justify-between sm:block">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md mb-2">{item.category}</span>
                            <h3 className="text-lg font-bold text-gray-900">
                                <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors line-clamp-1">
                                    {item.name}
                                </Link>
                            </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 pr-4">{item.description}</p>
                        <p className="mt-2 text-lg font-bold text-primary">{item.price.toLocaleString('vi-VN')} đ</p>
                     </div>

                     <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Quantity UI */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm h-10 overflow-hidden">
                           <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors border-r border-gray-100">
                                <span className="material-symbols-outlined text-sm">remove</span>
                           </button>
                           <input 
                                type="text" 
                                value={item.quantity} 
                                readOnly 
                                className="w-12 text-center text-sm font-bold text-gray-900 focus:outline-none bg-transparent"
                           />
                           <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors border-l border-gray-100">
                                <span className="material-symbols-outlined text-sm">add</span>
                           </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Xóa sản phẩm"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                     </div>
                  </div>
                </li>
              ))}
             </ul>
             
             <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <Link to="/products" className="inline-flex items-center font-semibold text-primary hover:text-blue-700 hover:underline">
                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                    Tiếp tục mua sắm
                </Link>
             </div>
          </section>

          {/* Order Summary */}
          <section className="mt-8 lg:mt-0 lg:col-span-4 flex flex-col gap-6 sticky top-24">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl">receipt_long</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Tổng đơn hàng</h2>

              <dl className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Tạm tính</dt>
                  <dd className="font-medium text-gray-900">{cartTotal.toLocaleString('vi-VN')} đ</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Phí vận chuyển</dt>
                  <dd className="font-medium text-green-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">local_shipping</span> Miễn phí
                  </dd>
                </div>
                 {/* Coupon Input Placeholder */}
                 <div className="pt-4 pb-2">
                    <div className="flex gap-2">
                        <input type="text" placeholder="Mã giảm giá" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                        <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Áp dụng</button>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <dt className="text-lg font-bold text-gray-900">Tổng cộng</dt>
                  <dd className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                    {cartTotal.toLocaleString('vi-VN')} đ
                  </dd>
                </div>
              </dl>

              <div className="mt-8 relative z-10">
                <button
                  onClick={handleCheckout}
                  className="w-full group relative flex justify-center items-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 skew-x-12 -translate-x-full"></div>
                  Thanh toán ngay
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="visa"/>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain" alt="mastercard"/>
                     <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" className="h-5 object-contain" alt="vnpay"/>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cart;
