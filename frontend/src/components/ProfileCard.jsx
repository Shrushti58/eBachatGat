import React from 'react';
import { User, Mail, Home, Phone, Calendar, Award, Clock, Wallet, ChevronRight,XCircle } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const ProfileCard = ({ member, image }) => {
  // Format join date
  const formattedJoinDate = member?.joinDate 
    ? new Date(member.joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not available';

  // Status configuration
  const statusConfig = {
    Pending: { color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3 h-3" /> },
    Approved: { color: 'bg-emerald-100 text-emerald-800', icon: <Award className="w-3 h-3" /> },
    Rejected: { color: 'bg-rose-100 text-rose-800', icon: <XCircle className="w-3 h-3" /> },
    default: { color: 'bg-gray-100 text-gray-800', icon: <User className="w-3 h-3" /> }
  };

  const currentStatus = statusConfig[member?.status] || statusConfig.default;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#2c5e1a] to-[#3a7d2e] p-5 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#f9a825]/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Member Profile</h2>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.color}`}>
            {currentStatus.icon}
            {member?.status || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Profile content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile image */}
          <div className="flex-shrink-0 flex justify-center">
            <div className="relative">
              <div className="w-36 h-52 rounded-2xl bg-gradient-to-br from-[#f8f9fa] to-white p-1 shadow-lg border border-gray-100 overflow-hidden">
                {image || member?.image ? (
                  <img 
                    src={image || member.image} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#2c5e1a]/5 to-[#3a7d2e]/5 flex items-center justify-center">
                    <User className="w-14 h-14 text-[#2c5e1a]/30" />
                  </div>
                )}
              </div>
              {member?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-[#f9a825] p-1.5 rounded-full shadow-md">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Profile details */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">{member?.name || 'N/A'}</h3>
              <div className="flex items-center gap-2 text-[#f9a825] mt-1">
                <Award className="w-4 h-4" />
                <span className="font-medium capitalize">{member?.role || 'Member'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem 
                icon={<Mail className="w-5 h-5 text-[#2c5e1a]" />}
                label="Email"
                value={member?.email || 'Not provided'}
              />
              
              <DetailItem 
                icon={<Phone className="w-5 h-5 text-[#2c5e1a]" />}
                label="Contact"
                value={member?.contact || 'Not provided'}
              />

              <DetailItem 
                icon={<Home className="w-5 h-5 text-[#2c5e1a]" />}
                label="Address"
                value={member?.address || 'Not provided'}
              />

              <DetailItem 
                icon={<Calendar className="w-5 h-5 text-[#2c5e1a]" />}
                label="Join Date"
                value={formattedJoinDate}
              />

              {/* Additional details can be added here */}
            </div>

            {/* Action buttons */}
            {member?.actions && (
              <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap gap-3">
                {member.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      action.primary 
                        ? 'bg-[#2c5e1a] text-white hover:bg-[#3a7d2e]' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {action.label}
                    {action.icon && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable detail item component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);

export default ProfileCard;