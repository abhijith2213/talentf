import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css
import { useErrorHandler } from "react-error-boundary"

// Assets
import { GrAdd } from "react-icons/gr"
import { MdOutlineWorkOff } from "react-icons/md"
import { addNewJob, findAllPosts, findAssignedPosts, findMyPosts, findWorksToMe} from "../../../Apis/JobRequests"
import Client from "./Client"
import Freelancer from "./Freelancer"

function Jobs() {
   const userData = useSelector((state) => state.user)
   const userId = userData._id

   const handleError = useErrorHandler()
   const navigate = useNavigate()
   const [effect, setEffect] = useState('')
   const [showModal, setShowModal] = useState(false)
   // const [showReport, setShowReport] = useState(false)
   const [selected,setSelected] = useState(true)

   /* ------------------------------- ADD NEW JOB ------------------------------ */

   const initialJob = { jobRole: "", workPeriod: "", workType: "", description: "" }
   const [newJob, setNewJob] = useState(initialJob)

   const handleNewJob = (e) => {
      const { name, value } = e.target
      setNewJob({ ...newJob, [name]: value })
   }

   const handleAddNewJob = async (e) => {

      try {
         const { data } = await addNewJob(newJob, userId)
         console.log(data)
         if (data) {
            setShowModal(false)
            setEffect(Date.now())
            toast.success(data.message)
         }
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            navigate("/signin")
         }
         handleError(error)
         console.log(error)
      }
   }

   /* ----------------------------- FETCH  WORKS ----------------------------- */

   const [myJobs, setMyJobs] = useState([])
   const [allJobs, setAllJobs] = useState([])
   useEffect(() => {
      if (userData.accountType === "client") {
         if(selected){
            try {
               const findMyJobs = async () => {
                  const { data } = await findMyPosts(userId)
                  console.log(data, "my postss work")
                  setMyJobs(data)
               }
   
               findMyJobs()
            } catch (error) {
               if (!error?.response?.data?.auth && error?.response?.status === 403) {
                  localStorage.removeItem('userToken')
                  localStorage.removeItem('user')
                  navigate("/signin")
               }
               handleError(error)
               console.log(error)
            }
         }else{
            console.log('in else');
            try {
               const findMyJobs = async () => {
                  const { data } = await findAssignedPosts(userId)
                  console.log(data, "my postss work")
                  setMyJobs(data)
               }
   
               findMyJobs()
            } catch (error) {
               if (!error?.response?.data?.auth && error?.response?.status === 403) {
                  localStorage.removeItem('userToken')
                  localStorage.removeItem('user')
                  navigate("/signin")
               }
               handleError(error)
               console.log(error)
            }
         }
      } else {
         if(selected){
         try {
            const findAllJobs = async () => {
               const { data } = await findAllPosts(userId)
               console.log(data, "zzzzzzzzzzzzz")
               setAllJobs(data)
            }
            findAllJobs()
         } catch (error) {
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
               localStorage.removeItem('userToken')
               localStorage.removeItem('user')
               navigate("/signin")
            }
            console.log(error)
            handleError(error)

         }
      }else{
         try {
            const findMyJobs = async () => {
               const { data } = await findWorksToMe(userId)
               console.log(data, "my postss work")
               setAllJobs(data)
            }
            findMyJobs()
         } catch (error) {
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
               localStorage.removeItem('userToken')
               localStorage.removeItem('user')
               navigate("/signin")
            }
            handleError(error)
            console.log(error)
         }
      }
      }
   }, [userId, effect, selected])



   return (
      <>
      {userData.accountType === 'client' ?
         <div className="overflow-x-hidden no-scrollbar">
            <div className=' pt-12 flex justify-center  '>
            <div className='w-screen flex justify-center'>
            <div className='bg-[#FFFFFF] w-[470px] rounded-lg shadow-md border mb-4 flex justify-around items-center p-2'>
             <p className=' text-gray-400'>Looking for Talents for your next Project?</p>
             <button
                type='button'
                className='text-blue-500 border p border-blue-700 hover:bg-blue-500 hover:text-white focus:ring-4 
                focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center'
                onClick={() => setShowModal(!showModal)}>
                <GrAdd className='text-blue-500' />
                <span className='sr-only '>Post New work</span>
             </button>
            </div>
          </div>
         </div>
          <div className="flex gap-4 justify-center w-3/4 pl-6 ">
            <p disabled={selected} className={selected ?"border rounded-md px-2 bg-blue-400 text-white disabled:cursor-not-allowed":"px-2 cursor-pointer"}
            onClick={()=>setSelected(true)}
            >Current</p>
            <p disabled={!selected} className={!selected ?"border rounded-md px-2 bg-blue-400 text-white disabled:cursor-not-allowed":"px-2 cursor-pointer"}
            onClick={()=>setSelected(false)}>Assigned</p>
          </div>
         
            {myJobs.length !== 0 ?
             myJobs?.map((job,i)=>(

            <Client key={i} job={job} setEffect={setEffect}/>

            )):
            <div className=' w-screen flex justify-center items-center'>
            <div className="flex flex-col items-center justify-center mt-20 ">
               <MdOutlineWorkOff className="text-7xl text-gray-500"/>
               <p className="text-gray-500 font-medium text-xl h-max">There is no job to show!</p>
            </div>
            </div>
            }
          </div>
            : 
            <div className="overflow-x-hidden mt-12">
            <div className="flex gap-4 justify-center w-3/4 pl-6 ">
            <p disabled={selected} className={selected ?"border rounded-md px-2 bg-blue-400 text-white disabled:cursor-not-allowed":"px-2 cursor-pointer"}
            onClick={()=>setSelected(true)}
            >Open</p>
            <p disabled={!selected} className={!selected ?"border rounded-md px-2 bg-blue-400 text-white disabled:cursor-not-allowed":"px-2 cursor-pointer"}
            onClick={()=>setSelected(false)}>Accepted</p>
          </div>
               {allJobs.length !== 0 ? allJobs?.map((job,i)=>(
                  <>
                  {job?.reports?.includes(userData._id)  ?
                     null
                     :
                     <Freelancer key={i} job={job}  setEffect={setEffect}/>}
                  </>
               )):
               <div className=' w-screen flex justify-center h-screen'>
               <div className="flex flex-col items-center justify-center  ">
                  <MdOutlineWorkOff className="text-7xl text-gray-500"/>
                  <p className="text-gray-500 font-medium text-xl h-max">No Jobs to show yet!</p>
                  <p className="text-blue-400 font-medium text-xl h-max">Follow Clients to get Jobs</p>
               </div>
               </div>
               }
          </div>}
          



         {/* ************************** MOdals ****************** */}

         {showModal && (
            <>
               <div className='py-6  bg-opacity-50 bg-white transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0'
                  id='modal'>
                  <div role='alert' className='container mx-auto w-11/12 md:w-2/3 max-w-lg'>
                     <div className='relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400'>
                        <h1 className='text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4'>
                           Add New Work
                        </h1>
                        <label
                           htmlFor='job-role'
                           className='text-gray-800 text-sm font-bold leading-tight tracking-normal'
                        >
                           Job Role
                        </label>
                        <input
                           id='job-role'
                           name='jobRole'
                           onChange={handleNewJob}
                           className='mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border'
                           placeholder='job-role'
                        />

                        <label
                           htmlFor='work-period'
                           className='text-gray-800 text-sm font-bold leading-tight tracking-normal'
                        >
                           work period
                        </label>
                        <input
                           id='work-period'
                           name='workPeriod'
                           onChange={handleNewJob}
                           className='mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border'
                           placeholder='work-period'
                        />
                        <label
                           htmlFor='workType'
                           className='text-gray-800 text-sm font-bold leading-tight tracking-normal'
                        >
                           Work Type
                        </label>
                        <div className='relative mb-5 mt-2'>
                           <select
                              name='workType'
                              onChange={handleNewJob}
                              className='text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center  text-sm border-gray-300 rounded border'
                              id='workType' required>
                              <option value='' disabled selected hidden>Choose Work Type..</option>
                              <option value='Full Time'>Full Time</option>
                              <option value='Part Time'>Part Time</option>
                           </select>
                        </div>
                        <label
                           htmlFor='description'
                           className='text-gray-800 text-sm font-bold leading-tight tracking-normal'>
                           Job description
                        </label>
                        <div className='relative mb-5 mt-2'>
                           <textarea
                              name='description'
                              onChange={handleNewJob}
                              id='description'
                              className='text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full  flex items-center pl-3 text-sm border-gray-300 rounded border max-h-24'
                              cols='30'
                              rows='10'
                           />
                        </div>

                        <div className='flex items-center justify-start w-full'>
                           <button
                              className='focus:outline-none disabled:bg-indigo-200 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm'
                              onClick={handleAddNewJob}
                           >
                              Add
                           </button>
                           <button
                              className='focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm'
                              onClick={() => setShowModal(!showModal)}
                           >
                              Cancel
                           </button>
                        </div>
                        <div className='cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              aria-label='Close'
                              className='icon icon-tabler icon-tabler-x'
                              width={20}
                              height={20}
                              viewBox='0 0 24 24'
                              strokeWidth='2.5'
                              stroke='currentColor'
                              fill='none'
                              strokeLinecap='round'
                              onClick={() => setShowModal(!showModal)}
                              strokeLinejoin='round'
                           >
                              <path stroke='none' d='M0 0h24v24H0z' />
                              <line x1={18} y1={6} x2={6} y2={18} />
                              <line x1={6} y1={6} x2={18} y2={18} />
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )}

         <ToastContainer 
         position="top-center"
         autoClose={3000}
         hideProgressBar
         newestOnTop
         closeOnClick
         rtl={false}
         pauseOnFocusLoss={false}
         draggable
         pauseOnHover
         theme="dark"/>
      </>
   )
}

export default Jobs
