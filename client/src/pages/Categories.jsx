import React, { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { catagories } from '../../services/apis';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import Loader from '../commponents/common/Loader';
import Footer from '../commponents/core/Homepage/Footer';

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const result = await apiConnector("GET", catagories.CATAGORIES_API);
        setCategoriesList(result.data.data);
      } catch (error) {
        console.log("Could not fetch the category list", error);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-richblack-900 pt-20">
      {loading && <Loader />}
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-yellow-200 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-richblack-5 mb-6">
            Explore <span className="text-yellow-100">Categories</span>
          </h1>
          <p className="text-richblack-300 text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed">
            Choose a category that interests you and start your learning journey with our curated expert-led courses.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {categoriesList?.length === 0 && !loading ? (
          <div className="text-center py-20">
            <h2 className="text-2xl text-richblack-400 italic">No categories available at the moment.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesList?.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/catalog/${category._id}`)}
                className="group relative bg-richblack-800 border border-richblack-700 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-yellow-100 hover:shadow-[0_0_30px_rgba(255,214,10,0.1)] hover:-translate-y-2 overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-200 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"></div>
                
                <h3 className="text-2xl font-bold text-richblack-5 mb-4 group-hover:text-yellow-100 transition-colors">
                  {category.name}
                </h3>
                <p className="text-richblack-400 line-clamp-3 mb-8 leading-relaxed">
                  {category.description || "Master these skills with our comprehensive catalog of professional courses."}
                </p>
                
                <div className="flex items-center gap-2 text-yellow-100 font-semibold group-hover:gap-3 transition-all">
                  <span>Browse Courses</span>
                  <IoIosArrowForward />
                </div>

                {/* Glassy border effect on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-100/20 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
