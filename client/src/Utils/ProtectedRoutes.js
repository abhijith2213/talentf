
import { Navigate, Outlet } from 'react-router-dom'
const ProtectedRoutes = () => {
    const token = localStorage.getItem('userToken')
  let auth = {'token':token}
return (
    auth.token ? <Outlet/> : <Navigate to='/signin'/>
  )
}

export default ProtectedRoutes