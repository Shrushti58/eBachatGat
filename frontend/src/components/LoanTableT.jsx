import React from 'react';

const LoanTableT = ({ allLoans, loanPenalty }) => {
  if (!allLoans || allLoans.length === 0) {
    return <p className="text-[#2c5e1a]/70 text-center py-6">No loan records available.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[#2c5e1a] mb-4 pb-2 border-b border-[#2c5e1a]/20">
        Loan Records
      </h3>
      
      <div className="overflow-x-auto bg-white rounded-lg border border-[#f9a825]/20 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f8f5ee] text-[#2c5e1a]">
              <th className="p-3 border-b border-[#2c5e1a]/20 text-left">Member</th>
              <th className="p-3 border-b border-[#2c5e1a]/20 text-center">Loan Amount</th>
              <th className="p-3 border-b border-[#2c5e1a]/20 text-center">Interest Rate</th>
              <th className="p-3 border-b border-[#2c5e1a]/20 text-center">Remaining Balance</th>
              <th className="p-3 border-b border-[#2c5e1a]/20 text-center">Status</th>
              <th className="p-3 border-b border-[#2c5e1a]/20 text-center">Repayment Status</th>
            </tr>
          </thead>
          <tbody>
            {allLoans.map((loan) => {
              const isLate = loan.remainingBalance > 0 && loanPenalty > 0;
              return (
                <tr key={loan._id} className="hover:bg-[#f8f5ee]/50 transition duration-150">
                  <td className="p-3 border-b border-[#2c5e1a]/10">{loan.memberId.name}</td>
                  <td className="p-3 border-b border-[#2c5e1a]/10 text-center font-medium text-[#2c5e1a]">
                    ₹ {loan.amount}
                  </td>
                  <td className="p-3 border-b border-[#2c5e1a]/10 text-center text-[#2c5e1a]">
                    {loan.interestRate}%
                  </td>
                  <td className={`p-3 border-b border-[#2c5e1a]/10 text-center font-semibold ${
                    loan.remainingBalance > 0 ? "text-[#e2725b]" : "text-[#4c8c2a]"
                  }`}>
                    ₹ {loan.remainingBalance}
                  </td>
                  <td className="p-3 border-b border-[#2c5e1a]/10 text-center">
                    <span className={`px-2 py-1 rounded-md text-sm ${
                      loan.status === "Repaid" ? "bg-[#4c8c2a]/20 text-[#4c8c2a]" :
                      loan.status === "Approved" ? "bg-[#2c5e1a]/20 text-[#2c5e1a]" :
                      loan.status === "Rejected" ? "bg-[#e2725b]/20 text-[#e2725b]" : 
                      "bg-gray-200 text-gray-700"
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="p-3 border-b border-[#2c5e1a]/10 text-center">
                    {loan.remainingBalance === 0 ? (
                      <span className="bg-[#4c8c2a]/20 text-[#4c8c2a] px-2 py-1 rounded-md text-sm">
                        Fully Paid
                      </span>
                    ) : isLate ? (
                      <span className="bg-[#f9a825]/20 text-[#f9a825] px-2 py-1 rounded-md text-sm">
                        Late Payments
                      </span>
                    ) : (
                      <span className="bg-[#2c5e1a]/20 text-[#2c5e1a] px-2 py-1 rounded-md text-sm">
                        Ongoing
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanTableT;