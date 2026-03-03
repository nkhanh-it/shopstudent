
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/firebaseService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };
    fetch();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cửa hàng</h1>
             </div>
             <div className="w-full md:w-96 relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                   <span className="material-symbols-outlined">search</span>
                </span>
                <input 
                   type="text" 
                   placeholder="Tìm kiếm sản phẩm..." 
                   className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary transition-all shadow-sm"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="mt-8 flex overflow-x-auto pb-2 no-scrollbar gap-3">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                   selectedCategory === cat 
                   ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                   : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 {cat === 'All' ? 'Tất cả' : cat}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-white rounded-2xl animate-pulse"></div>)}
             </div>
        ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">search_off</span>
                <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm</h3>
                <button onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">Xóa bộ lọc</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
