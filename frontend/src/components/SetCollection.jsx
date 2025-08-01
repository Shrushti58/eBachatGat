import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CurrencyCircleDollar, Calendar, WarningCircle, Percent, FloppyDisk, Spinner } from '@phosphor-icons/react';
import 'react-toastify/dist/ReactToastify.css';

export default function SetCollection() {
  const [settings, setSettings] = useState({
    monthlyContributionAmount: '',
    dueDate: '',
    penaltyAmount: '',
    loanInterestRate: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch current settings on mount
  useEffect(() => {
    axios.get(`${BASE_URL}/admin/settings`, { withCredentials: true })
      .then((response) => {
        if (response.data?.setting) {
          setSettings(response.data.setting);
        }
      })
      .catch((err) => {
        toast.error('Failed to fetch settings.', {
          position: 'top-center',
          className: 'bg-red-600 text-white font-medium shadow',
        });
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const validateForm = () => {
    if (!settings.monthlyContributionAmount || settings.monthlyContributionAmount <= 0) {
      toast.error('Monthly Contribution Amount must be greater than 0.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
      return false;
    }
    if (!settings.dueDate || settings.dueDate < 1 || settings.dueDate > 31) {
      toast.error('Due Date must be between 1 and 31.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
      return false;
    }
    if (settings.penaltyAmount < 0) {
      toast.error('Penalty Amount must be 0 or greater.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
      return false;
    }
    if (settings.loanInterestRate < 0) {
      toast.error('Loan Interest Rate must be 0 or greater.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/admin/settings/update`,
        settings,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Settings updated successfully!', {
          position: 'top-center',
          autoClose: 1500,
          className: 'bg-[#2c5e1a] text-white font-medium shadow',
          progressClassName: 'bg-[#f9a825]',
          onClose: () => navigate('/admin/dashboard'),
        });
      } else {
        toast.error(res.data.message || 'Something went wrong!', {
          position: 'top-center',
          className: 'bg-red-600 text-white font-medium shadow',
        });
      }
    } catch (error) {
      toast.error('Failed to update settings.', {
        position: 'top-center',
        className: 'bg-red-600 text-white font-medium shadow',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f5ee] min-h-screen p-6 relative overflow-hidden">
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

      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-[#f9a825]/30 relative z-10">
        <h2 className="text-2xl font-bold text-[#2c5e1a] mb-6 flex items-center gap-2">
          <CurrencyCircleDollar size={28} className="text-[#f9a825]" />
          Collection Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Contribution */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution Amount</label>
            <div className="relative">
              <input
                type="number"
                name="monthlyContributionAmount"
                value={settings.monthlyContributionAmount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
              />
              <span className="absolute top-3 left-3 text-[#4c8c2a]">
                <CurrencyCircleDollar size={20} />
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Day of Month)</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="31"
                name="dueDate"
                value={settings.dueDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
              />
              <span className="absolute top-3 left-3 text-[#4c8c2a]">
                <Calendar size={20} />
              </span>
            </div>
          </div>

          {/* Penalty Amount */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount</label>
            <div className="relative">
              <input
                type="number"
                name="penaltyAmount"
                value={settings.penaltyAmount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
              />
              <span className="absolute top-3 left-3 text-[#4c8c2a]">
                <WarningCircle size={20} />
              </span>
            </div>
          </div>

          {/* Loan Interest Rate */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Interest Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                name="loanInterestRate"
                value={settings.loanInterestRate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
              />
              <span className="absolute top-3 left-3 text-[#4c8c2a]">
                <Percent size={20} />
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Spinner size={20} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FloppyDisk size={20} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}