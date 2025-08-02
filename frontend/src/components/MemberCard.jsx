import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, Envelope, Phone, UserCircle, UserSwitch, Trash, Check, 
  Spinner, Clock, CheckCircle, XCircle 
} from 'phosphor-react';

const MemberCard = ({ member, onRoleUpdate, onMemberDelete }) => {
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member?.role || 'member');
  const [selectedStatus, setSelectedStatus] = useState(member?.status || 'Pending');
  const [currentRole, setCurrentRole] = useState(member?.role || 'member');
  const [currentStatus, setCurrentStatus] = useState(member?.status || 'Pending');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === currentRole) return;
    
    setLoadingRole(true);
    try {
      const response = await axios.post(`${BASE_URL}/admin/assign-role`, {
        memberId: member._id,
        role: selectedRole,
      }, { withCredentials: true });

      if (response.data.success) {
        setCurrentRole(selectedRole);
        onRoleUpdate(response.data.message, selectedRole, member._id);
      }
    } catch (error) {
      console.error('Role update failed:', error);
    } finally {
      setLoadingRole(false);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (currentStatus === 'Approved') return;

    setSelectedStatus('Approved'); // approve directly
    setLoadingStatus(true);
    try {
      const response = await axios.post(`${BASE_URL}/admin/update-status`, {
        memberId: member._id,
        status: 'Approved',
      }, { withCredentials: true });

      if (response.data.success) {
        setCurrentStatus('Approved');
      }
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDeleteMember = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to remove ${member.name}?`)) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/api/members/${member._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        onMemberDelete(response.data.message, member._id);
      }
    } catch (error) {
      console.error('Member deletion failed:', error);
    }
  };

  const roleColors = {
    member: 'bg-gray-100 text-gray-800',
    president: 'bg-blue-100 text-blue-800',
    treasurer: 'bg-purple-100 text-purple-800',
    secretary: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: <Clock size={16} weight="fill" className="text-yellow-500" />,
    approved: <CheckCircle size={16} weight="fill" className="text-green-500" />,
    rejected: <XCircle size={16} weight="fill" className="text-red-500" />
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
      {/* Header with Role and Status Badges */}
      <div className="relative p-3 bg-gray-50 border-b flex justify-between items-center">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[currentRole]}`}>
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[currentStatus]}`}>
          {statusIcons[currentStatus]}
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-5">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#f9a825] bg-gray-100 flex items-center justify-center mb-4">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={40} className="text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-bold text-[#2c5e1a] text-center">{member.name}</h3>
        </div>

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Envelope size={18} className="text-[#2c5e1a] flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={18} className="text-[#2c5e1a] flex-shrink-0" />
            <span>{member.contact}</span>
          </div>
        </div>

        {/* Role Management */}
        <div className="mt-4">
          <form onSubmit={handleRoleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Role</label>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f9a825] focus:border-[#2c5e1a] text-sm"
              >
                <option value="member">Member</option>
                <option value="president">President</option>
                <option value="treasurer">Treasurer</option>
                <option value="secretary">Secretary</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loadingRole || selectedRole === currentRole}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium ${
                loadingRole || selectedRole === currentRole
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2c5e1a] text-white hover:bg-[#1e4212]'
              }`}
            >
              {loadingRole ? (
                <>
                  <Spinner size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <UserSwitch size={18} />
                  Update Role
                </>
              )}
            </button>
          </form>
        </div>

        {/* Approve Member Button */}
        {currentStatus === 'Pending' && (
          <button
            onClick={handleStatusSubmit}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium"
            disabled={loadingStatus}
          >
            {loadingStatus ? (
              <>
                <Spinner size={18} className="animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check size={18} />
                Approve Member
              </>
            )}
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDeleteMember}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
        >
          <Trash size={18} />
          Remove Member
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
