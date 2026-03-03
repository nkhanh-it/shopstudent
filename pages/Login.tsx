
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isRegistering) {
            if (password !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp.');
            }
            if (password.length < 6) {
                throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
            }
            
            await register(email, password, name);
            showToast('success', 'Thành công', `Chào mừng ${name} đã gia nhập ShopStudent!`);
            navigate('/');
        } else {
            await login(email, password);
            showToast('success', 'Đăng nhập', 'Chào mừng bạn đã quay trở lại!');
            navigate('/');
        }
    } catch (err: any) {
        console.error(err);
        let msg = err.message;
        if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password') || msg.includes('auth/invalid-email')) {
            msg = 'Email hoặc mật khẩu không chính xác.';
        } else if (msg.includes('auth/email-already-in-use')) {
            msg = 'Email này đã được sử dụng.';
        }
        setError(msg);
        showToast('error', 'Thất bại', msg);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setIsRegistering(!isRegistering);
      setError('');
      setPassword('');
      setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
              <span className="material-symbols-outlined">arrow_back</span>
              Về trang chủ
          </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
             <Link to="/">
                <span className="material-symbols-outlined text-primary text-6xl">shopping_bag</span>
             </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? 'Đăng ký tài khoản mới' : 'Đăng nhập vào hệ thống'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button onClick={toggleMode} className="font-medium text-primary hover:text-blue-500 focus:outline-none underline">
            {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {isRegistering && (
                <div className="animate-fade-in">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={isRegistering}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && (
                <div className="animate-fade-in">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required={isRegistering}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
            )}

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : (isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
