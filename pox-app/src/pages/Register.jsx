import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    companyName: "",
    isAgency: null, // Fix: Set to null initially
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, isAgency: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file && !allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Only JPG, JPEG, and PNG files are allowed." }));
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
    setErrors((prev) => ({ ...prev, avatar: "" }));

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (formData.isAgency === null) newErrors.isAgency = "Please select an option";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      login(res.data.user, res.data.token);
      navigate("/login");
    } catch (err) {
      setErrors({ server: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">Register To PopX</h2>

        {errors.server && <p className="text-red-500 text-center">{errors.server}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField label="Full Name" name="fullName" type="text" onChange={handleChange} error={errors.fullName} />
          <InputField label="Phone Number" name="phoneNumber" type="text" onChange={handleChange} error={errors.phoneNumber} />
          <InputField label="Email" name="email" type="email" onChange={handleChange} error={errors.email} />
          <InputField label="Password" name="password" type="password" onChange={handleChange} error={errors.password} />
          <InputField label="Company Name" name="companyName" type="text" onChange={handleChange} error={errors.companyName} />

          {/* Is Agency Radio Buttons */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Are you an Agency? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 mt-1">
              <RadioField name="isAgency" value="yes" label="Yes" onChange={handleRadioChange} />
              <RadioField name="isAgency" value="no" label="No" onChange={handleRadioChange} />
            </div>
            {errors.isAgency && <p className="text-red-500 text-xs">{errors.isAgency}</p>}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="text-sm font-medium text-violet-700 dark:text-gray-300">
              Profile Picture <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              accept="image/jpeg, image/jpg, image/png"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="mt-2 w-16 h-16 rounded-full border" />}
            {errors.avatar && <p className="text-red-500 text-xs">{errors.avatar}</p>}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable InputField Component
const InputField = ({ label, name, type, onChange, error }) => (
  <div>
    <label className="text-sm font-medium text-violet-700 dark:text-gray-300">{label} <span className="text-red-500">*</span></label>
    <input
      type={type}
      name={name}
      placeholder={`Enter ${label}`}
      onChange={onChange}
      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

// Reusable RadioField Component
const RadioField = ({ name, value, label, onChange }) => (
  <label className="flex items-center gap-1 text-sm">
    <input type="radio" name={name} value={value} onChange={onChange} className="w-4 h-4" /> {label}
  </label>
);

export default Register;
