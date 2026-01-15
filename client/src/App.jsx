
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
function App() {
  
  return (
    <div className=' text-white min-h-screen bg-richblack-900 justify-center'>
      <Navbar/>
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
          <Route 
            path='/dashboard' 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
        </Routes>
    </div>
  )
}

export default App
