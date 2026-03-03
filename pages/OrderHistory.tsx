
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUserId } from '../services/firebaseService';
import { OrderStatus, Order } from '../types';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tracking Modal State
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
        if (user) {
            setLoading(true);
            const myOrders = await getOrdersByUserId(user.id);
            setOrders(myOrders);
            setLoading(false);
        }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = activeStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeStatus);

  const getStatusColor = (status: OrderStatus) => {
      switch(status) {
          case OrderStatus.COMPLETED: return 'bg-green-50 text-green-700 border-green-100';
          case OrderStatus.SHIPPING: return 'bg-blue-50 text-blue-700 border-blue-100';
          case OrderStatus.PENDING: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
          case OrderStatus.CANCELLED: return 'bg-red-50 text-red-700 border-red-100';
          default: return 'bg-gray-50 text-gray-700';
      }
  };

  const getTrackingSteps = (status: OrderStatus) => {
      const steps = [
          { label: 'Đã đặt hàng', icon: 'shopping_cart', completed: true },
          { label: 'Đã xác nhận', icon: 'fact_check', completed: status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED },
          { label: 'Đang giao', icon: 'local_shipping', completed: status === OrderStatus.SHIPPING || status === OrderStatus.COMPLETED },
          { label: 'Thành công', icon: 'verified', completed: status === OrderStatus.COMPLETED }
      ];
      return steps;
  };

  if (!user) return (
      <div className="min-h-screen flex items-center justify-center">
          <Link to="/login" className="text-primary font-bold">Vui lòng đăng nhập</Link>
      </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lịch sử đơn hàng</h1>
            <Link to="/profile" className="text-sm font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px]">person</span> Tài khoản
            </Link>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
            {['All', ...Object.values(OrderStatus)].map((status) => (
                <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all border uppercase tracking-wider ${
                        activeStatus === status 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {status === 'All' ? 'Tất cả' : status}
                </button>
            ))}
        </div>

        {/* Content */}
        {loading ? (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white h-32 rounded-2xl animate-pulse border border-gray-100"></div>
                ))}
            </div>
        ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
                        {/* Status Label */}
                        <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-b border-l ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-[24px]">package_2</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Mã đơn hàng</p>
                                        <p className="font-mono font-bold text-gray-900">#{order.id}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                                    {order.items.map((item, idx) => (
                                        <img key={idx} src={item.image} className="h-12 w-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" alt="" />
                                    ))}
                                    {order.itemsCount > 4 && (
                                        <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                            +{order.itemsCount - 4}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:text-right flex flex-col justify-between items-end gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{order.totalAmount.toLocaleString()} <span className="text-xs font-medium">đ</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSelectedTrackingOrder(order)}
                                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        Theo dõi
                                    </button>
                                    <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-inner">
                <span className="material-symbols-outlined text-gray-200 text-8xl mb-4">shopping_bag</span>
                <h3 className="text-xl font-black text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-400 mb-8 max-w-xs mx-auto">Bạn chưa có đơn hàng nào trong trạng thái này. Hãy bắt đầu mua sắm ngay!</p>
                <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all">
                    Đến cửa hàng <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </div>
        )}

        {/* Tracking Modal */}
        {selectedTrackingOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedTrackingOrder(null)}></div>
                <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Theo dõi hành trình</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase mt-1">Mã vận đơn: {selectedTrackingOrder.trackingNumber}</p>
                            </div>
                            <button onClick={() => setSelectedTrackingOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-3xl mb-10 border border-blue-100/50">
                            <div className="flex flex-col gap-8 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                                
                                {getTrackingSteps(selectedTrackingOrder.status).map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-6 relative z-10">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all ${step.completed ? 'bg-primary text-white scale-110' : 'bg-white text-gray-300 border border-gray-100'}`}>
                                            <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                            {step.completed && (
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">Cập nhật lúc 08:30</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="material-symbols-outlined text-gray-400">location_on</span>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Địa chỉ nhận hàng</p>
                                    <p className="text-xs font-bold text-gray-700 mt-0.5">{selectedTrackingOrder.shippingAddress}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTrackingOrder(null)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Đã hiểu</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
