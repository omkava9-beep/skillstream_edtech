import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector } from "react-redux";
import profileReducer from "../../redux/slices/profileReducer";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { apiConnector } from "../../../services/apiConnector";
import { catagories } from "../../../services/apis";
import { useEffect, useState } from "react";
import { deleteToken } from "../../redux/slices/authReducer";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [subLinks, setSubLinks] = useState([]);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", catagories.CATAGORIES_API);
      console.log("Printing Sublinks result:", result);
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
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="StudyNotion"
            className="h-8 object-contain"
          />
        </Link>

        {/* ===== Nav Links (Desktop) ===== */}
        <ul className="hidden md:flex items-center gap-8">
          {NavbarLinks.map((link, index) => {
            return (
              <li key={index}>
                {
                  link.title === "Catalog" ? (
                    <div className="relative flex items-center gap-2 group cursor-pointer">
                      <p className={`${ matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
                      <IoIosArrowDropdown className="text-richblack-25"/>

                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {
                          subLinks.length > 0 ? (
                            subLinks.map((subLink, index) => (
                              <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50">
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                          ) : (<div className="text-center">No Courses Found</div>)
                        }
                      </div>

                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
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

          {/* Search */}
          <button
            className="
              p-2 rounded-full
              text-richblack-200
              hover:text-yellow-400
              hover:bg-richblack-800
              transition-all
            "
          >
            <IoMdSearch size={22} />
          </button>

          {/* Cart */}
          {token !== null && (
            <Link to="/dashboard/cart" className="relative">
              <IoCartOutline className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-yellow-100 text-center text-xs font-bold text-richblack-900 animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth / Dashboard */}
          {token === null ? (
            location.pathname === "/login" ? (
              <Link
                to="/signup"
                className="
                  px-5 py-2
                  rounded-md
                  bg-gradient-to-r from-yellow-400 to-yellow-300
                  text-richblack-900
                  font-semibold
                  hover:scale-105
                  transition-all
                "
              >
                Sign Up
              </Link>
            ) : (
              <Link
                to="/login"
                className="
                  px-5 py-2
                  rounded-md
                  border border-richblack-600
                  text-richblack-100
                  hover:bg-richblack-800
                  hover:border-yellow-400
                  transition-all
                "
              >
                Login
              </Link>
            )
          ) : (
            <div className="flex items-center gap-x-4">
               {
                user && user?.image && (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-richblack-700">
                    <img src={user?.image} alt="User" className="w-full h-full object-cover" />
                  </div>
                )
               }
                 <Link
                to="/dashboard"
                className="
                  px-5 py-2
                  rounded-md
                  bg-richblack-800
                  text-richblack-50
                  hover:bg-richblack-700
                  hover:scale-105
                  transition-all
                "
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  dispatch(deleteToken());
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="
                  px-5 py-2
                  rounded-md
                  bg-richblack-800
                  text-richblack-50
                  hover:bg-richblack-700
                  hover:scale-105
                  transition-all
                "
              >
                Logout
              </button>
            </div>
           
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
