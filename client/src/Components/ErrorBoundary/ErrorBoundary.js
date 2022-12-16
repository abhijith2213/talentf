
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert" className='flex justify-center'>
      <div className='w-1/2 flex flex-col items-center justify-center'>
        
      <p className='text-red-500'>Something went wrong!!</p>
      <p className=''>Click try again to reload</p>
      <button className='px-2 text-white text-center bg-blue-500 rounded-md' onClick={resetErrorBoundary}>Try again</button>
        </div>
    </div>
  )
}

export default ErrorFallback