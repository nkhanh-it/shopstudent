
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Address, Order, OrderStatus } from '../types';
import { createOrder } from '../services/firebaseService';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, saveAddress } = useAuth();
  const navigate = useNavigate();

  const [paymentStep, setPaymentStep] = useState<'info' | 'processing_vnpay'>('info');
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'vnpay' 
  });

  useEffect(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
        setUseSavedAddress(true);
        const defaultAddr = user.savedAddresses.find(a => a.isDefault) || user.savedAddresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData(prev => ({
            ...prev,
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            address: defaultAddr.address,
            city: defaultAddr.city
        }));
    } else if (user) {
        setFormData(prev => ({ ...prev, fullName: user.name }));
    }
  }, [user]);

  if (cartItems.length === 0) {
      return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr: Address) => {
      setSelectedAddressId(addr.id);
      setFormData(prev => ({
          ...prev,
          fullName: addr.fullName,
          phone: addr.phone,
          address: addr.address,
          city: addr.city
      }));
  };

  const processOrder = async (methodName: string, orderPrefix: string) => {
    if (!user) {
        showToast('error', 'Lỗi', 'Vui lòng đăng nhập để thanh toán.');
        return;
    }

    try {
        const orderId = `${orderPrefix}-${Date.now().toString().slice(-6)}`;
        const newOrder: Order = {
            id: orderId,
            userId: user.id,
            customerName: formData.fullName,
            totalAmount: cartTotal,
            status: OrderStatus.PENDING,
            date: new Date().toISOString(),
            itemsCount: cartItems.length,
            items: [...cartItems],
            paymentMethod: methodName,
            trackingNumber: `TRK${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
            shippingAddress: `${formData.address}, ${formData.city}`
        };

        // SAVE TO DATABASE
        await createOrder(newOrder);

        // Clear cart and redirect
        clearCart();
        showToast('success', 'Thành công', 'Đơn hàng của bạn đã được hệ thống ghi nhận.');
        navigate('/payment-success', { 
            state: { 
                orderId: orderId, 
                amount: cartTotal,
                method: methodName 
            } 
        });
    } catch (error) {
        showToast('error', 'Lỗi hệ thống', 'Không thể lưu đơn hàng. Vui lòng thử lại.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
        showToast('error', 'Lỗi thông tin', 'Vui lòng điền đầy đủ các thông tin giao hàng.');
        return;
    }

    if (!useSavedAddress && saveThisAddress && user) {
        const newAddr: Address = {
            id: `ADDR-${Date.now()}`,
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
        };
        await saveAddress(newAddr);
    }

    if (formData.paymentMethod === 'vnpay') {
        setPaymentStep('processing_vnpay');
        setTimeout(() => {
            processOrder('VNPAY (Thẻ ATM/QR-Code)', 'VNP');
        }, 3000);
    } else {
        processOrder('Thanh toán khi nhận hàng (COD)', 'COD');
    }
  };

  if (paymentStep === 'processing_vnpay') {
      return (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                  <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" alt="VNPAY" className="h-12 mx-auto" />
                  <div className="relative">
                      <div className="w-24 h-24 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <h2 className="text-xl font-black text-gray-900">Đang xử lý thanh toán</h2>
                      <p className="text-gray-500 text-sm">Hệ thống đang kết nối an toàn với ngân hàng của bạn...</p>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm">
             <button className="cursor-pointer hover:text-primary" onClick={() => navigate('/cart')}>Giỏ hàng</button>
             <span>/</span>
             <span className="text-gray-900 font-semibold">Thanh toán</span>
         </div>

         <form onSubmit={handlePayment} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            Địa chỉ giao hàng
                        </h2>
                        {user?.savedAddresses && user.savedAddresses.length > 0 && (
                            <button 
                                type="button"
                                onClick={() => setUseSavedAddress(!useSavedAddress)}
                                className="text-sm font-bold text-primary hover:text-blue-700 underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {useSavedAddress ? 'edit_note' : 'list_alt'}
                                </span>
                                {useSavedAddress ? 'Nhập địa chỉ mới' : 'Chọn từ địa chỉ đã lưu'}
                            </button>
                        )}
                    </div>
                    
                    {useSavedAddress && user?.savedAddresses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {user.savedAddresses.map((addr) => (
                                <div 
                                    key={addr.id}
                                    onClick={() => handleSelectSavedAddress(addr)}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        selectedAddressId === addr.id 
                                        ? 'border-primary bg-blue-50 ring-1 ring-primary' 
                                        : 'border-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                                        {selectedAddressId === addr.id && <span className="material-symbols-outlined text-primary text-[20px] fill-current">check_circle</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{addr.phone}</p>
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">{addr.address}, {addr.city}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Họ và tên</label>
                                <input type="text" name="fullName" required value={formData.fullName} className="mt-1 block w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50/50" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Số điện thoại</label>
                                <input type="tel" name="phone" required value={formData.phone} className="mt-1 block w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50/50" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tỉnh / Thành phố</label>
                                <input type="text" name="city" required value={formData.city} className="mt-1 block w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50/50" onChange={handleInputChange} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Địa chỉ chi tiết</label>
                                <input type="text" name="address" required value={formData.address} className="mt-1 block w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50/50" onChange={handleInputChange} />
                            </div>
                            {user && (
                                <div className="sm:col-span-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={saveThisAddress} onChange={(e) => setSaveThisAddress(e.target.checked)} className="w-4 h-4 text-primary rounded border-gray-300" />
                                        <span className="text-sm font-medium text-gray-600">Lưu địa chỉ này cho lần sau</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <span className="bg-blue-100 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Thanh toán
                    </h2>
                    <div className="space-y-4">
                        <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'vnpay' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-100'}`}>
                            <input type="radio" name="paymentMethod" value="vnpay" checked={formData.paymentMethod === 'vnpay'} onChange={handleInputChange} className="h-5 w-5 text-primary" />
                            <div className="ml-4 flex flex-1 items-center justify-between">
                                <div>
                                    <span className="block text-sm font-black text-gray-900">VNPAY (QR-Code / Thẻ)</span>
                                    <span className="block text-xs text-gray-500">Giảm thêm 5k khi thanh toán QR</span>
                                </div>
                                <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.png" alt="VNPAY" className="h-8" />
                            </div>
                        </label>
                        <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-100'}`}>
                            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="h-5 w-5 text-primary" />
                            <div className="ml-4">
                                <span className="block text-sm font-black text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-5">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 font-black uppercase text-sm tracking-tight text-gray-900">Tóm tắt đơn hàng</div>
                    <div className="px-6 py-6 max-h-96 overflow-y-auto no-scrollbar">
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex gap-4 items-center">
                                    <img src={item.image} className="h-14 w-14 rounded-xl object-cover border border-gray-100" />
                                    <div className="flex-1">
                                        <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-[10px] text-gray-400">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}đ</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng tiền</p>
                            <p className="text-3xl font-black text-primary">{cartTotal.toLocaleString()} <span className="text-sm">đ</span></p>
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all">
                            Xác nhận thanh toán
                        </button>
                    </div>
                </div>
            </div>
         </form>
      </div>
    </div>
  );
};

export default Checkout;
