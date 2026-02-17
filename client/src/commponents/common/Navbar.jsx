import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector } from "react-redux";
// FIXED: Case-sensitivity for Linux/Render
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../../assets/Logo/Logo-Full-Light.png";
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
  
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const prevScrollY = useRef(0);

  const matchRoute = (route) => {
    if (!route) return false;
    return matchPath({ path: route }, location.pathname);
  };

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", catagories.CATAGORIES_API);
        setSubLinks(result.data.data);
      } catch (error) {
        console.log("Category fetch error", error);
      }
    };
    fetchSublinks();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) setIsVisible(true);
      else if (currentScrollY > prevScrollY.current) setIsVisible(false);
      else setIsVisible(true);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);
      setAllCourses(response?.data?.data || []);
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = allCourses.filter((course) =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, allCourses]);

  if (location.pathname.startsWith("/view-course")) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 sm:py-6 px-4 pointer-events-none transition-all duration-700 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
      
      <nav className={`
        pointer-events-auto flex items-center justify-between
        w-[98%] max-w-[1400px] h-16 sm:h-20 px-6 sm:px-10 rounded-[2rem]
        bg-richblack-900/70 backdrop-blur-2xl border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all duration-500
        ${showSearch ? "scale-95 blur-md" : "scale-100 blur-0"}
      `}>
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="Logo" className="h-8 sm:h-10 object-contain transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-x-10">
          {NavbarLinks.map((link, index) => (
            <li key={index} className="relative group">
              {link.title === "Catalog" ? (
                <div className="flex items-center gap-1 cursor-pointer py-2 text-richblack-25 font-medium group-hover:text-yellow-100 transition-colors">
                  <p>{link.title}</p>
                  <IoIosArrowDropdown className="transition-transform group-hover:rotate-180" />
                  <div className="invisible absolute top-[120%] left-1/2 -translate-x-1/2 w-[260px] flex flex-col rounded-2xl bg-richblack-800/95 backdrop-blur-xl p-3 opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-2 transition-all border border-white/10 shadow-2xl z-50">
                    {subLinks?.length > 0 ? (
                      subLinks.map((sub, i) => (
                        <Link key={i} to={`/catalog/${sub._id}`} className="px-4 py-3 rounded-xl hover:bg-yellow-100/10 hover:text-yellow-100 transition-all text-sm">{sub.name}</Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-richblack-400 font-medium">Loading...</div>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link.path} className={`text-base font-medium py-2 block ${matchRoute(link.path) ? "text-yellow-100" : "text-richblack-25 hover:text-yellow-100"}`}>
                  {link.title}
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-100 rounded-full transition-all ${matchRoute(link.path) ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => { setShowSearch(true); fetchAllCourses(); }} 
            className="p-2.5 rounded-full text-richblack-100 hover:bg-white/10 hover:text-yellow-100 transition-all active:scale-90"
          >
            <IoMdSearch size={24} />
          </button>

          {token && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative p-2.5 rounded-full text-richblack-100 hover:bg-white/10 transition-all active:scale-90">
              <IoCartOutline size={26} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-yellow-100 text-[11px] font-black text-richblack-900 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-4">
            {!token ? (
              <>
                <Link to="/login" className="text-richblack-25 font-semibold px-4 py-2 hover:text-white transition-all">Login</Link>
                <Link to="/signup" className="bg-yellow-100 text-richblack-900 font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all">Sign Up</Link>
              </>
            ) : (
              <div onClick={() => navigate("/dashboard")} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-100/50 cursor-pointer transition-all">
                <img src={user?.image} alt="User" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-sm font-medium text-richblack-50 hidden md:block">Dashboard</span>
              </div>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-richblack-100 active:scale-95 transition-all">
            <AiOutlineMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && createPortal(
        <div className="fixed inset-0 z-[1000] bg-richblack-900 flex flex-col transition-all duration-500 opacity-100">
          <div className="flex justify-between items-center px-8 py-8">
            <img src={logo} alt="Logo" className="h-8" />
            <button onClick={() => { setIsMenuOpen(false); setMobileCatalogOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
              <AiOutlineClose size={24} className="text-white" />
            </button>
          </div>

          <div className="flex-1 px-8 py-4 overflow-y-auto">
            <div className="flex flex-col gap-y-6">
              {NavbarLinks.map((link, i) => (
                <div key={i}>
                  {link.title === "Catalog" ? (
                    <div>
                      <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)} className="flex items-center justify-between w-full text-5xl font-black tracking-tighter text-richblack-200">
                        <span>{link.title}</span>
                        <IoIosArrowDropdown className={`transition-transform duration-500 ${mobileCatalogOpen ? "rotate-180 text-yellow-100" : "rotate-0"}`} />
                      </button>
                      {mobileCatalogOpen && (
                        <div className="mt-6 flex flex-col gap-4 pl-4 border-l-2 border-yellow-100/30">
                          {subLinks?.map((sub, idx) => (
                            <Link key={idx} to={`/catalog/${sub._id}`} onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-richblack-50">{sub.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={link.path || "#"} onClick={() => setIsMenuOpen(false)} className={`text-5xl font-black tracking-tighter block ${matchRoute(link.path) ? "text-yellow-100" : "text-richblack-200"}`}>
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Navbar;