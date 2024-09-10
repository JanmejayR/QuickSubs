import React from 'react'
import Input from './Input'
import { useContext} from 'react'
import { AuthContext } from '../store/AuthContext'
import Loader from "./Loader";
const VideoUploadByDevice = ({video, setVideo, handleUploadByDevice, setUploadBy}) => {

  const {authState, setAuthState} = useContext(AuthContext);

  return (
    <main className="w-full h-3/4  flex justify-center items-center ">
      <div className=" flex  pt-8 h-3/4 items-center flex-col   w-full ">
       

        <Input
		type='file'
		
		
		onChange={(e) => setVideo(e.target.files[0])}
		/>
            
            {authState.loading === false ? <button
              className="w-2/3 rounded-2xl h-16  bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center  text-2xl"
              onClick={handleUploadByDevice}
            >
              Upload 
            </button>: <Loader classes= " w-2/3 h-16 mt-0 rounded-2xl"/>}

            <button
              className="w-1/4 rounded-2xl h-16 mt-8  bg-gradient-to-r from-[#a3b18a] to-[#588157] text-white 
						font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center  text-2xl"
              onClick={()=>{setUploadBy('')}}
            >
              Go Back 
            </button>
          </div>
    </main>
  )
}

export default VideoUploadByDevice