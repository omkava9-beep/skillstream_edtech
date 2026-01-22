import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { matchPath, useLocation, NavLink } from 'react-router-dom';

const SidebarLink = ({link, iconName}) => {

    const Icon = Icons[iconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }


  return (
    <NavLink
    to={link.path}
    className={ `relative px-6 py-3 mx-2 rounded-lg text-sm font-semibold flex items-center gap-x-2 transition-all duration-300 border border-transparent ${
      matchRoute(link.path) 
        ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/10 text-yellow-50 border-yellow-400/50 shadow-lg shadow-yellow-400/20" 
        : "text-richblack-300 hover:bg-richblack-700/30 hover:text-richblack-5 hover:border-yellow-400/30"
    }`}
    >
        <span className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-r-md transition-all duration-300 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}>

        </span>

        <div className='flex items-center gap-x-2'>
            <Icon className="text-lg" />
            <span>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SidebarLink
