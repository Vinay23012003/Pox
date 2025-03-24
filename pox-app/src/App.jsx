import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Welcome from "./pages/Welcome";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />

      <Routes>
      
        <Route path="/" element={<Welcome />} />

      
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={ <Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route 
          path="/admindashboard" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
