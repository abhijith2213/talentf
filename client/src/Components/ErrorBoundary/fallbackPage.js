import serverError from '../../assets/images/serverError.jpg'
function fallbackPage({resetErrorBoundary}) {
  return(
        <div className="flex  items-center w-full h-screen">
            <img src={serverError} className='h-full w-full absolute object-fill' alt="" />
            <div className='relative -bottom-10 ml-auto mr-auto left-10 right-0 flex flex-col items-center gap-2'>
            <button className=' rounded-md bg-[#00DFC2]  px-4 py-2  text-white' onClick={resetErrorBoundary}>Try again</button>
            </div>
        </div>
  )
}

export default fallbackPage;
