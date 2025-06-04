import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const key = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
      const response = await fetch(`http://15.237.144.99:5000/data?key=${key}`);
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading submissions');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      try {
        const response = await fetch(`http://15.237.144.99:5000/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete submission');
        }

        // Remove the deleted item from the state
        setSubmissions(submissions.filter(submission => submission.id !== id));
      } catch (err) {
        setError('Error deleting submission');
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubmissions = submissions
    .filter(submission => 
      Object.values(submission).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    الاسم {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('nationalId')}
                  >
                    الرقم القومي {sortField === 'nationalId' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('age')}
                  >
                    السن {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('governorate')}
                  >
                    المحافظة {sortField === 'governorate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('qualification')}
                  >
                    المؤهل {sortField === 'qualification' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('job')}
                  >
                    الوظيفة {sortField === 'job' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('mobile')}
                  >
                    رقم الموبايل {sortField === 'mobile' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right cursor-pointer"
                    onClick={() => handleSort('recitationType')}
                  >
                    نوع التلاوة {sortField === 'recitationType' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-right">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{submission.name}</td>
                    <td className="px-6 py-4">{submission.nationalId}</td>
                    <td className="px-6 py-4">{submission.age}</td>
                    <td className="px-6 py-4">{submission.governorate}</td>
                    <td className="px-6 py-4">{submission.qualification}</td>
                    <td className="px-6 py-4">{submission.job}</td>
                    <td className="px-6 py-4">{submission.mobile}</td>
                    <td className="px-6 py-4">{submission.recitationType}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              السابق
            </button>
            <span className="px-4 py-2">
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 