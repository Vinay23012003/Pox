import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if token is missing
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setTimeout(() => navigate("/login"), 1000); // Redirect after 3 sec
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type! Please upload a JPG or PNG image.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");

      const res = await axios.put("http://localhost:5000/api/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({ ...prevUser, avatar: res.data.avatar }));
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-500 dark:text-gray-300 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  const avatarUrl = user?.avatar?.startsWith("http") ? user.avatar : `http://localhost:5000${user.avatar}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-xl w-full flex flex-col sm:flex-row items-center space-x-6 sm:space-x-8 transform transition duration-300 hover:scale-105">
        
        {/* Profile Image (Left Aligned) */}
        <div className="relative w-24 h-24 mb-4 sm:mb-0">
          <img
            src={avatarUrl || "/uploads/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg object-cover"
          />
          <label htmlFor="fileInput" className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs p-1 rounded-full cursor-pointer hover:bg-purple-700 transition">
            📷
          </label>
          <input
            type="file"
            id="fileInput"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleImageChange}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-purple-600 mt-2 animate-pulse">Uploading...</p>}
        </div>

        {/* User Details */}
        <div className="text-center sm:text-left w-full">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{user.fullName}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>

          <div className="mt-4 space-y-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold">📞 Phone:</span> {user.phoneNumber || "N/A"}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold">🏢 Company:</span> {user.companyName || "N/A"}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <p className="text-gray-500 dark:text-gray-300">
                <span className="font-semibold">🏢 Agency:</span> {user.isAgency ? "Yes" : "No"}
              </p>
            </div>
          </div>
          
          <div className="mt-3 text-gray-600 dark:text-gray-300">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, expedita quia consectetur est quaerat illo, rem eligendi quas, molestiae repudiandae adipisci quo cupiditate odio. Saepe, architecto temporibus? Esse, itaque dolorem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
