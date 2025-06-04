import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    governorate: '',
    qualification: '',
    recitationType: ''
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const key = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
      const response = await fetch(`${API_URL}/data?key=${key}`);
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading submissions: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete submission');
        }

        // Remove the deleted item from the state
        setSubmissions(submissions.filter(submission => submission.id !== id));
      } catch (err) {
        setError('Error deleting submission: ' + err.message);
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
    .filter(submission => 
      (!filters.governorate || submission.governorate === filters.governorate) &&
      (!filters.qualification || submission.qualification === filters.qualification) &&
      (!filters.recitationType || submission.recitationType === filters.recitationType)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle numeric values (like id) differently
      if (sortField === 'id' || sortField === 'age') {
        return sortDirection === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      
      // Handle string values
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

  const exportToCSV = () => {
    // Define the headers for the CSV
    const headers = [
      'الاسم',
      'الرقم القومي',
      'السن',
      'المحافظة',
      'المؤهل',
      'الوظيفة',
      'رقم الموبايل',
      'نوع التلاوة'
    ];

    // Convert the filtered data to CSV format
    const csvData = filteredSubmissions.map(submission => [
      submission.name,
      submission.nationalId,
      submission.age,
      submission.governorate,
      submission.qualification,
      submission.job,
      submission.mobile,
      submission.recitationType
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Add BOM for proper Arabic encoding
    const BOM = '\uFEFF';
    const csvContentWithBOM = BOM + csvContent;

    // Create a Blob with proper encoding
    const blob = new Blob([csvContentWithBOM], { 
      type: 'text/csv;charset=utf-8-sig'
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              تصدير CSV
            </button>
          </div>
          
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.governorate}
              onChange={(e) => setFilters(prev => ({ ...prev, governorate: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">كل المحافظات</option>
              {[...new Set(submissions.map(s => s.governorate))].map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>

            <select
              value={filters.qualification}
              onChange={(e) => setFilters(prev => ({ ...prev, qualification: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">كل المؤهلات</option>
              {[...new Set(submissions.map(s => s.qualification))].map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>

            <select
              value={filters.recitationType}
              onChange={(e) => setFilters(prev => ({ ...prev, recitationType: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">كل أنواع التلاوة</option>
              {[...new Set(submissions.map(s => s.recitationType))].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

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
                    onClick={() => handleSort('id')}
                  >
                    الرقم التسلسلي {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
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
                    <td className="px-6 py-4">{submission.id}</td>
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