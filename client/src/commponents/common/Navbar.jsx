import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { VscDashboard } from "react-icons/vsc";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { apiConnector } from "../../../services/apiConnector";
import { catagories, courseEndpoints } from "../../../services/apis";
import { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();

  const [subLinks, setSubLinks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  const prevScrollY = useRef(0);

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", catagories.CATAGORIES_API);
        setSubLinks(result.data.data);
      } catch (error) { console.log("Category fetch error"); }
    };
    fetchSublinks();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show if at top, hide if scrolling down, show if scrolling up
      if (currentScrollY < 50) setIsVisible(true);
      else if (currentScrollY > prevScrollY.current) setIsVisible(false);
      else setIsVisible(true);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 sm:py-6 px-4 pointer-events-none transition-all duration-700 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
      
      <nav className={`
        pointer-events-auto
        flex items-center justify-between
        w-[98%] max-w-[1400px] /* Spans almost full width but stays floating */
        h-16 sm:h-20
        px-6 sm:px-10
        rounded-[2rem]
        bg-richblack-900/70 backdrop-blur-2xl
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
        hover:border-yellow-100/20 hover:shadow-yellow-100/5
        transition-all duration-500
        ${showSearch ? "scale-95 blur-md" : "scale-100 blur-0"}
      `}>

        {/* --- Logo Section --- */}
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
        </Link>

        {/* --- Navigation Links (Desktop) --- */}
        <ul className="hidden lg:flex items-center gap-x-10">
          {NavbarLinks.map((link, index) => (
            <li key={index} className="relative group">
              {link.title === "Catalog" ? (
                <div className="flex items-center gap-1 cursor-pointer py-2 text-richblack-25 font-medium group-hover:text-yellow-100 transition-colors">
                  <p>{link.title}</p>
                  <IoIosArrowDropdown className="transition-transform duration-300 group-hover:rotate-180" />
                  
                  {/* Mega Dropdown / Catalog */}
                  <div className="invisible absolute top-[120%] left-1/2 -translate-x-1/2 w-[260px] flex flex-col rounded-2xl bg-richblack-800/95 backdrop-blur-xl p-3 opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 border border-white/10 shadow-2xl z-50">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-richblack-800 rotate-45 border-l border-t border-white/10" />
                    {subLinks?.length > 0 ? (
                      subLinks.map((sub, i) => (
                        <Link key={i} to={`/catalog/${sub._id}`} className="px-4 py-3 rounded-xl hover:bg-yellow-100/10 hover:text-yellow-100 transition-all font-medium text-sm">
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center animate-pulse text-richblack-400">Fetching Categories...</div>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link.path} className={`text-base font-medium transition-all duration-300 py-2 block ${matchRoute(link.path) ? "text-yellow-100" : "text-richblack-25 hover:text-yellow-100"}`}>
                  {link.title}
                  {/* Indicator Dot */}
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-100 rounded-full transition-all duration-300 ${matchRoute(link.path) ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"}`} />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* --- Action Buttons (Right) --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Icon */}
          <button 
            onClick={() => { setShowSearch(true); if(allCourses.length === 0) {/* Fetch logic */} }} 
            className="p-2.5 rounded-full text-richblack-100 hover:bg-white/10 hover:text-yellow-100 transition-all group active:scale-90"
          >
            <IoMdSearch size={24} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Cart Section */}
          {token && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative p-2.5 rounded-full text-richblack-100 hover:bg-white/10 transition-all group">
              <IoCartOutline size={26} className="group-hover:rotate-12 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-linear-to-tr from-yellow-100 to-yellow-400 text-[11px] font-black text-richblack-900 flex items-center justify-center shadow-[0_0_10px_rgba(255,214,10,0.5)]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Auth */}
          <div className="hidden sm:flex items-center gap-4 ml-2">
            {!token ? (
              <>
                <Link to="/login" className="text-richblack-25 font-semibold hover:text-white px-4 py-2 transition-all">Login</Link>
                <Link to="/signup" className="bg-linear-to-r from-yellow-50 to-yellow-200 text-richblack-900 font-bold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(255,214,10,0.3)] hover:scale-105 transition-all">
                  Sign Up
                </Link>
              </>
            ) : (
              <div 
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-100/50 cursor-pointer transition-all"
                onClick={() => navigate("/dashboard")}
              >
                <img src={user?.image} alt="User" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-white/20" />
                <span className="text-sm font-medium text-richblack-50 hidden md:block">Profile</span>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-richblack-100 active:scale-90 transition-transform">
            {isMenuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Full-Screen Menu Overlay --- */}
      {isMenuOpen && createPortal(
        <div className="fixed inset-0 z-[110] bg-richblack-900 flex flex-col p-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
           <div className="flex justify-between items-center mb-12">
              <img src={logo} alt="Logo" className="h-8" />
              <button onClick={() => setIsMenuOpen(false)}><AiOutlineClose size={32} className="text-richblack-50" /></button>
           </div>
           <div className="flex flex-col gap-8">
              {NavbarLinks.map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-bold text-richblack-50 hover:text-yellow-100"
                >
                  {link.title}
                </Link>
              ))}
              {!token && (
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl text-center py-4 rounded-2xl border border-white/10 text-white">Login</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-2xl text-center py-4 rounded-2xl bg-yellow-100 text-richblack-900 font-bold">Sign Up</Link>
                </div>
              )}
           </div>
        </div>,
        document.body
      )}

      {/* --- Search Overlay --- */}
      {showSearch && createPortal(
        <div className="fixed inset-0 z-[200] flex justify-center items-start pt-20 px-4">
          <div className="absolute inset-0 bg-richblack-900/90 backdrop-blur-xl transition-all" onClick={() => setShowSearch(false)} />
          <div className="relative w-full max-w-3xl animate-in zoom-in-95 duration-300">
             <div className="flex items-center bg-richblack-800 rounded-3xl border border-white/20 px-6 py-4 shadow-3xl">
                <IoMdSearch className="text-richblack-400 text-3xl" />
                <input 
                  autoFocus
                  placeholder="What do you want to learn today?"
                  className="flex-1 bg-transparent border-none outline-none px-4 text-xl text-white placeholder:text-richblack-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setShowSearch(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <AiOutlineClose size={24} className="text-richblack-200" />
                </button>
             </div>
             {/* Search results would map here */}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Navbar;