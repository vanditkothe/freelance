import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle, FaShoppingCart, FaBookmark, FaComments } from "react-icons/fa";

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">
      
      {/* Top: User Info */}
      <div className="text-center mb-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg shadow-emerald-200"
            />
            <span className="absolute -bottom-2 right-0 bg-emerald-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
              PRO
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserCircle className="text-emerald-600" />
            {user?.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* My Orders */}
        <Link
          to="/my-orders"
          className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-transparent hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaShoppingCart className="text-3xl text-green-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-gray-800">My Orders</h2>
          </div>
          <p className="text-gray-600">View and manage all your orders in one place.</p>
        </Link>

        {/* Saved Gigs */}
        <Link
          to="/saved-gigs"
          className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-transparent hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaBookmark className="text-3xl text-blue-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-gray-800">Saved Gigs</h2>
          </div>
          <p className="text-gray-600">Gigs you’ve bookmarked for later.</p>
        </Link>

        {/* Messages */}
        <Link
          to="/chat"
          className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-transparent hover:border-purple-400 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaComments className="text-3xl text-purple-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
          </div>
          <p className="text-gray-600">Chat with freelancers you've ordered from.</p>
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;
