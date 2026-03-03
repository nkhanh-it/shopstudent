
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getOrdersByUserId } from '../services/firebaseService';
import { Order } from '../types';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
        if (user) {
            const data = await getOrdersByUserId(user.id);
            setOrders(data);
            setLoading(false);
        }
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  const totalSpent = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Header Cover */}
           <div className="relative h-48 rounded-t-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-primary overflow-hidden shadow-xl">
               <div className="absolute inset-0 opacity-20">
                   <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                   <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
               </div>
           </div>

           {/* Profile Card */}
           <div className="relative -mt-20 bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 sm:p-10 backdrop-blur-xl">
               <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 mb-12">
                   <div className="relative">
                       <img 
                            src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                            alt={user.name} 
                            className="w-40 h-40 rounded-[2rem] border-8 border-white shadow-2xl bg-white object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                       />
                       <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center">
                           <span className="material-symbols-outlined text-white text-[18px]">verified</span>
                       </div>
                   </div>
                   <div className="flex-1 text-center sm:text-left">
                       <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">{user.email}</p>
                       <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                           <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                               {user.role} Member
                           </span>
                           <span className="px-4 py-1.5 bg-yellow-50 text-yellow-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-yellow-100">
                               Gold Partner
                           </span>
                       </div>
                   </div>
                   <button className="px-8 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all active:scale-95">
                       Chỉnh sửa hồ sơ
                   </button>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                   {[
                       { label: 'Đơn mua', value: orders.length, icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-50' },
                       { label: 'Chi tiêu', value: `${totalSpent.toLocaleString()} đ`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
                       { label: 'Tích lũy', value: Math.floor(totalSpent / 10000).toLocaleString(), icon: 'stars', color: 'text-purple-600', bg: 'bg-purple-50' }
                   ].map((stat, i) => (
                       <div key={i} className={`${stat.bg} p-8 rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all group overflow-hidden relative`}>
                           <div className="relative z-10">
                               <span className={`material-symbols-outlined text-3xl ${stat.color} mb-3 block`}>{stat.icon}</span>
                               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                               <p className="text-2xl font-black text-gray-900">{loading ? '...' : stat.value}</p>
                           </div>
                           <span className={`material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-5 transform group-hover:scale-125 transition-transform ${stat.color}`}>{stat.icon}</span>
                       </div>
                   ))}
               </div>

               {/* Menu Options */}
               <div className="space-y-3">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Cài đặt hệ thống</h3>
                   
                   <Link to="/history" className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 group transition-all border border-transparent hover:border-gray-100">
                       <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-200 transition-all">
                               <span className="material-symbols-outlined">receipt_long</span>
                           </div>
                           <div>
                               <span className="font-black text-gray-900 block">Lịch sử đơn hàng</span>
                               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Xem & theo dõi vận đơn</span>
                           </div>
                       </div>
                       <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-2 transition-transform">arrow_forward</span>
                   </Link>

                   <Link to="/cart" className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 group transition-all border border-transparent hover:border-gray-100">
                       <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <span className="material-symbols-outlined">shopping_cart</span>
                           </div>
                           <div>
                               <span className="font-black text-gray-900 block">Giỏ hàng của tôi</span>
                               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kiểm tra các món đồ đã chọn</span>
                           </div>
                       </div>
                       <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-2 transition-transform">arrow_forward</span>
                   </Link>

                   <div className="h-px bg-gray-100 my-8 mx-6"></div>

                   <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-red-50 group transition-all border border-transparent hover:border-red-100">
                       <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                               <span className="material-symbols-outlined">logout</span>
                           </div>
                           <div>
                               <span className="font-black text-red-600 block">Đăng xuất</span>
                               <span className="text-[10px] text-red-300 font-bold uppercase tracking-widest">Kết thúc phiên làm việc</span>
                           </div>
                       </div>
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};

export default UserProfile;
