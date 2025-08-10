import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "AI Services",
      "Consulting",
      "Data",
      "Business",
      "Personal Growth & Hobbies",
      "Photography",
      "Finance",
      "End-to-End Projects",
      "Service Catalog",
    ],
  },
  {
    title: "For Clients",
    links: [
      "How It Works",
      "Customer Stories",
      "Trust & Safety",
      "Quality Guide",
      "Online Courses",
      "Guides",
      "Help Center",
    ],
  },
  {
    title: "For Freelancers",
    links: [
      "Become a Freelancer",
      "Become an Agency",
      "Equity Program",
      "Community Hub",
      "Forum",
      "Events",
    ],
  },
  {
    title: "Business Solutions",
    links: [
      "Pro Services",
      "Project Management",
      "Sourcing Service",
      "Content Marketing",
      "Creative Talent",
      "Dropshipping Tools",
      "AI Builder",
      "Logo Maker",
      "Contact Sales",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Careers",
      "Privacy Policy",
      "Terms of Service",
      "Do Not Sell Info",
      "Partnerships",
      "Affiliates",
      "Invite a Friend",
      "Newsroom",
      "Investor Relations",
    ],
  },
];

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800 px-6 py-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Subscription */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay in the loop</h3>
            <p className="text-gray-600">
              Subscribe to our newsletter for the latest updates, tips, and exclusive offers.
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                readOnly
              />
              <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg mb-5 text-gray-900">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={i} className="text-gray-600 hover:text-emerald-600">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-emerald-600">
              Freelance<span className="text-gray-900">Hub</span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
              v2.0
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-5 text-gray-500 text-xl">
           
            <FaInstagram className="hover:text-pink-500" />
            <FaLinkedin className="hover:text-blue-700" />
            <FaFacebook className="hover:text-blue-600" />
            <FaPinterest className="hover:text-red-500" />
            <FaXTwitter className="hover:text-black" />
          </div>

          {/* Language + Currency */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-lg">🌐</span>
              <span>English</span>
            </div>
            <div className="flex items-center gap-1">
              <span>₹</span>
              <span>INR</span>
            </div>
            <span>© {new Date().getFullYear()} FreelanceHub</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>FreelanceHub is a leading marketplace for freelance services worldwide.</p>
          <p className="mt-1">
            All trademarks, logos and brand names are the property of their respective owners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;