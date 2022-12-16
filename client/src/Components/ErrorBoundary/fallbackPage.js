import warning from '../../assets/images/warning.jpg'
function fallbackPage({resetErrorBoundary}) {
  return(
        <div className="flex  items-center w-full h-screen">
            <img src={warning} className='h-full w-full absolute object-fill' alt="" />
            <div className='relative -bottom-20 ml-auto mr-auto left-10 right-0 flex flex-col items-center gap-2'>
            <h2 className="text-red-500 text-xl relative  font-medium">Something went wrong!!</h2>
            <button className=' rounded-md bg-blue-400  px-2  text-white' onClick={resetErrorBoundary}>Try again</button>
            </div>
        </div>
  )
}

export default fallbackPage;
