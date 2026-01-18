import { Link, useLocation, matchPath, useNavigate, matchRoutes } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { apiConnector } from "../../../services/apiConnector";
import { catagories, courseEndpoints } from "../../../services/apis";
import { useEffect, useState } from "react";
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

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", catagories.CATAGORIES_API);
      setSubLinks(result.data.data);
    } catch (error) {
      console.log("Could not fetch the category list");
    }
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
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-richblack-900/80 border-b border-richblack-700 transition-all duration-200">
      


      <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-200 ${showSearch ? "blur-sm opacity-50 select-none pointer-events-none" : ""}`}>

        {/* ===== Logo ===== */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <img
            src={logo}
            alt="StudyNotion"
            className="h-8 object-contain"
          />
        </Link>

        {/* ===== Nav Links (Desktop) ===== */}
        <ul className="hidden lg:flex items-center gap-8">
          {NavbarLinks.map((link, index) => {
            return (
              <li key={index} className="h-full flex items-center">
                {
                  link.title === "Catalog" ? (
                    <div className="relative flex items-center gap-2 group cursor-pointer h-full py-2 ">
                      <p className={`${matchRoute("/catalog/:catalogId") ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
                      <IoIosArrowDropdown className="text-richblack-25" />

                      <div className="invisible absolute left-[50%] top-[100%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[1em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[0.5em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {
                          subLinks?.length > 0 ? (
                            subLinks.map((subLink, index) => (
                              <Link to={`/catalog/${subLink._id}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50">
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                          ) : (<div className="text-center">No Categories Found</div>)
                        }
                      </div>

                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
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
            className="hidden lg:block p-2 rounded-full text-richblack-200 hover:text-yellow-400 hover:bg-richblack-800 transition-all"
          >
            <IoMdSearch size={22} />
          </button>

          {/* Cart */}
          {token !== null && (
            <Link to="/dashboard/cart" className="relative mr-2 lg:mr-0" onClick={() => setIsMenuOpen(false)}>
              <IoCartOutline className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-yellow-100 text-center text-xs font-bold text-richblack-900 animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Profile Image (Always visible if logged in) */}
          {token !== null && user?.image && (
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-richblack-700 hover:border-yellow-50 transition-all duration-200">
                <img src={user?.image} alt="User" className="w-full h-full object-cover" />
              </div>
            </Link>
          )}

          {/* Auth / Dashboard (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {token === null ? (
              <>
                <Link to="/login" className="px-5 py-2 rounded-md border border-richblack-600 text-richblack-100 hover:bg-richblack-800 transition-all">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-md bg-yellow-50 text-richblack-900 font-semibold hover:scale-105 transition-all">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-x-4">
                <Link to="/dashboard" className="px-5 py-2 rounded-md bg-richblack-800 text-richblack-50 hover:bg-richblack-700 transition-all">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    dispatch(deleteToken());
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="px-5 py-2 rounded-md bg-richblack-800 text-richblack-50 hover:bg-richblack-700 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden text-richblack-200 p-2 hover:bg-richblack-800 rounded-md transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
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
                                    to={`/course/${course._id}`} 
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
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-richblack-900/98 backdrop-blur-xl border-b border-richblack-700 py-6 px-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-y-4">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="border-b border-richblack-800 pb-2">
                {link.title === "Catalog" ? (
                  <div className="flex flex-col gap-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                    >
                      <p className="text-richblack-50 font-medium">Catalog</p>
                      <IoIosArrowDropdown className={`text-richblack-50 transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                    </div>
                    
                    {isCatalogOpen && (
                      <div className="pl-4 flex flex-col gap-3 pt-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {subLinks?.length > 0 ? (
                          subLinks.map((subLink, idx) => (
                            <Link
                              key={idx}
                              to={`/catalog/${subLink._id}`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsCatalogOpen(false);
                              }}
                              className="text-richblack-200 hover:text-yellow-25 text-sm"
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
                    className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"} font-medium block w-full`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Mobile Auth Actions */}
            <div className="flex flex-col gap-4 mt-6">
              {token === null ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-md border border-richblack-600 text-richblack-100 bg-richblack-800 hover:bg-richblack-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-md bg-yellow-50 text-richblack-900 font-bold hover:bg-yellow-100"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-center rounded-md bg-richblack-800 text-richblack-50 border border-richblack-700"
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
                    className="w-full py-3 text-center rounded-md bg-pink-700 text-white font-medium hover:bg-pink-600"
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
