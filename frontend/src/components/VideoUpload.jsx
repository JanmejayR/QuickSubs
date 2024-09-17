import React from "react";
import { useState, useContext } from "react";
import VideoUploadByUrl from "./VideoUploadByUrl";
import VideoUploadByDevice from "./VideoUploadByDevice";
import { storeVideos } from "../indexedDb/db";
import { AuthContext } from "../store/AuthContext";

import toast from "react-hot-toast";
const VideoUpload = ({setShowEditPage}) => {
  const [uploadBy, setUploadBy] = useState('');

  
  const [video, setVideo] = useState('');
  const [link, setLink] = useState('');
  const {authState, setAuthState}= useContext(AuthContext);

  async function handleUploadByUrl() {
    
    setAuthState({...authState, loading:true})
    
   
    try{
      if(link===''){
        toast.error("Please Enter a valid link");
        setAuthState({...authState, loading:false})
        return;
      }
      const video = await fetch(link);
      console.log(" in video upload by link component, actual video is :- ", video)
      const videoBlob = await video.blob();
      

      
      if(!(videoBlob.type === 'video/mp4' || videoBlob.type === 'video/x-matroska'|| videoBlob.type === 'video/webm' || videoBlob.type === 'video/quicktime')){
        console.log("Invalid video format")
        toast.error("invalid video format, use one from mp4 | mkv | webm | mov ")
        setAuthState({...authState, loading:false})
        return;
      }
      console.log(" in video upload by link component, video is :- ", videoBlob)

      await storeVideos(videoBlob, authState.uuid);
      setShowEditPage(true)
      setAuthState({...authState, loading:false})
      toast.success("Video uploaded successfully")
      console.log("video uploaded to indexed database successfully")
      
    }catch(error){
      setAuthState({...authState, loading:false})
      toast.error(" Uploading Failed, Try another url")
      console.log("Error occurred while downloading video from link")
    }
  }
  async function handleUploadByDevice() {

    setAuthState({...authState, loading:true})

    if(video===''){
      toast.error("Please Select a video");
      setAuthState({...authState, loading:false})
      return;
    }
      console.log(" in video upload component, video is :- ", video)

      
        try{
            if(!(video.type === 'video/mp4' || video.type === 'video/x-matroska' || video.type === 'video/webm' || video.type === 'video/quicktime') ){
              toast.error("invalid video format, use one from mp4 | mkv | webm | mov ")
              setAuthState({...authState, loading:false})
              return;
            }
                  
            await storeVideos(video, authState.uuid);
            setShowEditPage(true)
            toast.success("Video uploaded successfully")
            setAuthState({...authState, loading:false})
            console.log("video uploaded to indexed database successfully")
        }catch(error){
            toast.error(" Uploading Failed, Try again")
            setAuthState({...authState, loading:false})
            console.log("Video uploading to database failed")
        }
   
  }
  return (
    <main className="w-full h-full  flex justify-center items-center ">
      <div className=" w-72 h-96 md:h-3/4  md:w-1/3 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
        <h2 className="text-3xl font-bold  mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mt-8 md:mt-16">
          Upload The Video
        </h2>

        {uploadBy==='' && (
          <div className="flex w-full h-3/4 flex-col gap-10  justify-center items-center ">
            <button
              className="w-2/3 h-1/3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-2xl flex justify-center items-center "
              onClick={()=>{setUploadBy("url")}}
            >
              Upload By Link
            </button>
            <button
              className="w-2/3 rounded-2xl h-1/3  bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center  text-2xl"
              onClick={()=>{setUploadBy("device")}}
            >
              Upload By Device
            </button>
          </div>
        )}

        {uploadBy === 'url' && <VideoUploadByUrl link={link} setLink={setLink} handleUploadByUrl={handleUploadByUrl} setUploadBy={setUploadBy} />}
        {uploadBy === 'device' && <VideoUploadByDevice video={video} setVideo={setVideo} handleUploadByDevice={handleUploadByDevice} setUploadBy={setUploadBy} />}
      </div>
    </main>
  );
};

export default VideoUpload;
