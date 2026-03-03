
import React from 'react';
/* Import hooks from react-router to resolve missing exported member errors */
import { useParams, useNavigate } from 'react-router';
import { MOCK_PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold">Sản phẩm không tồn tại</h2>
            <button onClick={() => navigate('/products')} className="mt-4 text-primary hover:underline">Quay lại cửa hàng</button>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image */}
        <div className="flex flex-col-reverse">
          <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="mb-4">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
               {product.category}
             </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">{product.price.toLocaleString('vi-VN')} đ</p>
          </div>

          <div className="mt-3 flex items-center">
             <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm font-semibold text-yellow-800 w-fit">
                <span className="material-symbols-outlined text-[16px] mr-1 text-yellow-600">star</span>
                {product.rating} / 5
             </div>
             <p className="ml-4 text-sm text-gray-500 border-l border-gray-200 pl-4 text-green-600 font-medium">
                Còn hàng ({product.stock})
             </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>

          <div className="mt-10 flex sm:flex-col1">
            <button
              onClick={() => addToCart(product)}
              className="max-w-xs flex-1 bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary sm:w-full"
            >
              <span className="material-symbols-outlined mr-2">add_shopping_cart</span>
              Thêm vào giỏ hàng
            </button>
            <button
              type="button"
              className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="material-symbols-outlined">favorite</span>
              <span className="sr-only">Add to favorites</span>
            </button>
          </div>
          
          {/* Mock Policies */}
          <div className="mt-8 border-t border-gray-200 pt-8">
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-green-500">verified_user</span>
                   <span className="text-sm text-gray-600">Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-blue-500">local_shipping</span>
                   <span className="text-sm text-gray-600">Miễn phí vận chuyển toàn quốc</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-purple-500">sync_alt</span>
                   <span className="text-sm text-gray-600">Đổi trả trong 7 ngày</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
