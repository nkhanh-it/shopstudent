import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const state = location.state as { orderId: string, amount: number, method: string } | null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
       <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-500 mb-8">Cảm ơn bạn đã mua sắm tại ShopStudent.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-bold text-gray-900">{state?.orderId || 'ORD-UNKNOWN'}</span>
              </div>
              <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tổng tiền:</span>
                  <span className="font-bold text-primary">{(state?.amount || 0).toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phương thức:</span>
                  <span className="font-medium text-gray-900">{state?.method || 'VNPAY'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                  <span className="text-gray-500">Thời gian:</span>
                  <span className="text-gray-900">{new Date().toLocaleString('vi-VN')}</span>
              </div>
          </div>
          
          <div className="space-y-3">
              <Link to="/products" className="block w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                  Tiếp tục mua sắm
              </Link>
              <Link to="/" className="block w-full text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100 transition">
                  Về trang chủ
              </Link>
          </div>
       </div>
    </div>
  );
};

export default PaymentSuccess;
