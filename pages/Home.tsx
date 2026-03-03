
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/firebaseService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        const data = await getProducts();
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
    };
    fetch();
  }, []);

  const scrollToFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left z-10 relative">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">🚀 Dành riêng cho sinh viên</span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                    Nâng cấp <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Góc học tập</span> <br/>của bạn.
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">Sở hữu ngay laptop và phụ kiện công nghệ với mức giá ưu đãi nhất. Hỗ trợ trả góp, bảo hành chính hãng.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/products" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Mua sắm ngay <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                    </Link>
                    <button onClick={scrollToFeatured} className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all">Xem ưu đãi</button>
                </div>
            </div>
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] group">
                    <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1600&q=80" alt="Hero" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section id="featured" className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Sản phẩm nổi bật</h2>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white rounded-2xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;
