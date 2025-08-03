import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Users, Bank, SignOut, UserCircle, Gear, Pencil } from 'phosphor-react';

const Navbar = ({ userType = 'member' }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${userType}/api/logout`, {
        withCredentials: true,
      });

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/', {
          state: {
            alert: {
              message: response.data.message,
              type: 'success',
            },
          },
        });
      }, 500);
    } catch (error) {
      toast.error('Logout failed. Try again.', {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const getTitle = () => {
    const titles = {
      admin: 'Admin Dashboard',
      secretary: 'Secretary Dashboard',
      member: 'Member Dashboard'
    };
    return titles[userType] || 'Dashboard';
  };

  const userLinks = {
    admin: [
      { to: "/admin/updateprofile", icon: <Pencil size={18} />, text: "Edit Profile" },
      { to: "/admin/settings", icon: <Gear size={18} />, text: "Settings" }
    ],
    secretary: [
      { to: "/secretary/getprofile", icon: <UserCircle size={18} />, text: "Profile" }
    ],
    member: [
      { 
        to: "/loan/request-loan", 
        icon: <Bank size={18} />, 
        text: "Request Loan",
        isButton: true
      }
    ]
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#2c5e1a] to-[#3a7d2e] p-4 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Users size={28} className="text-[#f9a825]" />
            <h1 className="text-2xl font-bold">
              <span className="text-[#f9a825]">e-</span>Bachat Gat | {getTitle()}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userLinks[userType]?.map((link, index) => (
              link.isButton ? (
                <Link
                  key={index}
                  to={link.to}
                  className="flex items-center bg-gradient-to-r from-[#f9a825] to-[#f8b133] hover:from-[#f8b133] hover:to-[#f9a825] text-[#2c5e1a] font-medium py-2 px-4 rounded-lg shadow-md transition-all hover:scale-[1.03]"
                >
                  {link.icon}
                  <span className="ml-2">{link.text}</span>
                </Link>
              ) : (
                <Link
                  key={index}
                  to={link.to}
                  className="flex items-center font-medium hover:text-[#f9a825] transition-colors"
                >
                  {link.icon}
                  <span className="ml-2">{link.text}</span>
                </Link>
              )
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center bg-gradient-to-r from-[#e2725b] to-[#e34a30] hover:from-[#e34a30] hover:to-[#e2725b] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all hover:scale-[1.03]"
            >
              <SignOut size={18} />
              <span className="ml-2">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-[#3a7d2e] shadow-lg pb-2 space-y-2">
            {userLinks[userType]?.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`block px-4 py-3 ${link.isButton ? 
                  'bg-gradient-to-r from-[#f9a825] to-[#f8b133] text-[#2c5e1a]' : 
                  'hover:bg-[#2c5e1a]/80 text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-2">{link.text}</span>
                </div>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-gradient-to-r from-[#e2725b] to-[#e34a30] text-white flex items-center"
            >
              <SignOut size={18} />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;