import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle, FaBoxOpen, FaPlusCircle } from "react-icons/fa";

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      
      {/* Top: User Info */}
      <div className="text-center mb-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg shadow-indigo-200"
            />
            <span className="absolute -bottom-2 right-0 bg-indigo-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
              SELLER
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserCircle className="text-indigo-600" />
            {user?.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* My Gigs */}
        <Link
          to="/my-gigs"
          className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-transparent hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaBoxOpen className="text-3xl text-green-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-gray-800">My Gigs</h2>
          </div>
          <p className="text-gray-600">
            View, edit, or delete the gigs you’ve created so far.
          </p>
        </Link>

        {/* Create New Gig */}
        <Link
          to="/create-gig"
          className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-transparent hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaPlusCircle className="text-3xl text-blue-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-gray-800">Create New Gig</h2>
          </div>
          <p className="text-gray-600">
            Ready to earn more? Post a new gig and start offering your services.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
