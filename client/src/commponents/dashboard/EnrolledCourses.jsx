import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../../services/apiConnector';
import { profile } from '../../../services/apis';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiClock, FiBookOpen, FiUser } from 'react-icons/fi';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await apiConnector(
          'GET',
          profile.GET_ENROLLED_COURSES_API,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        
        if (resp.data.success) {
          setCourses(resp.data.courses || []);
        } else {
          setError(resp.data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load enrolled courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-richblack-5 text-3xl font-semibold mb-8">
          Enrolled Courses
        </h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-caribbeangreen-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-richblack-5 text-3xl font-semibold mb-8">
          Enrolled Courses
        </h1>
        <div className="bg-richblack-800 p-6 md:p-8 rounded-xl border border-pink-700 text-pink-200 text-center">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-richblack-5 text-3xl font-semibold mb-8">
          Enrolled Courses
        </h1>
        <div className="bg-richblack-800 p-8 md:p-12 rounded-xl border border-richblack-700 text-center">
          <div className="max-w-md mx-auto">
            <FiBookOpen className="mx-auto text-richblack-400 mb-4" size={48} />
            <h2 className="text-richblack-5 text-xl font-semibold mb-2">
              No Courses Enrolled Yet
            </h2>
            <p className="text-richblack-300 mb-6">
              Start your learning journey by enrolling in courses that interest you.
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-richblack-5 text-3xl font-semibold mb-2">
          Enrolled Courses
        </h1>
        <p className="text-richblack-300">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'} enrolled
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden hover:border-richblack-600 transition-all duration-300 hover:shadow-lg hover:shadow-caribbeangreen-900/20 group"
          >
            {/* Course Thumbnail */}
            <div className="relative overflow-hidden aspect-video bg-richblack-700">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiBookOpen className="text-richblack-500" size={48} />
                </div>
              )}
              {/* Status Badge */}
              {course.status && (
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'Published'
                        ? 'bg-caribbeangreen-700 text-caribbeangreen-50'
                        : 'bg-yellow-700 text-yellow-50'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              )}
            </div>

            {/* Course Details */}
            <div className="p-5">
              {/* Course Name */}
              <h3 className="text-richblack-5 text-lg font-semibold mb-2 line-clamp-2 group-hover:text-caribbeangreen-200 transition-colors">
                {course.courseName || 'Untitled Course'}
              </h3>

              {/* Course Description */}
              {course.courseDescription && (
                <p className="text-richblack-300 text-sm mb-4 line-clamp-2">
                  {course.courseDescription}
                </p>
              )}

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-2 mb-4 text-richblack-400 text-sm">
                  <FiUser size={16} />
                  <span>
                    {course.instructor.firstName} {course.instructor.lastName}
                  </span>
                </div>
              )}

              {/* Course Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-richblack-700">
                <div className="flex items-center gap-2 text-richblack-400 text-sm">
                  <FiClock size={16} />
                  <span>
                    {course.courseContent?.length || 0} sections
                  </span>
                </div>
                {course.price !== undefined && (
                  <div className="text-caribbeangreen-200 font-semibold">
                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                  </div>
                )}
              </div>

              {/* Progress Bar (placeholder - can be enhanced with actual progress) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2 text-xs text-richblack-400">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-caribbeangreen-300 to-caribbeangreen-500 h-full rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/view-course/${course._id}`}
                className="mt-4 w-full block text-center bg-richblack-700 text-richblack-5 py-2.5 rounded-lg font-medium hover:bg-richblack-600 transition-all duration-200 group-hover:bg-caribbeangreen-700"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;