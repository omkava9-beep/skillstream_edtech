
import './App.css'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Navbar from './commponents/common/Navbar'
import Dashboard from './pages/DashBoard'
import PrivateRoute from './commponents/auth/PrivateRoute'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPasswordPages/ResetPassword'
import ForgotPassword from './pages/ResetPasswordPages/ForgotPassword'
import CheckEmail from './pages/ResetPasswordPages/CheckEmail'
import OpenRoute from './commponents/common/OpenRoute'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'

import Catalog from './pages/CatalogPage'
import MyProfile from './commponents/dashboard/MyProfile'
import EnrolledCourses from './commponents/dashboard/EnrolledCourses'
import Settings from './commponents/dashboard/Settings'
import Cart from './commponents/dashboard/Cart'
import CoursePage from './pages/CoursePage'
import InstructorDashBoard from './pages/InstructorDashBoard'
import AddCourse from './pages/AddCourse'
import MyCourses from './commponents/dashboard/MyCourses'
import PurchaseHistory from './commponents/dashboard/PurchaseHistory'
import ViewCourse from '../src/pages/ViewCourse'
import VideoDetails from './commponents/core/ViewCourse/VideoDetails'
import ScrollToTop from './commponents/common/ScrollToTop'
import Categories from './pages/Categories'


function App() {
  
  return (
    <div className=' text-white min-h-screen bg-richblack-900 justify-center'>
      <ScrollToTop />
      <Navbar className="sticky top-0 z-50" />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route 
          path='/login' 
          element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
        />
        <Route 
          path='/signup' 
          element={
          <OpenRoute>
            <SignUp />
          </OpenRoute>
        }
        />
          <Route path='/verify-email' element={<VerifyEmail />}></Route>
          <Route path='/reset-password/:token' element={<ResetPassword/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
          <Route path='/check-email' element={<CheckEmail/>}></Route>
          <Route path='/about' element={<AboutUs/>}></Route>
          <Route path='/contact' element={<ContactUs/>}></Route>
          <Route path='/categories' element={<Categories />}></Route>
          <Route path='/catalog/:catalogId' element={<Catalog/>}></Route>
          <Route 
            path='/dashboard' 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          >
            {/* Nested Routes */}
            <Route index element={<MyProfile/>}></Route>
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}></Route>
            <Route path='/dashboard/instructor' element={<InstructorDashBoard/>}></Route>
            <Route path='/dashboard/add-course' element={<AddCourse/>}></Route>
            <Route path='/dashboard/my-courses' element={<MyCourses/>}></Route>
            <Route path="/dashboard/settings" element={<Settings/>} />
            <Route path="/dashboard/cart" element={<Cart/>} />
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}></Route>
            <Route path="/dashboard/purchase-history" element={<PurchaseHistory />} />
            {/* Add more nested routes as needed based on sidebar-links.js */}
          </Route>
          <Route path="/courses/:courseid" element={<CoursePage></CoursePage>}></Route>
          <Route 
            path='/view-course/:courseId' 
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            <Route path="section/:sectionId/sub-section/:subSectionId" element={<VideoDetails />} />
          </Route>
          
        </Routes>
    </div>
  )
}

export default App
