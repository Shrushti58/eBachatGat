import { Wallet, Calendar, Users } from "lucide-react";
import React from 'react';

const OverviewCardsT = ({ totalGroupSavings, totalFunds, members }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Group Savings */}
      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-[#2c5e1a]/20 shadow-sm hover:shadow-md transition-all duration-300">
        <div>
          <h3 className="text-sm font-medium text-[#2c5e1a]">Total Group Savings</h3>
          <p className="text-2xl font-semibold text-[#2c5e1a]">₹ {totalGroupSavings}</p>
        </div>
        <div className="p-3 rounded-full bg-[#2c5e1a]/10">
          <Wallet className="w-6 h-6 text-[#2c5e1a]" />
        </div>
      </div>

      {/* Current Month Savings */}
      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-[#4c8c2a]/20 shadow-sm hover:shadow-md transition-all duration-300">
        <div>
          <h3 className="text-sm font-medium text-[#4c8c2a]">Current Month Savings</h3>
          <p className="text-2xl font-semibold text-[#4c8c2a]">₹ {totalFunds}</p>
        </div>
        <div className="p-3 rounded-full bg-[#4c8c2a]/10">
          <Calendar className="w-6 h-6 text-[#4c8c2a]" />
        </div>
      </div>

      {/* Total Members */}
      <div className="flex items-center justify-between p-5 bg-white rounded-lg border border-[#f9a825]/20 shadow-sm hover:shadow-md transition-all duration-300">
        <div>
          <h3 className="text-sm font-medium text-[#f9a825]">Total Members</h3>
          <p className="text-2xl font-semibold text-[#f9a825]">{members.length}</p>
        </div>
        <div className="p-3 rounded-full bg-[#f9a825]/10">
          <Users className="w-6 h-6 text-[#f9a825]" />
        </div>
      </div>
    </div>
  );
};

export default OverviewCardsT;