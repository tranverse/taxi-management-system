import React, { useState } from 'react'
import { FaBars, FaBell } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { MdLogout } from "react-icons/md"
import { FaUser } from "react-icons/fa"
import { setToken } from '@redux/slices/auth.slice'
import { useDispatch } from 'react-redux'

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); // Hook để điều hướng
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Quản lý trạng thái dropdown
  const dispatch = useDispatch()
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage
    dispatch(setToken({ accessToken: "", refreshToken: "" }));

    navigate('/user/login'); // Điều hướng về trang đăng nhập
  };

  // Hàm toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button className="p-2 bg-gray-200 rounded-lg mr-4">
              <FaBars />
            </button>
            <input
              className="p-2 bg-gray-300 rounded-lg w-64"
              placeholder="Tìm kiếm"
              type="text"
            />
          </div>
          <div className="flex items-center relative">
            <button className="p-2 bg-gray-200 rounded-lg mr-4">
              <FaBell />
            </button>
            <button className="p-2 bg-gray-200 rounded-lg mr-4">
              <IoMdSettings />
            </button>
            <img
              alt="User Avatar"
              className="rounded-full cursor-pointer"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/x79v-i-BYCtEmDmZ3L0vrN6ShEDrZ6A1JRYGH4HLVOQ.jpg"
              width="40"
              onClick={toggleDropdown} // Gọi hàm toggle khi nhấn vào avatar
            />
            <span className="ml-2">{user?.name}</span>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2" // Thêm flex và gap
                >
                  <FaUser className="text-gray-500" /> {/* Icon */}
                  <span>Thông tin</span> {/* Tên */}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2" // Thêm flex và gap
                >
                  <MdLogout className="text-red-500" /> {/* Icon */}
                  <span className='text-red-500 cursor-pointer'>Đăng xuất</span> {/* Tên */}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;