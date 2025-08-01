import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ContributionFormT = ({
  members,
  collections,
  setting,
  calculatedPenalty,
  setCollections,
  setTotalFunds,
  setTotalGroupSavings
}) => {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId) return toast.error("Please select a member");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/treasurer/collect`, { memberId });

      const { message, collection, totalFunds, totalGroupSavings } = res.data;

      toast.success(message);
      setCollections((prev) => [...prev, collection]);
      setTotalFunds(totalFunds);
      setTotalGroupSavings(totalGroupSavings);
      setMemberId("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-[#2c5e1a] mb-4 pb-2 border-b border-[#2c5e1a]/20">
        Collect Monthly Contribution
      </h3>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-[#f9a825]/20 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Select Member:</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            className="w-full p-2 border border-[#2c5e1a]/30 rounded-md focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#4c8c2a]"
          >
            <option value="">Select Member</option>
            {members.map((member) => {
              const collection = collections.find((col) => col.memberId._id === member._id);
              const status = collection?.status || "Pending";
              return (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.role} ({status})
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Amount:</label>
          <input
            type="number"
            value={setting?.monthlyContributionAmount || 0}
            readOnly
            className="w-full p-2 border border-[#2c5e1a]/30 rounded-md bg-[#f8f5ee]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Penalty Amount:</label>
          <input
            type="number"
            value={calculatedPenalty || 0}
            readOnly
            className="w-full p-2 border border-[#2c5e1a]/30 rounded-md bg-[#f8f5ee]"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-[#2c5e1a] text-white px-4 py-2 rounded-md hover:bg-[#4c8c2a] transition-colors duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Collecting...
            </span>
          ) : (
            "Collect Contribution"
          )}
        </button>
      </form>
    </div>
  );
};

export default ContributionFormT;