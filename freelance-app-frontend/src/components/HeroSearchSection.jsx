import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { GIG_API } from "../services/apis";
import bgVideo from "../assets/bgVideo.mp4";

const suggested = [
  "Web Development",
  "Architecture & Interior Design",
  "Writing",
  "Video Editing",
  "Vibe Coding",
];

const HeroSearchSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await apiConnector(
        "GET",
        `${GIG_API.SEARCH_BY_CATEGORY}?q=${query}`
      );
      navigate("/gigs", { state: { searchResults: res } });
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed");
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden text-white font-sans">
      {/* 🎥 Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src={bgVideo}
      />

      {/* 🌈 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-black/60 to-green-900/70 z-10" />

      {/* ✨ Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-300 to-purple-400 drop-shadow-lg">
          Find Your Perfect Freelancer
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
          From coding to creativity — explore talents ready to bring your ideas to life.
        </p>

        {/* 🔍 Search Bar with Glass Effect */}
        <form
          onSubmit={handleSearch}
          className="mt-8 w-full max-w-2xl flex bg-white/10 backdrop-blur-lg border border-white/20 rounded-full overflow-hidden shadow-lg transition-all hover:shadow-green-500/30"
        >
          <input
            type="text"
            placeholder="Search for any service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-5 py-4 text-white placeholder-gray-300 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-cyan-400 px-6 flex items-center justify-center hover:opacity-90 transition"
          >
            <Search size={22} className="text-white" />
          </button>
        </form>

        {/* 🔥 Suggested Tags with Glow */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {suggested.map((tag, idx) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-green-400/30 hover:to-purple-400/30 hover:border-green-300/40 transition-all backdrop-blur-md"
            >
              {tag}
              {idx === suggested.length - 1 && (
                <Sparkles size={14} className="text-yellow-300 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default HeroSearchSection;
