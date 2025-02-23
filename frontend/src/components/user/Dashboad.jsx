import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [resignation, setResignation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResignationStatus();
  }, []);

  const fetchResignationStatus = async () => {
    try {
      const response = await api.get('/user/resignation_status');
      setResignation(response.data.resignation);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        {resignation ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Resignation Status</h3>
              <p>Status: <span className={`font-medium ${
                resignation.status === 'pending' ? 'text-yellow-600' :
                resignation.status === 'approved' ? 'text-green-600' :
                'text-red-600'
              }`}>{resignation.status}</span></p>
              <p>Requested Last Working Day: {new Date(resignation.lwd).toLocaleDateString()}</p>
              {resignation.status === 'approved' && (
                <>
                  <p>Approved Last Working Day: {new Date(resignation.approvedLwd).toLocaleDateString()}</p>
                  <Link 
                    to="/exit-interview"
                    className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Feedback Form
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No active resignation request</p>
            <Link 
              to="/resign"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Resignation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;