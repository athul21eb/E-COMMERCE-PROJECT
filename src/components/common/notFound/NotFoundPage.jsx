// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700">Oops! Page not found.</p>

      <button className="mt-4 px-4 py-2 bg-black text-white rounded" onClick={()=>navigate(-1)}>
        Go back 
      </button>
      
      <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Go back to Home
      </a>
     
    </div>
  );
};

export default NotFound;
