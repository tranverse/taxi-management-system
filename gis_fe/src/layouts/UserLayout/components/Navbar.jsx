import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillDashboard, AiFillSignal } from "react-icons/ai";
import { SiGooglemarketingplatform } from "react-icons/si";
import { RiTaskFill } from "react-icons/ri";
import { FaUserCircle  } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [active, setActive] = useState(location.pathname); // State lưu mục được chọn

  const handleClick = (path) => {
    setActive(path); // Cập nhật mục đang được chọn
  };

  return (
    <div className="w-60 bg-white h-screen p-4  ">
      <div className="flex items-center mb-6">
        <img 
          alt="Logo" 
          className="mr-2" 
          height="40" 
          src="https://storage.googleapis.com/a1aa/image/Fjf7FGeo55lwRU3csaC7qfYO9JNCAJPS8k6_0u76CeA.jpg" 
          width="40" 
        />
        <span className="text-xl font-bold">VTaxi</span>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link 
              to="/user/dashboard" 
              className={`flex items-center p-2 rounded-lg ${active === '/' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => handleClick('/dashboard')}
            >
              <AiFillDashboard /> &nbsp;
              Chuyến xe
            </Link>
          </li>
         
          <li className="mb-4">
            <Link 
              to="/user/all-drivers" 
              className={`flex items-center p-2 rounded-lg ${active === '/task' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => handleClick('/all-drivers')}
            >
              <RiTaskFill /> &nbsp;
              Tài xế
            </Link>
          </li>
          {/* <li className="mb-4">
            <Link 
              to="/user" 
              className={`flex items-center p-2 rounded-lg ${active === '/employees' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => handleClick('/employees')}
            >
              <FaUserCircle /> &nbsp;
              Nhân viên
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/reports" 
              className={`flex items-center p-2 rounded-lg ${active === '/reports' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`} 
              onClick={() => handleClick('/reports')}
            >
              <AiFillSignal /> &nbsp;
              Báo cáo
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
