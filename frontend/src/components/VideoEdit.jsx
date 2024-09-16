import React from 'react'
import { useContext, useEffect,useState } from 'react'
import { AuthContext } from '../store/AuthContext'
import { getVideo } from '../indexedDb/db';
import { initFFmpeg } from '../util/ffmpeg';
import { storeSrt } from '../indexedDb/db';
import Loader from './Loader';
import toast from 'react-hot-toast';
import SubLanguage from './SubLanguage';

const VideoEdit = () => {

   // authState.uuid has the userId

   //browser does not support avi format natively, so I didn't add it
   const {authState, setAuthState} = useContext(AuthContext); 
   const [videoUrl, setVideoUrl] = useState(null);
   const [finalVideoUrl, setFinalVideoUrl] = useState(null);
   const [subtitleUrl, setSubtitleUrl] = useState(null);

   const [selectedInputVideoLanguage , setSelectedInputVideoLanguage] = useState('en');
   const [selectedSubtitleLanguage, setSelectedSubtitleLanguage] = useState('en');

   useEffect(() => {
    // Fetch the stored video when the component mounts
    const fetchStoredVideo = async () => {
      const userId = authState.uuid;
      const storedVideo = await getVideo(userId);
      if (storedVideo && storedVideo.video) {
        // Create a URL from the existing Blob
        const url = URL.createObjectURL(storedVideo.video);
        setVideoUrl(url); // Set the video URL
      } else {
        toast.error(" No video found while generating subtitles")
        console.log('No video found for this user.');
      }
    };

    fetchStoredVideo();
  }, [authState.uuid]);

  function getExtensionFromMimeType(mimeType) {
    const mimeTypes = {
        'video/mp4': 'mp4',
        'video/x-matroska': 'mkv',
        'video/quicktime': 'mov',
        'video/webm': 'webm',
    };
    
    return mimeTypes[mimeType] || 'unknown';
}

 function getMimeTypeFromExtension(extension){
  const extensionTypes = {
    'mp4': 'video/mp4',
    'mkv': 'video/x-matroska',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
  };
  return extensionTypes[extension] || 'unknown';
 }

 function getRightSubtitleType(videoExt){
   let rightSubtitleType = '';

   if(videoExt === 'mp4' || videoExt === 'mov'){
    rightSubtitleType = 'mov_text'
   }
   else if(videoExt === 'mkv'){
    rightSubtitleType = "srt"
   }
   else if (videoExt === 'webm'){
    rightSubtitleType = "webvtt"
   }
   return rightSubtitleType;
 }

   async function generateSubtitleAndDownloadVideo(){

    setAuthState({...authState, loading:true})

   
    const ffmpeg = await initFFmpeg();
    
    try{

        // loading user's video
        const userId = authState.uuid
        toast(" processing the video....")
        const storedVideo = await getVideo(userId);
        


        if (storedVideo.video) {

          console.log(" inside video edit, here is video ", storedVideo.video)
          
            
            const arrayBuffer = await storedVideo.video.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            
            const videoExt = getExtensionFromMimeType(storedVideo.video.type);

            // Write the video file to FFmpeg's virtual file system
            await ffmpeg.writeFile(`input.${videoExt}`, uint8Array);
            console.log("file written successfully")

            toast(" Extracting audio....")
            toast(" Big files may take 2-3 minutes....")

         

            // extracting audio
            await ffmpeg.exec(['-i', `input.${videoExt}`, '-q:a', '0', '-map', 'a', 'output.mp3']);

                // Read the extracted audio file
                const data = await ffmpeg.readFile('output.mp3');

                // Convert the result to a Blob 
                const audioBlob =  new Blob([data.buffer], { type: 'audio/mp3' });
                console.log(" the audio :- ", audioBlob)

                toast("Generating Subtitles...")
                toast("Please wait for a min or two...")
                const response = await fetch('https://localhost:5000/api/user/subtitles' , {
                  method: 'post',
                  headers:{
                    'Content-Type': audioBlob.type,
                    'Authorization': `Bearer ${authState.jwt}`,
                    'Subtitle-Language': selectedSubtitleLanguage,
                    "Input-Language": selectedInputVideoLanguage
                  },
                  body: audioBlob,
                })

                const subtitleData = await response.json();
                const srtContent = subtitleData.subtitles;


                await storeSrt(userId , srtContent );

                
                await ffmpeg.writeFile('subtitle.srt', new TextEncoder().encode(srtContent));
                console.log("Subtitles written to ffmpeg successfully");

               // to Display subtitles in browser, we have to convert it to vtt format
                await ffmpeg.exec(['-i' , 'subtitle.srt' , 'subtitle.vtt'])
                const vttData = await ffmpeg.readFile('subtitle.vtt');
                const vttBlob = new Blob([vttData.buffer], {type:'text/vtt'});
                const vttUrl = URL.createObjectURL(vttBlob);
                
        // Its better to add subtitles as an overlay rather than burning them to the video, this gives user option to turn them on or off
        toast("Encoding subtitles to output video....")


        const rightSubtitleType = getRightSubtitleType(videoExt)

        const rightSubtitleFile = videoExt === 'webm' ? 'subtitle.vtt' : 'subtitle.srt'


        await ffmpeg.exec(['-i', `input.${videoExt}`, '-i', rightSubtitleFile, '-c:v', 'copy', '-c:a', 'copy', '-c:s', rightSubtitleType, `output.${videoExt}`]);

        toast.success("Subtitles added successfully")
        setAuthState({...authState, loading:false})
        console.log("Subtitles embedded successfully");

        // Read the final output video file
        const outputData = await ffmpeg.readFile(`output.${videoExt}`);

        const outputExt = getMimeTypeFromExtension(videoExt);
        const outputBlob = new Blob([outputData.buffer], { type: outputExt });
        const outputUrl = URL.createObjectURL(outputBlob);

        // Trigger download of the output video
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = `output_with_subtitles.${videoExt}`;
        link.click();

        setFinalVideoUrl(outputUrl);
        setSubtitleUrl(vttUrl)
        URL.revokeObjectURL(videoUrl); 
          } else {
            toast.error(" No video found for this user")
            setAuthState({...authState, loading:false})
            console.log('No video found for this user.');
          }
    }catch(error){
        setAuthState({...authState, loading:false})
        console.log(" error during subtitle embedding :- ", error)
    }
  }
  return (
    <main className="w-full h-full flex justify-center ">
      <div className=" flex pt-16  items-center flex-col  w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
      {finalVideoUrl ? (
          <video src={finalVideoUrl} controls className="mb-4 w-full max-w-xl">
            {subtitleUrl && <track src={subtitleUrl} kind="subtitles" srcLang="en" default />}
          </video>
        ) : (
          videoUrl && (
            <video src={videoUrl} controls className="mb-4 w-full max-w-xl" />
          )
        )}         
       
          <SubLanguage selectedInputVideoLanguage={selectedInputVideoLanguage} setSelectedInputVideoLanguage={setSelectedInputVideoLanguage} selectedSubtitleLanguage={selectedSubtitleLanguage} setSelectedSubtitleLanguage = {setSelectedSubtitleLanguage}/>
       
            {authState.loading === false? <button
              className="w-2/3 max-w-96 rounded-2xl h-16  bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center  text-2xl"
              onClick={generateSubtitleAndDownloadVideo}
            >
                Embed Subs and Download
            </button> : <Loader classes=" w-2/3 max-w-96 rounded-2xl h-16"/>}
          </div>
    </main>
  )
}

export default VideoEdit