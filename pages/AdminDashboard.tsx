
import React, { useState, useEffect } from 'react';
import { 
    getProducts, updateProduct, deleteProduct, 
    getAllOrders, updateOrderStatus, deleteOrder,
    getAllUsers, deleteUser 
} from '../services/firebaseService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderStatus, Product, User, UserRole, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const { logout, user: currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
      name: '', category: '', price: 0, stock: 0, image: '', description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [pData, oData, uData] = await Promise.all([
        getProducts(),
        getAllOrders(),
        getAllUsers()
    ]);
    setProducts(pData);
    setOrders(oData);
    setUsers(uData);
    setLoading(false);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  // Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      const p: Product = {
          id: editingProduct ? editingProduct.id : Date.now(),
          ...prodForm,
          rating: editingProduct ? editingProduct.rating : 5.0
      };
      await updateProduct(p);
      showToast('success', 'Thành công', 'Đã lưu thông tin sản phẩm.');
      setIsProductModalOpen(false);
      fetchData();
  };

  const handleDeleteProduct = async (id: number) => {
      if (window.confirm('Xóa sản phẩm này?')) {
          await deleteProduct(id);
          showToast('warning', 'Kho hàng', 'Đã xóa sản phẩm.');
          fetchData();
      }
  };

  const handleUpdateOrder = async (orderId: string, status: OrderStatus) => {
      await updateOrderStatus(orderId, status);
      showToast('info', 'Đơn hàng', 'Đã cập nhật trạng thái.');
      fetchData();
  };

  const handleDeleteUser = async (uid: string) => {
      if (uid === currentUser?.id) return;
      if (window.confirm('Xóa người dùng này?')) {
          await deleteUser(uid);
          showToast('warning', 'Người dùng', 'Đã xóa tài khoản.');
          fetchData();
      }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== OrderStatus.CANCELLED ? o.totalAmount : 0), 0);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-primary animate-pulse">ĐANG TẢI DỮ LIỆU...</div>;

  const SidebarItem = ({ id, icon, label }: { id: typeof activeTab, icon: string, label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-72 bg-white border-r flex flex-col p-6 space-y-8">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2"><span className="material-symbols-outlined">rocket_launch</span> SHOP ADMIN</h2>
        <div className="space-y-2 flex-1">
            <SidebarItem id="overview" icon="dashboard" label="Tổng quan" />
            <SidebarItem id="products" icon="inventory" label="Sản phẩm" />
            <SidebarItem id="orders" icon="shopping_cart" label="Đơn hàng" />
            <SidebarItem id="users" icon="person" label="Người dùng" />
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-all">
            <span className="material-symbols-outlined">logout</span> Thoát
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-10">
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{activeTab}</h1>
                  {activeTab === 'products' && (
                      <button onClick={() => { setEditingProduct(null); setProdForm({ name: '', category: '', price: 0, stock: 0, image: 'https://picsum.photos/600', description: '' }); setIsProductModalOpen(true); }} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">Thêm sản phẩm</button>
                  )}
              </div>

              {activeTab === 'overview' && (
                  <div className="grid grid-cols-4 gap-6">
                      {[
                          { label: 'Doanh thu', value: `${totalRevenue.toLocaleString()} đ`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
                          { label: 'Đơn hàng', value: orders.length, icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-50' },
                          { label: 'Sản phẩm', value: products.length, icon: 'inventory', color: 'text-purple-600', bg: 'bg-purple-50' },
                          { label: 'User', value: users.length, icon: 'group', color: 'text-orange-600', bg: 'bg-orange-50' }
                      ].map((stat, i) => (
                          <div key={i} className={`p-6 rounded-3xl bg-white border border-gray-100 shadow-sm`}>
                              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                  <span className="material-symbols-outlined">{stat.icon}</span>
                              </div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                              <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'products' && (
                  <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b">
                              <tr>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Sản phẩm</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Giá</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Kho</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Tác vụ</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y">
                              {products.map(p => (
                                  <tr key={p.id} className="hover:bg-gray-50">
                                      <td className="p-4 flex items-center gap-3">
                                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                          <span className="font-bold text-sm text-gray-900">{p.name}</span>
                                      </td>
                                      <td className="p-4 text-sm font-black text-primary">{p.price.toLocaleString()}đ</td>
                                      <td className="p-4 text-sm font-bold text-gray-500">{p.stock} pcs</td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => { setEditingProduct(p); setProdForm({...p}); setIsProductModalOpen(true); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><span className="material-symbols-outlined">edit</span></button>
                                          <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">delete</span></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {activeTab === 'orders' && (
                   <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b">
                              <tr>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Đơn hàng</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Khách hàng</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Tổng tiền</th>
                                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Trạng thái</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y">
                              {orders.map(o => (
                                  <tr key={o.id} className="hover:bg-gray-50">
                                      <td className="p-4 font-mono font-bold text-xs text-primary">#{o.id}</td>
                                      <td className="p-4 text-sm font-bold">{o.customerName}</td>
                                      <td className="p-4 text-sm font-black">{o.totalAmount.toLocaleString()}đ</td>
                                      <td className="p-4">
                                          <select 
                                            value={o.status} 
                                            onChange={(e) => handleUpdateOrder(o.id, e.target.value as OrderStatus)}
                                            className="text-xs font-black uppercase tracking-wider bg-gray-50 border-none rounded-lg focus:ring-primary"
                                          >
                                              {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                          </select>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {activeTab === 'users' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {users.map(u => (
                          <div key={u.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                              <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-16 h-16 rounded-2xl object-cover" />
                              <div className="flex-1">
                                  <p className="font-black text-gray-900">{u.name}</p>
                                  <p className="text-xs text-gray-400 font-bold">{u.email}</p>
                                  <span className="inline-block mt-2 px-3 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">{u.role}</span>
                              </div>
                              {u.id !== currentUser?.id && (
                                  <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600">
                                      <span className="material-symbols-outlined">delete</span>
                                  </button>
                              )}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 animate-scale-up">
                  <h3 className="text-2xl font-black mb-6">Thông tin sản phẩm</h3>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                      <input type="text" placeholder="Tên sản phẩm" required className="w-full bg-gray-50 border-none rounded-xl p-3" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Phân loại" required className="w-full bg-gray-50 border-none rounded-xl p-3" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} />
                        <input type="number" placeholder="Kho" required className="w-full bg-gray-50 border-none rounded-xl p-3" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: Number(e.target.value)})} />
                      </div>
                      <input type="number" placeholder="Giá" required className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-primary" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                      <textarea placeholder="Mô tả" className="w-full bg-gray-50 border-none rounded-xl p-3 h-24" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})}></textarea>
                      <div className="flex gap-4 pt-4">
                          <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg">Lưu lại</button>
                          <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">Hủy</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
