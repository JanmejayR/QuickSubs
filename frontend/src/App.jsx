import SignUp from "./pages/SignUp";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'
import { useContext, useState } from "react";
import { AuthContext } from "./store/AuthContext";
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
function App() {
  const {authState} = useContext(AuthContext);

  return (
    <div
      className="bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden h-screen w-full"
    >
      
      <Router>
        <Routes>
          <Route path="/" element={ authState.authStatus==='loggedIn'? <HomePage/> : <Navigate to="/signup"/>} />
          <Route path="/signup" element={ authState.uuid === '' ? <SignUp />  : <Navigate to="/login" />} />
          <Route path="/login" element={ authState.authStatus !=='loggedIn' ? <Login/>  : <Navigate to="/" />} />

        </Routes>
      </Router>
      <Toaster
  position="top-center"
  reverseOrder={false}/>
    </div>
  );
}

export default App;
