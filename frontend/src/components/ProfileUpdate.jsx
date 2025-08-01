import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { EnvelopeSimple, LockSimple, UserCircleGear, Spinner } from '@phosphor-icons/react';
import 'react-toastify/dist/ReactToastify.css';

const ProfileUpdate = () => {
  const [admin, setAdmin] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch admin data when the component mounts
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/updateprofile`, {
          withCredentials: true,
        });
        setAdmin(response.data.admin);
        setEmail(response.data.admin.email);
      } catch (error) {
        toast.error("Error fetching profile data.", {
          position: 'top-center',
          className: 'bg-red-600 text-white font-medium shadow',
        });
      }
    };

    fetchAdmin();
  }, []);

  // Handle the profile update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/admin/edit-profile`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Profile updated successfully!', {
          position: 'top-center',
          autoClose: 1500,
          className: 'bg-[#2c5e1a] text-white font-medium shadow',
          progressClassName: 'bg-[#f9a825]',
          onClose: () => navigate('/admin/dashboard'),
        });
      } else {
        toast.error(response.data.message || 'Update failed', {
          position: 'top-center',
          className: 'bg-red-600 text-white font-medium shadow',
        });
      }
    } catch (error) {
      toast.error('Failed to update profile.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If admin data is still loading, show a loading message
  if (!admin) {
    return (
      <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen">
        <Spinner size={32} className="animate-spin text-[#2c5e1a]" />
      </div>
    );
  }

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
          <UserCircleGear size={48} className="mx-auto text-[#f9a825] mb-4" />
          <h2 className="text-3xl font-bold text-[#2c5e1a]">Update Profile</h2>
          <p className="text-gray-600 mt-2">Manage your admin account details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              id="email"
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
              id="password"
              placeholder="Password (leave blank to keep current)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <Spinner size={20} className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;