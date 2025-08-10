import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    toast.success("You have been logged out.");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-100 shadow-sm sticky top-0 z-50 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wide">
            Freelance<span className="text-emerald-600">Hub</span>
          </Link>

          {/* Desktop Links */}
          <div className="space-x-6 hidden md:flex items-center">
            <Link
              to="/gigs"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Explore Gigs
            </Link>

            {user && (
              <Link
                to="/create-gig"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Post a Gig
              </Link>
            )}

            <Link
              to="/about"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              About
            </Link>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-white rounded bg-emerald-600 hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-white rounded bg-emerald-600 hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                >
                  Join
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default Navbar;
