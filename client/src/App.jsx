
import './App.css'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Navbar from './commponents/common/Navbar'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './commponents/auth/PrivateRoute'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/Reset password pages/ResetPassword'
import ForgotPassword from './pages/Reset password pages/ForgotPassword'

function App() {
  
  return (
    <div className=' text-white min-h-screen bg-richblack-900 justify-center'>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/verify-email' element={<VerifyEmail />}></Route>
          <Route path='/reset-password' element={<ResetPassword/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
          
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
