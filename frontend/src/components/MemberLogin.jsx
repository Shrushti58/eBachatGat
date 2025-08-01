import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


axios.defaults.withCredentials = true;

const MemberLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
 const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, { email, password });

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          onClose: () => {
  navigate(response.data.redirectUrl);
}

        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* SVG Wave Background */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill="#2c5e1a" 
            fillOpacity="0.1" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#f9a825]/30 relative z-10">
        <div className="text-center mb-8">
          <i className="ph ph-hand-coins text-[#f9a825] text-5xl mb-4"></i>
          <h2 className="text-3xl font-bold text-[#2c5e1a]">Member Login</h2>
          <p className="text-gray-600 mt-2">Access your savings account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Email</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </>
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-6">
            <p>Not registered yet?{' '}
              <Link 
                to="/member/register" 
                className="text-[#2c5e1a] font-semibold hover:text-[#f9a825] transition-colors duration-300"
              >
                Create an account
              </Link>
            </p>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberLogin;