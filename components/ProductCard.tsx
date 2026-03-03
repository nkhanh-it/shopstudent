
import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast('success', 'Giỏ hàng', `Đã thêm ${product.name} vào giỏ hàng.`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-center object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Quick badge */}
        {product.stock < 10 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
                Sắp hết hàng
            </span>
        )}
        
        {/* Quick Action Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-black/50 to-transparent">
             <button 
                onClick={handleAddToCart}
                className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors text-sm flex items-center gap-2 transform active:scale-95"
            >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Thêm nhanh
            </button>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {product.category}
            </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
             <span className="material-symbols-outlined text-[16px] text-yellow-400 fill-current">star</span>
             <span className="text-sm font-medium text-gray-600">{product.rating}</span>
             <span className="text-gray-300 mx-1">|</span>
             <span className="text-xs text-gray-500">Đã bán {Math.floor(Math.random() * 200)}</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
            <div>
                 <p className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString('vi-VN')} <span className="text-xs align-top text-gray-500">đ</span>
                 </p>
            </div>
            {/* Mobile Only Add Button */}
            <button 
                onClick={handleAddToCart}
                className="lg:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 active:bg-primary active:text-white"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
