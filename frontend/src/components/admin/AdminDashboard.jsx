import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/resignations');
      const { data } = await response.json();
    } catch (error) {
      console.error('Error fetching resignations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Resignations Card */}
        <div 
          onClick={() => handleCardClick('/admin/resignations')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Resignations
            </h2>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 mt-2">
              Take Action
            </p>
          </div>
        </div>

        {/* Exit Responses Card */}
        <div 
          onClick={() => handleCardClick('/admin/exit-responses')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Exit Responses
            </h2>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">
              View all exit interview responses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;