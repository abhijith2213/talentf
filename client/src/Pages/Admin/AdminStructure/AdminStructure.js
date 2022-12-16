import React,{useEffect} from 'react'
import { Outlet ,useNavigate} from 'react-router-dom'
import AdminSideBar from '../../../Components/Admin/AdminSidebar/AdminSideBar'

function AdminStructure() {
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem("adminToken")
    if(!token){
        navigate('/admin_login')
    }else{
      navigate('/admin/admin_panel')
    }
  },[])

  return (
    <div>
        <section className="flex gap-6">
            <AdminSideBar/>
            <Outlet/>
        </section>
    </div>
  )
}

export default AdminStructure