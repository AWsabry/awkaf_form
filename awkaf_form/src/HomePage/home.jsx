import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThankYou from '../ThankYouPage/ThankYou';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ArabicForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    age: '',
    governorate: '',
    qualification: '',
    job: '',
    mobile: '',
    recitationType: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر',
    'البحيرة', 'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية',
    'المنيا', 'القليوبية', 'الوادي الجديد', 'السويس', 'أسوان',
    'أسيوط', 'بني سويف', 'بورسعيد', 'دمياط', 'الشرقية',
    'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر', 'قنا',
    'شمال سيناء', 'سوهاج'
  ];

  const qualifications = [
    'أمي', 'يقرأ ويكتب', 'ابتدائية', 'إعدادية', 'ثانوية عامة',
    'ثانوية فنية', 'دبلوم', 'بكالوريوس', 'ليسانس', 'دبلوم دراسات عليا',
    'ماجستير', 'دكتوراه'
  ];

  const recitationTypes = ['ترتيل', 'تجويد', 'كليهما'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'الرقم القومي مطلوب';
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'الرقم القومي يجب أن يكون 14 رقم';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'السن مطلوب';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'يرجى إدخال سن صحيح';
    }

    if (!formData.governorate) {
      newErrors.governorate = 'المحافظة مطلوبة';
    }

    if (!formData.qualification) {
      newErrors.qualification = 'المؤهل مطلوب';
    }

    if (!formData.job.trim()) {
      newErrors.job = 'الوظيفة مطلوبة';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'رقم الموبايل مطلوب';
    } else if (!/^01[0-2,5]\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = 'رقم الموبايل غير صحيح';
    }

    if (!formData.recitationType) {
      newErrors.recitationType = 'نوع التلاوة مطلوب';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, 
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        console.log('Form submitted:', formData);
        navigate('/thankyou');
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.'
        }));
      }
    } else {
      setErrors(newErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nationalId: '',
      age: '',
      governorate: '',
      qualification: '',
      job: '',
      mobile: '',
      recitationType: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الإرسال بنجاح!</h2>
            <p className="text-gray-600">تم استلام بياناتك بنجاح، شكراً لك</p>
          </div>
          <button
            onClick={resetForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            إرسال نموذج جديد
          </button>
        </div>
      </div>
    );
  }

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
    <form onSubmit={handleSubmit}>
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white text-center">نموذج التسجيل</h1>
              <p className="text-blue-100 text-center mt-2">يرجى ملء جميع البيانات المطلوبة</p>
            </div>
            
            <div className="p-8 space-y-6">
              {/* الاسم */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ادخل الاسم كاملاً"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* الرقم القومي */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الرقم القومي <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.nationalId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ادخل الرقم القومي (14 رقم)"
                  maxLength="14"
                />
                {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
              </div>

              {/* السن */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  السن <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ادخل العمر"
                  min="1"
                  max="120"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              {/* المحافظة */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.governorate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((gov, index) => (
                    <option key={index} value={gov}>{gov}</option>
                  ))}
                </select>
                {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate}</p>}
              </div>

              {/* المؤهل */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  المؤهل <span className="text-red-500">*</span>
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر المؤهل</option>
                  {qualifications.map((qual, index) => (
                    <option key={index} value={qual}>{qual}</option>
                  ))}
                </select>
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>

              {/* الوظيفة */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الوظيفة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.job ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ادخل الوظيفة"
                />
                {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
              </div>

              {/* رقم الموبايل */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  رقم الموبايل <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="01xxxxxxxxx"
                  maxLength="11"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              {/* ترتيل/تجويد */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  نوع التلاوة <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {recitationTypes.map((type, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="recitationType"
                        value={type}
                        checked={formData.recitationType === type}
                        onChange={handleChange}
                        className="ml-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.recitationType && <p className="text-red-500 text-sm mt-1">{errors.recitationType}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-4 px-6 rounded-lg transform transition duration-200 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                >
                  إرسال البيانات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </form>
    </div>
  );
};

export default ArabicForm;