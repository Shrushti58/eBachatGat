import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
const ContributionTableT = ({ collections, setCollections, setTotalGroupSavings, setTotalFunds }) => {

   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleDelete = async (collectionId, memberName) => {
    const confirmDelete = window.confirm(`Delete contribution of ${memberName}?`);
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${BASE_URL}/treasurer/delete/${collectionId}`);
      toast.success(res.data.message);

      // Remove collection from UI
      setCollections(prev => prev.filter(c => c._id !== collectionId));
      
      // Update overview cards
      setTotalGroupSavings(res.data.totalGroupSavings);
      setTotalFunds(res.data.totalFunds);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete contribution");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#2c5e1a] mb-4 pb-2 border-b border-[#2c5e1a]/20">
        Contributions of {new Date().toLocaleString("default", { month: "long" })}
      </h3>

      <div className="overflow-x-auto bg-white rounded-lg border border-[#f9a825]/20 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f8f5ee] text-[#2c5e1a]">
              <th className="p-3 border-b border-[#2c5e1a]/20">Contributor</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Role</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Amount</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Penalty</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Total Paid</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Date</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Status</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr 
                key={col._id} 
                className="hover:bg-[#f8f5ee]/50 transition duration-150"
              >
                <td className="p-3 border-b border-[#2c5e1a]/10">
                  <div className="flex items-center">
                    {col.memberId.image ? (
                      <img
                        src={col.memberId.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#2c5e1a]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#2c5e1a] font-semibold">
                          {col.memberId.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-[#2c5e1a]">{col.memberId.name}</span>
                  </div>
                </td>

                <td className="p-3 border-b border-[#2c5e1a]/10 text-center text-[#2c5e1a]">
                  {col.memberId.role}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center font-semibold text-[#4c8c2a]">
                  ₹ {col.amount}
                </td>
                <td className={`p-3 border-b border-[#2c5e1a]/10 text-center font-semibold ${
                  col.penalty > 0 ? "text-[#e2725b]" : "text-[#2c5e1a]/70"
                }`}>
                  ₹ {col.penalty || 0}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center font-semibold text-[#2c5e1a]">
                  ₹ {col.amount + (col.penalty || 0)}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center text-[#2c5e1a]">
                  {col.datePaid ? new Date(col.datePaid).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center">
                  {col.status === "Pending" ? (
                    <span className="bg-[#e2725b]/20 text-[#e2725b] px-2 py-1 rounded-md text-sm">
                      Unpaid
                    </span>
                  ) : (
                    <span className="bg-[#4c8c2a]/20 text-[#4c8c2a] px-2 py-1 rounded-md text-sm">
                      Paid
                    </span>
                  )}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center">
                  <button
                    onClick={() => handleDelete(col._id, col.memberId.name)}
                    className="text-[#e2725b] hover:text-[#e2725b]/70 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ContributionTableT;