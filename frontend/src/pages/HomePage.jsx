import React from 'react'
import { useState } from 'react'
import VideoEdit from '../components/VideoEdit';
import VideoUpload from '../components/VideoUpload';
const HomePage = () => {
  const [showEdit , setShowEdit] = useState(false);
  return (
    <>
     {!showEdit && <VideoUpload setShowEditPage = {setShowEdit} />}
     {showEdit && <VideoEdit/>}
    </>
  )
}

export default HomePage