import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
// FIXED: Case-sensitivity for Linux/Render
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { apiConnector } from "../../../services/apiConnector";
import { catagories, courseEndpoints } from "../../../services/apis";
import { useEffect, useState, useRef } from "react";
import { deleteToken } from "../../redux/slices/authReducer";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subLinks, setSubLinks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

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
        w-[98%] max-w-[1400px] h-16 sm:h-20 px-6 sm:px-10 rounded-4xl
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
            className="p-2 rounded-full text-richblack-100 hover:bg-white/10 hover:text-yellow-100 transition-all active:scale-90"
          >
            <IoMdSearch size={22} className="sm:size-6" />
          </button>

          {token && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative hidden lg:block p-2 rounded-full text-richblack-100 hover:bg-white/10 transition-all active:scale-90">
              <IoCartOutline size={24} className="sm:size-7" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-yellow-100 text-[9px] sm:text-[11px] font-black text-richblack-900 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token && (
            <Link to="/dashboard" className="flex items-center gap-2 hover:scale-105 transition-all duration-300">
              <div className="p-0.5 rounded-full border border-yellow-100/30 bg-white/5 shadow-[0_0_10px_rgba(255,214,10,0.1)]">
                <img src={user?.image} alt="Profile" className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover" />
              </div>
              <span className="text-sm font-medium text-richblack-50 hidden lg:block">Dashboard</span>
            </Link>
          )}

          {!token && (
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/login" className="text-richblack-25 font-semibold px-4 py-2 hover:text-white transition-all">Login</Link>
              <Link to="/signup" className="bg-yellow-100 text-richblack-900 font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all">Sign Up</Link>
            </div>
          )}

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-richblack-100 active:scale-95 transition-all">
            <AiOutlineMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {createPortal(
        <div className={`fixed inset-0 z-2000 bg-richblack-900/40 backdrop-blur-3xl flex flex-col transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          <div className={`w-full max-w-[400px] bg-richblack-900 h-full ml-auto shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex justify-between items-center px-8 py-8 border-b border-white/5">
              <img src={logo} alt="Logo" className="h-7" />
              <button onClick={() => { setIsMenuOpen(false); setMobileCatalogOpen(false); }} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all text-richblack-100 hover:text-pink-200">
                <AiOutlineClose size={20} />
              </button>
            </div>

            <div className="flex-1 px-8 py-10 overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-y-10">
                <div className="flex flex-col gap-y-8">
                  <p className="text-[10px] font-black text-richblack-400 uppercase tracking-[0.2em] opacity-50">Navigation</p>
                  {NavbarLinks.map((link, i) => (
                    <div key={i} className="group">
                      {link.title === "Catalog" ? (
                        <div>
                          <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)} className="flex items-center justify-between w-full text-2xl font-bold tracking-tight text-richblack-50 group-hover:text-yellow-100 transition-colors">
                            <span>{link.title}</span>
                            <IoIosArrowDropdown className={`transition-all duration-500 ${mobileCatalogOpen ? "rotate-180 text-yellow-100" : "rotate-0 text-richblack-400"}`} />
                          </button>
                          <div className={`mt-4 flex flex-col gap-4 pl-4 border-l border-yellow-100/20 overflow-hidden transition-all duration-500 ${mobileCatalogOpen ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0"}`}>
                            {subLinks?.map((sub, idx) => (
                              <Link key={idx} to={`/catalog/${sub._id}`} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-richblack-300 hover:text-yellow-100 transition-colors">{sub.name}</Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link to={link.path || "#"} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-bold tracking-tight block transition-colors ${matchRoute(link.path) ? "text-yellow-100" : "text-richblack-50 hover:text-yellow-100"}`}>
                          {link.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {token && (
                  <button
                    onClick={() => setConfirmationModal({
                      text1: "Are you sure?",
                      text2: "You will be logged out of your account.",
                      btn1Text: "Logout",
                      btn2Text: "Cancel",
                      btn1Handler: () => {
                        dispatch(deleteToken());
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                        setIsMenuOpen(false);
                        setConfirmationModal(null);
                      },
                      btn2Handler: () => setConfirmationModal(null),
                    })}
                    className="group mt-4 flex w-full items-center gap-x-3 rounded-2xl border border-pink-500/20 bg-pink-500/5 px-6 py-4 text-lg font-bold text-pink-200 transition-all hover:bg-pink-500/10 active:scale-95 shadow-[0_0_20px_rgba(239,71,111,0.05)]"
                  >
                    <VscSignOut size={24} className="group-hover:translate-x-1 transition-transform" />
                    Logout
                  </button>
                )}

                {!token && (
                  <div className="mt-auto pt-10 flex flex-col gap-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-richblack-800 text-richblack-5 font-bold py-4 rounded-2xl text-center border border-white/5 hover:bg-richblack-700 transition-all">Login</Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="bg-yellow-100 text-richblack-900 font-bold py-4 rounded-2xl text-center hover:scale-[1.02] transition-all">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Search Overlay */}
      {showSearch && createPortal(
        <div className="fixed inset-0 z-2000 flex items-start justify-center pt-24 px-4 bg-richblack-900/60 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-[700px] flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative group">
              <IoMdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-richblack-400 group-focus-within:text-yellow-100 transition-colors" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="Search courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-richblack-800 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-lg text-richblack-5 outline-hidden focus:border-yellow-100/50 shadow-2xl transition-all"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-pink-200 transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Results */}
            {searchQuery.length > 0 && (
              <div className="bg-richblack-800 border border-white/10 rounded-3xl overflow-hidden shadow-2xl divide-y divide-white/5">
                {searchResults.length > 0 ? (
                  searchResults.map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group"
                    >
                      <img src={course.thumbnail} alt={course.courseName} className="h-12 w-20 rounded-lg object-cover border border-white/10" />
                      <div className="flex-1">
                        <p className="font-bold text-richblack-5 group-hover:text-yellow-100 transition-colors">{course.courseName}</p>
                        <p className="text-xs text-richblack-400">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-10 text-center text-richblack-400">
                    <p>No courses found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Floating Mobile Cart */}
      {token && user?.accountType !== "Instructor" && createPortal(
        <div className="fixed bottom-6 right-6 z-2000 lg:hidden animate-in slide-in-from-bottom-20 duration-700 pointer-events-auto">
           <Link to="/dashboard/cart" className="relative flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-richblack-900 shadow-[0_8px_32px_rgba(231,192,9,0.4)] border-4 border-richblack-900/10 active:scale-90 transition-all group overflow-visible">
            <IoCartOutline size={30} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-pink-500 text-[12px] font-black text-white flex items-center justify-center shadow-lg animate-bounce border-2 border-richblack-900/10">
                {totalItems}
              </span>
            )}
            {/* Pulsing effect */}
            <div className="absolute inset-0 rounded-full bg-yellow-100 animate-ping opacity-20 -z-10 group-hover:opacity-40 transition-opacity"></div>
          </Link>
        </div>,
        document.body
      )}

      {/* Confirmation Modal */}
      {confirmationModal && createPortal(
        <div className="fixed inset-0 z-3000 grid place-items-center bg-richblack-900/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
          <div className="w-11/12 max-w-[350px] rounded-3xl border border-white/10 bg-richblack-800 p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500 ease-out">
            <p className="text-2xl font-black tracking-tight text-richblack-5">{confirmationModal.text1}</p>
            <p className="mt-4 mb-8 text-richblack-300 leading-relaxed">{confirmationModal.text2}</p>
            <div className="flex items-center gap-x-4">
              <button 
                className="flex-1 cursor-pointer rounded-2xl bg-yellow-100 py-3 font-black text-richblack-900 hover:scale-105 transition-all"
                onClick={confirmationModal.btn1Handler}
              >
                {confirmationModal.btn1Text}
              </button>
              <button 
                className="flex-1 cursor-pointer rounded-2xl bg-richblack-700 py-3 font-bold text-richblack-5 hover:bg-richblack-600 transition-all"
                onClick={confirmationModal.btn2Handler}
              >
                {confirmationModal.btn2Text}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Navbar;