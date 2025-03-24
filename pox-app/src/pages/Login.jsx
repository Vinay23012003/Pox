import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token); // Store JWT token
      login(res.data.user, res.data.token); // Update AuthContext
      navigate("/profile"); // Redirect to profile page after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Login  to Your  PopX Account</h2>
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <h2 className="text-gray-500 mb-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, esse quia. Beatae, quibusdam cupiditate veritatis iste atque saepe! Nihil, obcaecati pariatur praesentium quidem ad minima hic iusto laborum! Recusandae, sequi.</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-violet-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-violet-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md text-sm font-semibold transition duration-300 transform hover:scale-105">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;