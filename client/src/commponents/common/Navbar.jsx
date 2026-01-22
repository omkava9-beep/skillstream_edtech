import { Link, useLocation, matchPath, useNavigate, matchRoutes } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { apiConnector } from "../../../services/apiConnector";
import { catagories, courseEndpoints } from "../../../services/apis";
import { useEffect, useState, useRef } from "react";
import { deleteToken } from "../../redux/slices/authReducer";


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [subLinks, setSubLinks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(window.scrollY);
  const isInitialMount = useRef(true);
  

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", catagories.CATAGORIES_API);
      setSubLinks(result.data.data);
    } catch (error) {
      console.log("Could not fetch the category list");
    }
  }
  
  // Handle scroll event for hide/show navbar
  useEffect(() => {
    // Ensure navbar is visible on initial mount
    setIsVisible(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide/show after user has scrolled from initial position
      if (!isInitialMount.current) {
        if (currentScrollY > prevScrollY.current) {
          // Scrolling down - hide navbar
          setIsVisible(false);
        } else if (currentScrollY < prevScrollY.current) {
          // Scrolling up - show navbar
          setIsVisible(true);
        }
      }
      
      prevScrollY.current = currentScrollY;
      isInitialMount.current = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const profileHandler = () => {
    console.log('profileHandler')
  }

  // Search States
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Debounce search or filter effect could go here, 
    // but for now we filter immediately on render or input change 
    if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
    }
    const results = allCourses.filter(course => 
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.instructor?.firstName + " " + course.instructor?.lastName).toLowerCase().includes(searchQuery.toLowerCase())
    );
     setSearchResults(results);
  }, [searchQuery, allCourses]);

  useEffect(() => {
    fetchSublinks();
  }, []);

  const handleSearchClick = async () => {
    setShowSearch(true);
    if (allCourses.length === 0) {
        try {
            const { data } = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);
            if (data.success) {
                setAllCourses(data.data);
            }
        } catch (error) {
            console.log("Could not fetch courses for search", error);
        }
    }
  }

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  }

  return (
    <div className={`fixed top-0 z-50 w-full h-14 backdrop-blur-xl bg-gradient-to-b from-richblack-900/40 via-richblack-900/20 to-transparent border-b border-richblack-700/10 shadow-lg shadow-richblack-900/20 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className={`relative max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between transition-all duration-200 ${showSearch ? "blur-sm opacity-50 select-none pointer-events-none" : ""}`}>

        {/* ===== Logo ===== */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
          <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-yellow-400/50">
            <img
              src={logo}
              alt="StudyNotion"
              className="h-8 object-contain transition-all duration-300"
            />
          </div>
        </Link>

        {/* ===== Nav Links (Desktop) ===== */}
        <ul className="hidden lg:flex items-center gap-8">
          {NavbarLinks.map((link, index) => {
            return (
              <li key={index} className="h-full flex items-center">
                {
                  link.title === "Catalog" ? (
                    <div className="relative flex items-center gap-2 group cursor-pointer h-full py-2">
                       <p className={`font-semibold transition-all duration-300 ${matchRoute("/catalog/:catalogId") ? "text-yellow-100" : "text-richblack-5 group-hover:text-yellow-100"}`}>
                        {link.title}
                      </p>
                      <IoIosArrowDropdown className={`text-lg transition-all duration-300 ${matchRoute("/catalog/:catalogId") ? "text-yellow-100" : "text-richblack-5 group-hover:text-yellow-100"} group-hover:rotate-180`} />

                      <div className="invisible absolute left-[50%] top-[140%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[1em] flex-col rounded-xl bg-gradient-to-br from-richblack-700 to-richblack-800 p-4 text-richblack-50 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-[0.5em] group-hover:opacity-100 lg:w-[300px] shadow-2xl border border-richblack-600/50 backdrop-blur-xl">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-700"></div>
                        {
                          subLinks?.length > 0 ? (
                            subLinks.map((subLink, index) => (
                              <Link 
                                to={`/catalog/${subLink._id}`} 
                                key={index} 
                                className="rounded-lg bg-transparent py-3 pl-4 hover:bg-yellow-400/10 hover:text-yellow-100 hover:translate-x-1 transition-all duration-200 font-medium border-l-2 border-transparent hover:border-yellow-100"
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                          ) : (<div className="text-center py-2 text-richblack-400 italic">No Categories Found</div>)
                        }
                      </div>
                      
                      {/* Active Indicator for Catalog */}
                      <span className={`absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-yellow-100 to-yellow-400 rounded-full transition-all duration-300 ${matchRoute("/catalog/:catalogId") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                    </div>
                  ) : (
                    <Link to={link?.path} className="relative group">
                      <p className={`font-semibold transition-all duration-300 ${matchRoute(link?.path) ? "text-yellow-100" : "text-richblack-5 group-hover:text-yellow-100"}`}>
                        {link.title}
                      </p>
                      {/* Hover/Active Indicator */}
                      <span className={`absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-yellow-100 to-yellow-400 rounded-full transition-all duration-300 ${matchRoute(link?.path) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                    </Link>
                  )
                }
              </li>
            );
          })}
        </ul>

        {/* ===== Right Section ===== */}
        <div className="flex items-center gap-4">

          {/* Search (Desktop) */}
          <button
            onClick={handleSearchClick}
            className="hidden lg:block p-2.5 rounded-full text-richblack-5 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group border border-richblack-600/50 hover:border-yellow-400/50"
          >
            <IoMdSearch size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </button>

          {/* Cart */}
          {token !== null && (
            <Link to="/dashboard/cart" className="relative mr-2 lg:mr-0 group" onClick={() => setIsMenuOpen(false)}>
              <div className="p-2.5 rounded-full border border-richblack-600/50 group-hover:border-yellow-400/50 transition-all duration-300 group-hover:bg-yellow-400/10">
                <IoCartOutline className="text-2xl text-richblack-5 group-hover:text-yellow-400 transition-colors duration-300 group-hover:scale-110" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-center text-xs font-bold text-richblack-900 animate-bounce shadow-lg shadow-yellow-400/50">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Profile Image (Always visible if logged in) */}
          {token !== null && user?.image && (
            <div className="relative group cursor-pointer lg:block hidden">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-richblack-600/50 group-hover:border-yellow-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-400/30 group-hover:scale-110">
                <img src={user?.image} alt="User" className="w-full h-full object-cover" />
              </div>

              {/* Dropdown Menu */}
              <div className="invisible absolute top-[120%] right-0 z-[1000] flex flex-col rounded-xl bg-gradient-to-br from-richblack-700 to-richblack-800 p-2 text-richblack-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 min-w-[170px] shadow-2xl border border-richblack-600/50 backdrop-blur-xl group-hover:translate-y-1">
                <div className="absolute -top-1.5 right-3 h-4 w-4 rotate-45 border-t border-l border-richblack-600 bg-richblack-700"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full gap-x-2 items-center py-3 px-4 hover:bg-yellow-400/10 hover:text-yellow-100 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-yellow-400/30 hover:translate-x-1"
                >
                  <VscDashboard className="text-lg" />
                  <span>Dashboard</span>
                </Link>
                <div 
                  onClick={() => {
                    dispatch(deleteToken());
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="flex w-full gap-x-2 items-center py-3 px-4 hover:bg-pink-500/10 hover:text-pink-300 rounded-lg transition-all duration-200 text-pink-300 font-medium border border-transparent hover:border-pink-500/30 hover:translate-x-1 cursor-pointer"
                >
                  <VscSignOut className="text-lg" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}

          {/* Auth / Dashboard (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {token === null ? (
              <>
                <Link to="/login" className="px-5 py-2 rounded-lg border-2 border-richblack-600 text-richblack-5 hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-400/5 transition-all duration-300 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-300 text-richblack-900 font-bold hover:shadow-lg hover:shadow-yellow-400/50 hover:scale-105 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden text-richblack-5 p-2.5 hover:bg-yellow-400/10 hover:text-yellow-400 rounded-lg transition-all duration-300 border border-richblack-600/50 hover:border-yellow-400/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <AiOutlineClose size={24} className="transition-transform duration-300" /> : <AiOutlineMenu size={24} className="transition-transform duration-300" />}
          </button>
        </div>
      </div>

       {/* ===== Search Overlay (Desktop) ===== */}
       {/* ===== Search Overlay (Desktop) - Portal to Body ===== */}
        {showSearch && createPortal(
            <div className="fixed inset-0 z-[1000] flex justify-center items-start pt-3 pointer-events-none">
                {/* Backdrop to catch clicks */}
                <div 
                    className="absolute inset-0 bg-transparent pointer-events-auto cursor-default" 
                    onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                />

                {/* Search Box Container - Matches Navbar alignment */}
                <div className="relative w-full max-w-[600px] pointer-events-auto z-[1010]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for courses, instructors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full bg-richblack-800 text-richblack-5 rounded-full py-2 pl-10 pr-10 border border-richblack-700 focus:border-yellow-50 focus:outline-none transition-all shadow-xl"
                        />
                        <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-200 text-xl" />
                        <button 
                            onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-200 hover:text-richblack-50"
                        >
                            <AiOutlineClose />
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="absolute top-[120%] left-0 w-full bg-richblack-800 rounded-lg border border-richblack-700 shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                            {searchResults.map((course) => (
                                <Link 
                                    to={`/courses/${course._id}`} 
                                    key={course._id} 
                                    className="block px-4 py-3 hover:bg-richblack-700 transition-colors border-b border-richblack-700 last:border-0"
                                    onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={course.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                                        <div>
                                            <p className="text-richblack-5 font-medium text-sm line-clamp-1">{course.courseName}</p>
                                            <p className="text-richblack-300 text-xs">
                                                {course.instructor?.firstName} {course.instructor?.lastName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {searchQuery && searchResults.length === 0 && (
                         <div className="absolute top-[120%] left-0 w-full bg-richblack-800 rounded-lg border border-richblack-700 shadow-xl p-4 text-center text-richblack-200">
                             No results found
                         </div>
                    )}
                </div>
            </div>,
            document.body
        )}

      {/* ===== Mobile Menu Overlay ===== */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-richblack-900/98 backdrop-blur-xl border-b border-richblack-700 py-8 px-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-y-6">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="border-b border-richblack-800 pb-4 last:border-0">
                {link.title === "Catalog" ? (
                  <div className="flex flex-col gap-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                    >
                      <p className={`font-semibold text-lg transition-colors ${matchRoute("/catalog/:catalogId") ? "text-yellow-25" : "text-richblack-50 group-hover:text-yellow-25"}`}>Catalog</p>
                      <IoIosArrowDropdown className={`text-xl transition-transform duration-300 ${matchRoute("/catalog/:catalogId") ? "text-yellow-25" : "text-richblack-50"} ${isCatalogOpen ? "rotate-180 text-yellow-25" : ""}`} />
                    </div>
                    
                    {isCatalogOpen && (
                      <div className="pl-4 flex flex-col gap-4 pt-4 pb-2 animate-in fade-in slide-in-from-top-4 duration-300 border-l border-richblack-700 ml-1">
                        {subLinks?.length > 0 ? (
                          subLinks.map((subLink, idx) => (
                            <Link
                              key={idx}
                              to={`/catalog/${subLink._id}`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsCatalogOpen(false);
                              }}
                              className="text-richblack-200 hover:text-yellow-50 text-base font-medium transition-colors"
                            >
                              {subLink.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-richblack-400 text-sm italic">No Categories found</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link?.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-50 hover:text-yellow-25"} font-semibold text-lg block w-full transition-colors`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Mobile Auth Actions */}
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-richblack-800">
              {token === null ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-lg border border-richblack-600 text-richblack-100 bg-richblack-800 hover:bg-richblack-700 transition-all font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-lg bg-yellow-50 text-richblack-900 font-bold hover:bg-yellow-100 transition-all shadow-md active:scale-95"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-lg bg-richblack-800 text-richblack-50 border border-richblack-700 font-medium hover:bg-richblack-700 transition-all"
                  >
                    Dashboard
                    
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(deleteToken());
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full py-3 text-center rounded-lg bg-pink-700/20 text-pink-400 border border-pink-700/50 font-bold hover:bg-pink-700 hover:text-white transition-all active:scale-95 mt-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
