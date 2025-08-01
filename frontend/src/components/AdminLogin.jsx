import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { EnvelopeSimple, LockSimple, SignIn } from '@phosphor-icons/react';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'Login successful!', {
        position: 'top-center',
        autoClose: 1500,
        className: 'bg-[#2c5e1a] text-white font-medium shadow',
        progressClassName: 'bg-[#f9a825]',
        onClose: () => {
          navigate('/admin/dashboard', {
            state: {
              alert: {
                message: 'Login successful!',
                type: 'success',
              },
            },
          });
        },
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      toast.error(errorMsg, {
        position: 'top-center',
        autoClose: 3000,
        className: 'bg-red-600 text-white font-medium shadow',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Wave */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#2c5e1a"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <ToastContainer />

      <div className="z-10 bg-white p-8 rounded-2xl shadow-lg border border-[#f9a825]/30 max-w-md w-full">
        <div className="text-center mb-8">
          <i className="ph ph-hand-coins text-[#f9a825] text-5xl mb-4"></i>
          <h2 className="text-3xl font-bold text-[#2c5e1a]">Admin Login</h2>
          <p className="text-gray-600 mt-2">Access the Bachat Gat backend</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
            />
            <span className="absolute top-3 left-3 text-[#4c8c2a]">
              <EnvelopeSimple size={20} />
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
            />
            <span className="absolute top-3 left-3 text-[#4c8c2a]">
              <LockSimple size={20} />
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#2c5e1a]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <SignIn size={20} className="mr-2" />
                Login
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link
            to="/admin/register"
            className="text-[#2c5e1a] font-semibold hover:text-[#f9a825] transition-colors duration-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
