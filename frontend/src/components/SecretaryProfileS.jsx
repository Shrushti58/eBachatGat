import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { CurrencyCircleDollar, ChartBar, Calendar, PencilSimple, FloppyDisk, X } from 'phosphor-react';

const SecretaryProfileS = () => {
  const [data, setData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    address: '', contact: '', profilePhoto: null,
  });
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/secretary/getprofile`, {
        withCredentials: true,
      });
      setData(res.data);
      setFormData(prev => ({
        ...prev,
        name: res.data.secretary.name || '',
        email: res.data.secretary.email || '',
        address: res.data.secretary.address || '',
        contact: res.data.secretary.contact || '',
      }));
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      await axios.post(`${BASE_URL}/secretary/update-profile`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success("Profile updated successfully!");
      await fetchProfile();
      setEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!data) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  const { secretary, collections, totalCollected, totalPending, upcomingMeetings } = data;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Sticky Navigation */}
      <nav className="bg-gradient-to-r from-[#2c5e1a] to-[#3a7d2e] p-4 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold flex gap-2 items-center">
            <CurrencyCircleDollar size={20} className="text-[#f9a825]" />
            Secretary Profile
          </h1>
          <Link 
            to="/secretary/dashboard" 
            className="bg-gradient-to-r from-[#f9a825] to-[#f8b133] hover:from-[#f8b133] hover:to-[#f9a825] text-[#2c5e1a] font-medium px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md text-sm sm:text-base"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 pb-40 relative z-10">
        {/* Profile and Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-[#2c5e1a]/20 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#f9a825]/20">
              <img 
                src={secretary.image || '/images/default-avatar.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2c5e1a]">Welcome, {secretary.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                <strong>Email:</strong> {secretary.email}
              </p>
              <button 
                onClick={() => setEditOpen(true)} 
                className="mt-3 sm:mt-4 bg-gradient-to-r from-[#f9a825] to-[#f8b133] hover:from-[#f8b133] hover:to-[#f9a825] text-[#2c5e1a] font-medium px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md flex items-center gap-2 mx-auto sm:mx-0 text-sm sm:text-base"
              >
                <PencilSimple size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-[#2c5e1a]/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <ChartBar size={20} className="text-[#2c5e1a]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#2c5e1a]">Collection Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#4c8c2a]/10 p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm sm:text-lg text-[#2c5e1a]">Total Savings</h3>
                <p className="text-xl sm:text-2xl font-bold">₹{totalCollected}</p>
              </div>
              <div className="bg-[#f9a825]/10 p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm sm:text-lg text-[#2c5e1a]">Pending</h3>
                <p className="text-xl sm:text-2xl font-bold">₹{totalPending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#2c5e1a]">Edit Profile</h2>
                <button 
                  onClick={() => setEditOpen(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {['name', 'email', 'password', 'address', 'contact'].map(field => (
                  <div key={field} className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize mb-1">{field}</label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9a825] focus:border-[#f9a825]"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <input 
                    type="file" 
                    name="profilePhoto" 
                    onChange={handleChange} 
                    className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-lg" 
                  />
                </div>
                <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button 
                    type="button" 
                    onClick={() => setEditOpen(false)} 
                    className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${isUpdating ? 'bg-gray-400' : 'bg-gradient-to-r from-[#2c5e1a] to-[#3a7d2e] hover:from-[#3a7d2e] hover:to-[#2c5e1a]'}`}
                  >
                    <FloppyDisk size={16} />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collection History */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-[#2c5e1a]/20 mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <ChartBar size={20} className="text-[#2c5e1a]" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#2c5e1a]">Collection History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#2c5e1a] text-white">
                <tr>
                  <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Month</th>
                  <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Year</th>
                  <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {collections.length > 0 ? collections.map((col, i) => (
                  <tr key={i} className="border-b border-[#2c5e1a]/10 hover:bg-[#f8f5ee]/50">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{col.monthName}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{col.year}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">₹{col.amount.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 p-3 sm:p-4 text-sm sm:text-base">
                      No collections recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-[#2c5e1a]/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calendar size={20} className="text-[#2c5e1a]" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#2c5e1a]">Upcoming Meetings</h3>
          </div>
          {upcomingMeetings.length === 0 ? (
            <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">
              No upcoming meetings.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#2c5e1a] text-white">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Title</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Date</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Time</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Agenda</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMeetings.map((meeting, idx) => (
                    <tr key={idx} className="border-b border-[#2c5e1a]/10 hover:bg-[#f8f5ee]/50">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{meeting.title}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{new Date(meeting.date).toDateString()}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{meeting.time}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{meeting.agenda || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-0 h-40 sm:h-64">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="#2c5e1a" fillOpacity="0.1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default SecretaryProfileS;