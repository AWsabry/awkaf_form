import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can change this key to whatever you want
    const validKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    
    if (key === validKey) {
      // Store the authentication state
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('مفتاح غير صحيح');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-600 mt-2">أدخل المفتاح للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="key" className="block text-gray-700 font-medium mb-2">
              المفتاح
            </label>
            <input
              type="password"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل المفتاح"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-4 px-6 rounded-lg transform transition duration-200 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 