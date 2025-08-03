import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';



import HeaderT from "../components/Headerte";
import OverviewCardsT from "../components/OverviewCardsT";
import ContributionFormT from "../components/ContributionFormT";
import ContributionTableT from "../components/ContributionTableT";
import LoanRepaymentFormT from "../components/LoanRepaymentFormT";
import LoanTableT from "../components/LoanTableT";

const TreasurerDashboardT = () => {
  const [members, setMembers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [setting, setSetting] = useState(null);
  const [totalFunds, setTotalFunds] = useState(0);
  const [totalGroupSavings, setTotalGroupSavings] = useState(0);
  const [calculatedPenalty, setCalculatedPenalty] = useState(0);
  const [loanPenalty, setLoanPenalty] = useState(0);
  const [activeLoans, setActiveLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [loanRepaymentsThisMonth, setLoanRepaymentsThisMonth] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
 const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const refreshDashboardData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/treasurer/dashboard`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        setMembers(data.members);
        setCollections(data.collections);
        setSetting(data.setting);
        setTotalFunds(data.totalFunds);
        setTotalGroupSavings(data.totalGroupSavings);
        setCalculatedPenalty(data.calculatedPenalty);
        setLoanPenalty(data.loanPenalty);
        setActiveLoans(data.activeLoans);
        setAllLoans(data.allLoans);
        setLoanRepaymentsThisMonth(data.loanRepaymentsThisMonth);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  return (
    <div className="bg-[#f8f5ee] min-h-screen">
      {/* Header */}
      <HeaderT />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2c5e1a]">Treasurer Dashboard</h2>
          <div className="w-24 h-1 bg-[#f9a825] mx-auto mt-2 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center text-[#2c5e1a] text-lg font-medium py-20">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="mb-10">
              <OverviewCardsT
                totalGroupSavings={totalGroupSavings}
                totalFunds={totalFunds}
                members={members}
              />
            </div>

            {/* Contribution Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-[#f9a825]/20">
              <ContributionFormT
                members={members}
                collections={collections}
                setting={setting}
                calculatedPenalty={calculatedPenalty}
                setCollections={setCollections}
                setTotalFunds={setTotalFunds}
                setTotalGroupSavings={setTotalGroupSavings}
              />
              <ContributionTableT
                collections={collections}
                setCollections={setCollections}
                setTotalGroupSavings={setTotalGroupSavings}
                setTotalFunds={setTotalFunds}
              />
            </div>

            {/* Loan Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-[#f9a825]/20">
              <LoanRepaymentFormT
                activeLoans={activeLoans}
                setting={setting}
                refreshData={refreshDashboardData}
              />
              <LoanTableT
                allLoans={allLoans}
                loanPenalty={loanPenalty}
                refreshData={refreshDashboardData}
              />
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default TreasurerDashboardT;