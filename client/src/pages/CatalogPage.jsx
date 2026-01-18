import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../services/apiConnector';
import { catagorypage } from '../../services/apis';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../commponents/catalogpage/CourseCard';
import { IoIosArrowDown, IoIosArrowUp, IoIosSearch } from 'react-icons/io';
import Footer from '../commponents/core/Homepage/Footer';



const CatalogPage = () => {
  const {user} = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const {catalogId} = useParams();

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [expectSelected, setExpectSelected] = useState([]);
  const [topsellings, setTopsellings] = useState([]);
  const [catagory, setCatagory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(()=>{
    const fetchData = async()=>{
      const {data} = await apiConnector("GET", catagorypage.CATAGORY_PAGE_API+catalogId)
      
      setCatagory(data.catagory);
      setDescription(data.description);
      setSelectedCourses(data.data.selectedCourses);
      setExpectSelected(data.data.expectSelected);
      setTopsellings(data.data.topsellings);
      console.log("selectedCourses",data.data.selectedCourses)
      console.log("expectSelected",data.data.expectSelected)
      console.log("topsellings",data.data.topsellings)
      console.log("catagory",data.catagory)
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
    <div className="min-h-screen bg-richblack-900">
      {/* Hero Section */}
            {/* ... hero section content ... */}
      <div className="w-full bg-richblack-800 border-b border-richblack-700">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 py-10 flex flex-col items-center lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-4">
             {/* ... nav ... */}
            <nav className="flex items-center gap-2 text-sm text-richblack-300">
              <span className="hover:text-richblack-50 cursor-pointer transition-colors">Home</span>
              <span className="text-richblack-500">/</span>
              <span className="hover:text-richblack-50 cursor-pointer transition-colors">Catalog</span>
              <span className="text-richblack-500">/</span>
              <span className="text-yellow-50 font-medium">{catagory}</span>
            </nav>

            {/* Category Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 leading-tight">
              {catagory}
            </h1>

            {/* Description */}
            <p className="text-richblack-200 text-base md:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
            {/* ... Right Sidebar ... */}
          {/* Right Sidebar - Related Resources */}
          <div className="lg:w-[280px] shrink-0">
            <div className="bg-richblack-700 rounded-xl p-5 border border-richblack-600">
              <h3 className="text-lg font-semibold text-richblack-5 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-50"></span>
                Related Resources
              </h3>
              <ul className="flex flex-col gap-3">
                <li className="text-richblack-200 hover:text-yellow-50 cursor-pointer transition-colors flex items-center gap-2 text-sm">
                  <span className="text-yellow-50">📄</span> Python Documentation
                </li>
                <li className="text-richblack-200 hover:text-yellow-50 cursor-pointer transition-colors flex items-center gap-2 text-sm">
                  <span className="text-yellow-50">📄</span> Java Documentation
                </li>
                <li className="text-richblack-200 hover:text-yellow-50 cursor-pointer transition-colors flex items-center gap-2 text-sm">
                  <span className="text-yellow-50">📄</span> C++ Documentation
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      <div className=' flex flex-col max-w-11/12 mx-auto'>
        <div className=' flex flex-col items-start justify-center'>
          <h2 className=' font-semibold text-[30px] text-richblack-5 mt-5'>
            Courses to get you started
          </h2>

          {/* Search Input */}
          <div className="relative w-full md:w-[400px] mt-6">
              <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-richblack-800 text-richblack-5 rounded-full py-2 pl-10 pr-4 border border-richblack-700 focus:border-yellow-50 focus:outline-none transition-colors"
              />
              <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-200 text-lg" />
          </div>

          <div className='flex flex-col md:flex-row justify-between items-center w-full mt-4 gap-4'>
            <div className='flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0'>
              <div onClick={()=>handleFilterType("Most Popular")} className=' flex- justify-center text-center cursor-pointer min-w-max' >
                <p>Most Popular </p>
                <div className={`h-[2px] ${filterType === "Most Popular" ? "bg-yellow-50 text-yellow-100 " : ""} w-full mt-3 transition-colors duration-300 ease-in-out`}></div>
              </div>
             <div onClick={()=>handleFilterType("Newest")} className=' flex- justify-center text-center cursor-pointer min-w-max' >
                <p>Newest</p>
                <div className={`h-[2px] ${filterType === "Newest" ? "bg-yellow-50 text-yellow-100 " : ""} w-full mt-3 transition-colors duration-300 ease-in-out`}></div>
             </div>
             <div onClick={()=>handleFilterType("Trending")} className=' flex- justify-center text-center cursor-pointer min-w-max' >
                <p>Trending</p>
                <div className={`h-[2px] ${filterType === "Trending" ? "bg-yellow-50 text-yellow-100 " : ""} w-full mt-3 transition-colors duration-300 ease-in-out`}></div>
             </div>
            </div>
            
            <button 
                onClick={() => setShowAll(!showAll)} 
                className='text-yellow-50 flex items-center gap-2 hover:scale-110 transition-all duration-200 cursor-pointer whitespace-nowrap'
            >
                {showAll ? "Show Less" : "Show All"}
                {showAll ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>
          <div className='h-px bg-richblack-600 w-full'>
            
          </div>
          {activeCourses?.length === 0 ? (
            <p className="text-xl text-richblack-5 mt-4">No courses available for this category</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {activeCourses
                ?.slice(0, showAll ? activeCourses.length : 3)
                .map((course) => (
                  <CourseCard
                    course={course}
                    key={course._id}
                    Height={"h-[250px]"}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Top Selling Section */}
        {/* Top Selling Section */}
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <h2 className="section_heading text-2xl md:text-3xl font-bold text-richblack-5">Top Selling Courses</h2>
                 <button 
                    onClick={() => setShowAllTopSelling(!showAllTopSelling)} 
                    className='text-yellow-50 flex items-center gap-2 hover:scale-110 transition-all duration-200 cursor-pointer'
                >
                    {showAllTopSelling ? "Show Less" : "Show All"}
                    {showAllTopSelling ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topsellings?.slice(0, showAllTopSelling ? topsellings.length : 3).map((course, i) => (
                    <CourseCard course={course} key={i} Height={"h-[250px]"} />
                ))}
            </div>
        </div>

        {/* Other Categories Section */}
        {/* Other Categories Section */}
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
             <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <h2 className="section_heading text-2xl md:text-3xl font-bold text-richblack-5">Other Categories Courses</h2>
                <button 
                    onClick={() => setShowAllOther(!showAllOther)} 
                    className='text-yellow-50 flex items-center gap-2 hover:scale-110 transition-all duration-200 cursor-pointer'
                >
                    {showAllOther ? "Show Less" : "Show All"}
                    {showAllOther ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expectSelected?.flatMap((category) => category.courses)?.slice(0, showAllOther ? 20 : 3).map((course, i) => (
                    <CourseCard course={course} key={i} Height={"h-[250px]"} />
                ))}
            </div>
        </div>

      </div>

      <Footer></Footer>

      
    </div>
  )
}

export default CatalogPage