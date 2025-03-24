import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/"); // Redirect non-admins
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  // Role Change (Promote/Demote User)
  const handleToggleAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/admin/users/${id}/admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map((u) => (u._id === id ? { ...u, isAdmin: res.data.user.isAdmin } : u)));
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-300">
        Admin Dashboard
      </h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Search users..."
          className="w-full px-5 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead className="bg-zinc-700">
            <tr>
              <th className="p-5 text-left">Name</th>
              <th className="p-5 text-left">Email</th>
              <th className="p-5 text-left">Role</th>
              <th className="p-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((u) => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
                .map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-700 transition duration-300 hover:bg-gray-700 ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="p-5">{user.fullName}</td>
                    <td className="p-5">{user.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-white text-sm font-semibold 
                      ${user.isAdmin ? "bg-green-600" : "bg-gray-600"}`}>
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-5 flex gap-3">
                      <button
                        onClick={() => handleToggleAdmin(user._id)}
                        className={`px-5 py-2 rounded-lg text-white text-sm transition duration-300 transform hover:scale-105 
                          ${user.isAdmin ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                      >
                        {user.isAdmin ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition duration-300 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="p-5 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
