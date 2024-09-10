import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Loader({classes}) {
  return (
    <div
      className={`flex justify-center items-center py-3 px-4 bg-gradient-to-r from-green-800 to-emerald-800  shadow-lg  transition duration-200 ${classes ? classes : " w-full rounded-lg  mt-5 "} `}
    >
      <ClipLoader
        size={25}
        color={"green"}
      />
    </div>
  );
}

export default Loader;
