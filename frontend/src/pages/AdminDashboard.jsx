import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MemberCard from '../components/MemberCard';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Users, MagnifyingGlass } from 'phosphor-react';

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
 const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/api/members`, {
        withCredentials: true,
      });
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
      toast.error('Failed to load members');
    }
  };

  const handleRoleUpdate = async (message) => {
    toast.success(message);
    await fetchMembers();
  };

  const handleMemberDelete = async (message) => {
    toast.success(message);
    await fetchMembers();
  };

  // Role counts
  const roleCounts = members.reduce(
    (acc, member) => {
      acc.total += 1;
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roles = ['All', 'President', 'Secretary', 'Treasurer', 'Member'];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar userType="admin" />

      <div className="max-w-7xl mx-auto px-4 py-10 pb-24">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-3">
            <Users size={32} className="text-[#2c5e1a]" />
            <h2 className="text-3xl font-bold text-[#2c5e1a]">Members of E-Bachat Gat</h2>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            "आपला बचत गट: सदस्यांची माहिती आणि त्यांच्या योगदानाचा आढावा"
          </p>
          <div className="w-24 h-1 bg-[#f9a825] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
         

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name/email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#2c5e1a]/30 rounded-xl focus:ring-2 focus:ring-[#f9a825] outline-none w-full"
            />
           
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                onRoleUpdate={handleRoleUpdate}
                onMemberDelete={handleMemberDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white p-6 rounded-xl shadow-md border border-[#2c5e1a]/20 max-w-md mx-auto">
                <p className="text-gray-500 text-lg">No members found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom SVG */}
      <div className="absolute bottom-0 left-0 right-0 z-0 h-40">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill="#2c5e1a"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default AdminDashboard;
