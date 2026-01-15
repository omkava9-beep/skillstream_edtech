import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { apiConnector } from "../../../services/apiConnector";
import { catagories } from "../../../services/apis";
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

  useEffect(() => {
    fetchSublinks();
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  }

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-richblack-900/80 border-b border-richblack-700">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

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
                      <p className={`${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
                      <IoIosArrowDropdown className="text-richblack-25" />

                      <div className="invisible absolute left-[50%] top-[100%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[1em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[0.5em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {
                          subLinks?.length > 0 ? (
                            subLinks.map((subLink, index) => (
                              <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50">
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
                {user?.image && (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-richblack-700">
                    <img src={user?.image} alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
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
                              to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
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
