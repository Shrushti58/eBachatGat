import { HandCoins } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import React from 'react';
const Headerte = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/treasurer/logout`);
      toast.success(res.data.message || "Logged out successfully");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Logout failed";
      toast.error(msg);
    }
  };

  return (
    <header className="bg-[#2c5e1a] text-white sticky top-0 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4 md:p-5">
        <Link
          to="/treasurer/dashboard"
          className="flex items-center text-xl md:text-2xl font-semibold hover:scale-105 transition duration-200"
        >
          <HandCoins className="text-[#f9a825]" size={28} />
          <span className="ml-2 md:ml-3">E-BachatGat</span>
        </Link>
        <nav className="flex space-x-4 md:space-x-6">
          <Link
            to="/treasurer/records"
            className="hover:text-[#f9a825] text-sm md:text-lg font-medium transition-colors duration-300"
          >
            View all Records
          </Link>
          <Link
            to="/treasurer/getprofile"
            className="hover:text-[#f9a825] text-sm md:text-lg font-medium transition-colors duration-300"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-[#f9a825] text-sm md:text-lg font-medium bg-transparent border-none cursor-pointer transition-colors duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Headerte;