import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".mobile-menu")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-cyan-950 text-white px-6 py-4 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          <Link to="/" className="hover:text-yellow-300 transition duration-300">Pox App</Link>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              {user.fullName && (
                <Link to="/profile" className="hover:text-yellow-300 transition duration-300">Profile</Link>
              )}
              <span className="font-medium text-lg">{user.fullName}</span>

              {user.isAdmin && (
                <Link to="/admindashboard" className="hover:text-yellow-300 transition duration-300">
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-5 py-2 rounded-full hover:bg-red-600 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition duration-300">Login</Link>
              <Link to="/register" className="hover:text-yellow-300 transition duration-300">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents menu from closing immediately
            setMenuOpen(!menuOpen);
          }}
          className="md:hidden text-3xl focus:outline-none transition-transform duration-300 transform hover:rotate-90"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`mobile-menu fixed top-16 left-0 w-full bg-zinc-900 shadow-md transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          {user ? (
            <>
              {user.fullName && (
                <Link to="/profile" className="text-lg font-semibold hover:text-yellow-300 transition">Profile</Link>
              )}
              <span className="font-medium text-lg">{user.fullName}</span>

              {user.isAdmin && (
                <Link to="/admindashboard" className="text-lg font-semibold hover:text-yellow-300 transition">
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-5 py-3 rounded-full hover:bg-red-600 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-semibold hover:text-yellow-300 transition">Login</Link>
              <Link to="/register" className="text-lg font-semibold hover:text-yellow-300 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
