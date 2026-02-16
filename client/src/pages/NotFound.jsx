import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background Glow Effect */}
      <div 
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
        aria-hidden="true"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4f46e5] to-[#0ea5e9] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="text-center">
        {/* Neon 404 Badge */}
        <p className="text-base font-bold tracking-widest text-indigo-400 uppercase">Error 404</p>
        
        {/* Main Heading */}
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Lost in the void?
        </h1>
        
        {/* Dimmed Support Text */}
        <p className="mt-6 text-lg leading-7 text-slate-400 max-w-md mx-auto">
          The page you are looking for has vanished into deep space. Let's get you back to safety.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all duration-200"
          >
            Return to Base
          </Link>
          <Link 
            to="/support" 
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Report an issue <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Optional: Bottom Glow */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4338ca] to-[#7c3aed] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </main>
  );
};

export default NotFound;
