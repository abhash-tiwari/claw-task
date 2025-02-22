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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Resignation Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Requested Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {resignations.map((resignation) => (
              <tr key={resignation._id}>
                <td className="px-6 py-4">
                  {resignation.employeeId?.username || "Unknown"}
                </td>
                <td className="px-6 py-4">
                  {editingId === resignation._id ? (
                    <input
                      type="date"
                      value={newLWD}
                      onChange={(e) => setNewLWD(e.target.value)}
                      className="border p-1 rounded w-32"
                    />
                  ) : (
                    resignation.lwd ? new Date(resignation.lwd).toLocaleDateString() : "N/A"
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      resignation.status === "pending"
                        ? "bg-yellow-500"
                        : resignation.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {resignation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {resignation.status === "pending" ? (
                    editingId === resignation._id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleConclude(resignation._id, true, newLWD)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save & Approve
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => { setEditingId(resignation._id); setNewLWD(resignation.lwd); }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConclude(resignation._id, true, resignation.lwd)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleConclude(resignation._id, false, resignation.lwd)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="text-gray-500">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResignationList;
