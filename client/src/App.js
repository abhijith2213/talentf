import "./App.css"
import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"

import LoadingOverlay from "react-loading-overlay-ts"
import HashLoader from "react-spinners/HashLoader"

/* ------------------------------ PAGE IMPORTS ------------------------------ */

// Redux components
import store from "./Redux/User/Store"

// SOCKET CONTEXT
import { SocketContext, socket } from "./Context/socketContext"

// ERROR PAGE
import ErrorPage from "./Pages/ErrorPage/ErrorPage"

// PROTECTED ROUTE

import ProtectedRoutes from "./Utils/ProtectedRoutes"

// ADMIN

import AdminLoginPage from "./Pages/Admin/AdminLogin/AdminLoginPage"
import AdminDashboard from "./Components/Admin/AdminDashboard/AdminDashboard"
import UserManagement from "./Components/Admin/UserManagement/UserManagement"
import AdminStructure from "./Pages/Admin/AdminStructure/AdminStructure"
import PostManagement from "./Components/Admin/PostManagement/PostManagement"
import JobManagement from "./Components/Admin/Job Management/JobManagement"
import ForgotPassword from "./Components/User/ForgotPassword/ForgotPassword"
import ResetPassword from "./Components/User/ForgotPassword/ResetPassword"

// CLIENT

const LandingPage = lazy(() => import("./Pages/User/LandingPage/LandingPage"))
const SignupPage = lazy(() => import("./Pages/User/SignUp/SignupPage"))
const SigninPage = lazy(() => import("./Pages/User/Signin/SigninPage"))
const HomePage = lazy(() => import("./Pages/User/Home/HomePage"))
const ChatPage = lazy(() => import("./Pages/User/ChatPage/ChatPage"))
const UserProfilePage = lazy(() => import("./Pages/User/UserProfile/UserProfilePage"))
const EditProfilePage = lazy(() => import("./Pages/User/EditProfilePage/EditProfilePage"))
const NotificationPage = lazy(() => import("./Pages/User/NotificationPage/NotificationPage"))
const JobsPage = lazy(() => import("./Pages/User/JobsPage/JobsPage"))

function App() {
   const isActive = true
   return (
      <div className='App'>
         <Router>
            {/* USER */}
            <Suspense
               fallback={
                  <div className=' absolute w-full h-full backdrop-blur-sm  flex items-center justify-center'>
                     <LoadingOverlay
                        active={isActive}
                        spinner={<HashLoader color={"#146CF0"} />}
                        text='Please Wait !'
                     ></LoadingOverlay>
                  </div>
               }
            >
               <Routes>
                  <Route path='/' exact element={<LandingPage />}></Route>
                  <Route path='/create_account' element={<SignupPage />}></Route>
                  <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
                  <Route path='/forgotPassword/:email/:otp' element={<ResetPassword />}></Route>
               </Routes>
               {/* <SocketContext.Provider value={socket}> */}
                  <Provider store={store}>
                     <Routes>
                        <Route path='/signin' element={<SigninPage />}></Route>
                        <Route element={<ProtectedRoutes />}>
                           <Route path='/home' element={<HomePage />}></Route>
                           <Route path='/profile/:userName' element={<UserProfilePage />}></Route>
                           <Route path='/myprofile' element={<UserProfilePage />}></Route>
                           <Route path='/message' element={<ChatPage />}></Route>
                           <Route path='/notifications' element={<NotificationPage />}></Route>
                           <Route path='/works' element={<JobsPage />}></Route>
                           <Route path='/account/editProfile' element={<EditProfilePage />}></Route>
                        </Route>
                     </Routes>
                  </Provider>
               {/* </SocketContext.Provider> */}
            </Suspense>

            {/* ADMIN */}

            <Routes>
               <Route path='/admin_login' element={<AdminLoginPage />}></Route>
               <Route path='/admin' element={<AdminStructure />}>
                  <Route path='/admin/admin_panel' element={<AdminDashboard />}></Route>
                  <Route path='/admin/user_management' element={<UserManagement />}></Route>
                  <Route path='/admin/post_management' element={<PostManagement />}></Route>
                  <Route path='/admin/job_management' element={<JobManagement />}></Route>
               </Route>
            </Routes>

            {/* Error Page  */}

         </Router>
      </div>
   )
}

export default App
