import { useEffect, useState } from "react";
import { GIG_API, ORDER_API } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GigCard from "./GigCard";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import { setOwnedGigs } from "../redux/authSlice";
import { FiSearch, FiFilter, FiTrendingUp, FiStar, FiClock, FiAward } from "react-icons/fi";

const ExploreGigs = () => {
  const [allGigs, setAllGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, ownedGigs } = useSelector((state) => state.auth);

  const categories = [
    "All",
    "Graphics & Design",
    "Writing & Translation",
    "Video & Animation",
    "Programming & Tech",
    "Digital Marketing",
    "Music & Audio",
    "Business",
    "Web Development"
  ];

  const fetchAllGigs = async () => {
    setIsLoading(true);
    try {
      const res = await apiConnector("GET", GIG_API.GET_ALL_GIGS);
      setAllGigs(res);
      setFilteredGigs(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gigs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGigs();
  }, []);

  useEffect(() => {
    if (user?.role === "client") {
      const fetchOwnedGigs = async () => {
        try {
          const res = await apiConnector("GET", ORDER_API.GET_MY_ORDERS);
          dispatch(setOwnedGigs(res.ownedGigs));
        } catch (err) {
          console.error("Failed to fetch owned gigs", err);
        }
      };
      fetchOwnedGigs();
    }
  }, [user, dispatch]);

  useEffect(() => {
    filterGigs();
  }, [searchQuery, selectedCategory, allGigs, activeFilter]);

  const filterGigs = () => {
    let gigs = [...allGigs];

    if (selectedCategory && selectedCategory !== "All") {
      gigs = gigs.filter((gig) => gig.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      gigs = gigs.filter((gig) =>
        gig.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply additional filters
    switch (activeFilter) {
      case "trending":
        gigs = gigs.filter(gig => gig.rating >= 4.5).sort((a, b) => b.rating - a.rating);
        break;
      case "top-rated":
        gigs = gigs.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        gigs = gigs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredGigs(gigs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            Find the perfect freelance services
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-emerald-100">
            Browse thousands of professional services tailored to your business needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for services, skills, or freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${activeFilter === "all" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Gigs
            </button>
            <button
              onClick={() => setActiveFilter("trending")}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${activeFilter === "trending" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FiTrendingUp className="mr-1" /> Trending
            </button>
            <button
              onClick={() => setActiveFilter("top-rated")}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${activeFilter === "top-rated" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FiStar className="mr-1" /> Top Rated
            </button>
            <button
              onClick={() => setActiveFilter("newest")}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 ${activeFilter === "newest" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FiClock className="mr-1" /> Newest
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === "All" || !selectedCategory ? "All Services" : selectedCategory}
          </h2>
          <p className="text-gray-600">
            {filteredGigs.length} {filteredGigs.length === 1 ? "service" : "services"} available
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto max-w-md">
              <FiAward className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setActiveFilter("all");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig, index) => (
              <GigCard
                key={gig._id ?? `fallback-${index}`}
                gig={gig}
                owned={ownedGigs?.includes(gig._id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onConfirm={() => navigate("/login")}
        message="You must be logged in to purchase a service. Would you like to login now?"
      />
    </div>
  );
};

export default ExploreGigs;