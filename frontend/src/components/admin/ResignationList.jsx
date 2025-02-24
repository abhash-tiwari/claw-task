import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ResignationList = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newLWD, setNewLWD] = useState("");

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const response = await api.get("/admin/resignations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response");
      }

      setResignations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resignations:", error.response || error);
      setError(error.response?.data?.message || "Failed to fetch resignations");
      setLoading(false);
    }
  };

  const handleConclude = async (resignationId, approved, lwd) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      await api.put(
        "/admin/conclude_resignation",
        { resignationId, approved, lwd },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchResignations();
    } catch (error) {
      setError("Failed to update resignation");
      console.error("Error updating resignation:", error.response || error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Resignation Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Employee
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Requested Date
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Status
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resignations.map((resignation) => (
                  <tr key={resignation._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">
                      <div className="min-w-[120px]">
                        {resignation.employeeId?.username || "Unknown"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {editingId === resignation._id ? (
                        <input
                          type="date"
                          value={newLWD}
                          onChange={(e) => setNewLWD(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      ) : (
                        resignation.lwd
                          ? new Date(resignation.lwd).toLocaleDateString()
                          : "N/A"
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          resignation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : resignation.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {resignation.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {resignation.status === "pending" ? (
                        editingId === resignation._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleConclude(resignation._id, true, newLWD)
                              }
                              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-500"
                            >
                              Save & Approve
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setEditingId(resignation._id);
                                setNewLWD(resignation.lwd);
                              }}
                              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleConclude(
                                  resignation._id,
                                  true,
                                  resignation.lwd
                                )
                              }
                              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleConclude(
                                  resignation._id,
                                  false,
                                  resignation.lwd
                                )
                              }
                              className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-500 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResignationList;