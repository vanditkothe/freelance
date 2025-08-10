import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import { apiConnector } from "../services/apiConnector";
import { AUTH_API } from "../services/apis";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLogIn, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));
    setDarkMode(isDark);
  }, []);

  const onSubmit = async (data) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await apiConnector("POST", AUTH_API.LOGIN_API, data);

    localStorage.setItem("token", res.token);  // <-- save token here

    dispatch(loginSuccess({ user: res.user, token: res.token }));
    toast.success("Logged in successfully!", {
      style: {
        background: darkMode ? '#1f2937' : '#f3f4f6',
        color: darkMode ? 'white' : '#111827',
      }
    });

    navigate(res.user?.role === "freelancer" ? "/dashboard" : "/");
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg(err.message || "Login failed");
    toast.error(err.message || "Login failed", {
      style: {
        background: darkMode ? '#1f2937' : '#f3f4f6',
        color: darkMode ? 'white' : '#111827',
      }
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-200/50'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <FiLogIn className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome Back
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "Enter a valid email address",
                  },
                  validate: (value) => {
                    const blocked = ["xyz.com", "tempmail.com", "mailinator.com"];
                    if (blocked.includes(value.split("@")[1]))
                      return "Disposable emails are not allowed";
                    return true;
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className={`text-sm font-medium hover:underline ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'}`}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${loading 
              ? 'bg-emerald-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate("/signup")}
            className={`font-medium hover:underline ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;