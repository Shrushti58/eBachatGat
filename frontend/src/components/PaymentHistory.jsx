import React from 'react';
import { FaRegCreditCard } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentHistory = ({ collections }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#2c5e1a] mb-4 pb-2 border-b border-[#2c5e1a]/20">
        <FaRegCreditCard className="inline mr-2" />
        Your Payment History
      </h3>

      <div className="overflow-x-auto bg-white rounded-lg border border-[#f9a825]/20 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f8f5ee] text-[#2c5e1a]">
              <th className="p-3 border-b border-[#2c5e1a]/20">Month</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Year</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Amount</th>
              <th className="p-3 border-b border-[#2c5e1a]/20">Status</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr 
                key={`${col.month}-${col.year}`} 
                className="hover:bg-[#f8f5ee]/50 transition duration-150"
              >
                <td className="p-3 border-b border-[#2c5e1a]/10 text-[#2c5e1a]">
                  {col.month}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-[#2c5e1a]">
                  {col.year}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center font-semibold text-[#4c8c2a]">
                  ₹{col.amount}
                </td>
                <td className="p-3 border-b border-[#2c5e1a]/10 text-center">
                  {col.status === "Paid" ? (
                    <span className="bg-[#4c8c2a]/20 text-[#4c8c2a] px-3 py-1 rounded-md text-sm">
                      Paid
                    </span>
                  ) : col.status === "Pending" ? (
                    <span className="bg-[#e2725b]/20 text-[#e2725b] px-3 py-1 rounded-md text-sm">
                      Pending
                    </span>
                  ) : (
                    <span className="bg-[#e2725b]/20 text-[#e2725b] px-3 py-1 rounded-md text-sm">
                      Late
                    </span>
                  )}
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

export default PaymentHistory;