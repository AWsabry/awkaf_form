import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-indigo-100 relative" dir="rtl">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20 z-0" 
        style={{ 
          backgroundImage: 'url(https://yt3.googleusercontent.com/MK_waS7n6Dab0vP1kSBrSHNYnKaAKVGvwVySo7vp72tL6sQF3tWYxI3EOP8eHgiOlVjwKl-m=s900-c-k-c0x00ffffff-no-rj)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
          <div className="text-white text-6xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">تم إرسال طلبك بنجاح</h1>
          <p className="text-yellow-100 mb-6">شكراً لتسجيلك، سنتواصل معك قريباً</p>
          
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-white text-yellow-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
