import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../services/apiConnector';
import { catagorypage } from '../../services/apis';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../commponents/catalogpage/CourseCard';
import { IoIosArrowDown, IoIosArrowUp, IoIosSearch } from 'react-icons/io';
import Footer from '../commponents/core/Homepage/Footer';
import Loader from '../commponents/common/Loader';


const CatalogPage = () => {
  const {user} = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const {catalogId} = useParams();

  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [expectSelected, setExpectSelected] = useState([]);
  const [topsellings, setTopsellings] = useState([]);
  const [catagory, setCatagory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true);
      try {
        const {data} = await apiConnector("GET", catagorypage.CATAGORY_PAGE_API+catalogId)
        
        setCatagory(data.catagory);
        setDescription(data.description);
        setSelectedCourses(data.data.selectedCourses);
        setExpectSelected(data.data.expectSelected);
        setTopsellings(data.data.topsellings);
      } catch (error) {
        console.log("Error fetching catalog data", error);
      }
      setLoading(false);
    } 
    fetchData();
  },[catalogId])


  const [filterType, setFilterType] = useState("Most Popular");
  const [searchQuery, setSearchQuery] = useState("");


  
  const activeCourses = React.useMemo(() => {
      let filteredCourses = selectedCourses.filter((course) => {
          const courseNameMatch = course.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
          const instructorNameMatch = (course.instructor?.firstName + " " + course.instructor?.lastName).toLowerCase().includes(searchQuery.toLowerCase());
          return courseNameMatch || instructorNameMatch;
      });

      let sortedCourses = [...filteredCourses];
      if (filterType === "Most Popular") {
        sortedCourses.sort(
          (a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
        );
      } else if (filterType === "Newest") {
        sortedCourses.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });
      } else if (filterType === "Trending") {
        sortedCourses.sort(
          (a, b) =>
            (b.ratingAndReviews?.length || 0) - (a.ratingAndReviews?.length || 0)
        );
      }
      return sortedCourses;
  }, [selectedCourses, filterType, searchQuery]);

  const handleFilterType = (type) => {
    setFilterType(type);
  }
  const [showAll, setShowAll] = useState(false);
  const [showAllTopSelling, setShowAllTopSelling] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);

  return (
    <div className="relative bg-linear-to-br from-richblack-900 via-richblack-900 to-richblack-800 text-richblack-5 min-h-screen pt-16 overflow-hidden">
      {loading && <Loader />}
      
      {/* --- The Big Gradient Ball (Center) --- */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(255,214,10,0.4) 0%, rgba(3,151,171,0.2) 50%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      {/* Wrapping content in a relative container to stay above the ball */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b border-richblack-700">
          <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-200 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
          
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-richblack-400 mb-6">
              <span className="hover:text-richblack-100 cursor-pointer transition-colors">Home</span>
              <span className="text-richblack-600">/</span>
              <span className="hover:text-richblack-100 cursor-pointer transition-colors">Catalog</span>
              <span className="text-richblack-600">/</span>
              <span className="text-yellow-100 font-semibold">{catagory}</span>
            </nav>

            {/* Category Title & Description */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-yellow-100 to-yellow-300 bg-clip-text text-transparent mb-3 leading-tight">
                {catagory}
              </h1>
              <p className="text-richblack-300 text-sm md:text-base leading-relaxed max-w-3xl">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
          
          {/* Courses to Get Started Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-6">Courses to get you started</h2>

            {/* Search Input */}
            <div className="relative w-full md:w-96 mb-8">
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-richblack-800 text-richblack-5 rounded-lg py-3 pl-11 pr-4 border border-richblack-700 focus:border-yellow-100 focus:outline-none transition-colors text-sm"
              />
              <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400 text-lg" />
            </div>

            {/* Filter Tabs & Show All Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-richblack-700">
              <div className="flex gap-6 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {["Most Popular", "Newest", "Trending"].map((type) => (
                  <div
                    key={type}
                    onClick={() => handleFilterType(type)}
                    className="cursor-pointer min-w-max transition-all duration-300"
                  >
                    <p className={`text-sm font-medium pb-2 ${filterType === type ? "text-yellow-100" : "text-richblack-300"}`}>
                      {type}
                    </p>
                    <div
                      className={`h-1 transition-colors duration-300 ${
                        filterType === type ? "bg-yellow-100" : "bg-richblack-700"
                      } w-full`}
                    ></div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAll(!showAll)}
                className="text-yellow-100 flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm font-semibold"
              >
                {showAll ? "Show Less" : "Show All"}
                {showAll ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>

            {/* Courses Grid */}
            {activeCourses?.length === 0 ? (
              <p className="text-base text-richblack-300 py-8">No courses available for this category</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses
                  ?.slice(0, showAll ? activeCourses.length : 3)
                  .map((course) => (
                    <CourseCard course={course} key={course._id} Height="h-60" />
                  ))}
              </div>
            )}
          </div>

          {/* Top Selling Section */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">Top Selling Courses</h2>
              <button
                onClick={() => setShowAllTopSelling(!showAllTopSelling)}
                className="text-yellow-100 flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm font-semibold"
              >
                {showAllTopSelling ? "Show Less" : "Show All"}
                {showAllTopSelling ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topsellings?.slice(0, showAllTopSelling ? topsellings.length : 3).map((course) => (
                <CourseCard course={course} key={course._id} Height="h-60" />
              ))}
            </div>
          </div>

          {/* Other Categories Section */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">Other Categories Courses</h2>
              <button
                onClick={() => setShowAllOther(!showAllOther)}
                className="text-yellow-100 flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm font-semibold"
              >
                {showAllOther ? "Show Less" : "Show All"}
                {showAllOther ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expectSelected
                ?.flatMap((category) => category.courses)
                ?.slice(0, showAllOther ? 20 : 3)
                .map((course) => (
                  <CourseCard course={course} key={course._id} Height="h-60" />
                ))}
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  )
}

export default CatalogPage