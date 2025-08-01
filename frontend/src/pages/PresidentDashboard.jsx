import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

// Register additional chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PresidentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingMember, setProcessingMember] = useState(null);
  const [processingLoan, setProcessingLoan] = useState(null);
  const navigate = useNavigate();
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/president/api/logout`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/president/dashboard`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAction = async (memberId, action) => {
    setProcessingMember(memberId);
    try {
      await axios.post(
        `${BASE_URL}/president/${action}-member/${memberId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Member ${action}d successfully`);
      fetchDashboard();
    } catch (err) {
      toast.error(`Failed to ${action} member`);
    } finally {
      setProcessingMember(null);
    }
  };

  const handleLoanAction = async (loanId, action) => {
    setProcessingLoan(loanId);
    try {
      await axios.post(
        `${BASE_URL}/president/${action}-loan/${loanId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Loan ${action}d successfully`);
      fetchDashboard();
    } catch (err) {
      toast.error(`Failed to ${action} loan`);
    } finally {
      setProcessingLoan(null);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-[#2c5e1a] text-xl">
          <i className="ph ph-spinner text-4xl animate-spin mb-2"></i>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600 text-xl">
          <i className="ph ph-warning-circle text-4xl mb-2"></i>
          <p>Failed to load dashboard.</p>
        </div>
      </div>
    );

  const {
    totalMembers,
    totalSavings,
    activeLoans,
    loanData,
    memberSavings,
    pendingLoans,
    pendingMembers,
  } = data;

  // Enhanced loan chart data with better options
  const loanChartData = {
    labels: ["Approved", "Rejected", "Pending", "Repaid"],
    datasets: [
      {
        data: [
          loanData.Approved || 0,
          loanData.Rejected || 0,
          loanData.Pending || 0,
          loanData.Repaid || 0,
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107", "#2196F3"],
        borderColor: ["#388E3C", "#D32F2F", "#FFA000", "#1976D2"],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Enhanced savings chart data as a bar chart for better comparison
  const savingsChartData = {
    labels: memberSavings.names,
    datasets: [
      {
        label: 'Savings Amount (₹)',
        data: memberSavings.amounts,
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart options for better presentation
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹ ${context.raw.toLocaleString()}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Member Savings Comparison',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-[#f8f5ee] min-h-screen">
      {/* Header */}
      <header className="bg-[#2c5e1a] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-5">
          <div className="flex items-center text-2xl font-semibold">
            <i className="ph ph-hand-coins text-[#f9a825] text-4xl"></i>
            <span className="ml-3">E-BachatGat</span>
          </div>
          <nav className="flex space-x-6">
            <Link
              className="hover:text-[#f9a825] text-lg font-medium transition-colors"
              to="/president/getprofile"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-[#f9a825] text-lg font-medium transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2c5e1a]">President Dashboard</h2>
          <div className="w-24 h-1 bg-[#f9a825] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-[#2c5e1a] to-[#4c8c2a] text-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <i className="ph ph-users"></i> Total Members
            </h2>
            <p className="text-4xl font-bold mt-2">{totalMembers}</p>
          </div>
          <div className="bg-gradient-to-r from-[#f9a825] to-[#ffc107] text-[#2c5e1a] rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <i className="ph ph-currency-circle-dollar"></i> Total Savings
            </h2>
            <p className="text-4xl font-bold mt-2">₹ {totalSavings.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-[#d32f2f] to-[#f44336] text-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <i className="ph ph-handshake"></i> Active Loans
            </h2>
            <p className="text-4xl font-bold mt-2">{activeLoans}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#f9a825]/20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-[#2c5e1a] flex items-center gap-2 mb-4">
              <i className="ph ph-chart-pie-slice text-[#f9a825]"></i> Loan Status Distribution
            </h2>
            {loanChartData.datasets[0].data.every((val) => val === 0) ? (
              <div className="flex flex-col items-center justify-center h-64">
                <i className="ph ph-chart-pie-slice text-5xl text-[#2c5e1a]/50 mb-3"></i>
                <p className="text-[#2c5e1a]/70">No loan data available</p>
              </div>
            ) : (
              <div className="h-64">
                <Doughnut data={loanChartData} options={doughnutOptions} />
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#f9a825]/20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-[#2c5e1a] flex items-center gap-2 mb-4">
              <i className="ph ph-chart-bar text-[#f9a825]"></i> Member Savings Comparison
            </h2>
            {savingsChartData.datasets[0].data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <i className="ph ph-chart-bar text-5xl text-[#2c5e1a]/50 mb-3"></i>
                <p className="text-[#2c5e1a]/70">No savings data available</p>
              </div>
            ) : (
              <div className="h-64">
                <Bar data={savingsChartData} options={barOptions} />
              </div>
            )}
          </div>
        </div>

        {/* Pending Member Approvals */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-[#f9a825]/20 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-[#2c5e1a] flex items-center gap-2 mb-4">
            <i className="ph ph-user-circle-plus text-[#f9a825]"></i> Pending Member Approvals
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2c5e1a] text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers?.length > 0 ? (
                  pendingMembers.map((member) => (
                    <tr key={member._id} className="border-b border-[#f9a825]/10 hover:bg-[#f8f5ee]/50 transition-colors">
                      <td className="p-3 text-[#2c5e1a]">{member.name}</td>
                      <td className="p-3 text-[#2c5e1a]">{member.email}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleMemberAction(member._id, "approve")}
                            disabled={processingMember === member._id}
                            className={`bg-[#2c5e1a] hover:bg-[#1e4a12] text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1 min-w-[120px] justify-center ${
                              processingMember === member._id ? "opacity-75" : ""
                            }`}
                          >
                            {processingMember === member._id ? (
                              <>
                                <i className="ph ph-spinner animate-spin"></i> Processing...
                              </>
                            ) : (
                              <>
                                <i className="ph ph-check"></i> Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleMemberAction(member._id, "reject")}
                            disabled={processingMember === member._id}
                            className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1 min-w-[120px] justify-center ${
                              processingMember === member._id ? "opacity-75" : ""
                            }`}
                          >
                            {processingMember === member._id ? (
                              <>
                                <i className="ph ph-spinner animate-spin"></i> Processing...
                              </>
                            ) : (
                              <>
                                <i className="ph ph-x"></i> Reject
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-[#2c5e1a]/70 p-4">
                      <i className="ph ph-check-circle text-2xl mb-2"></i>
                      <p>No pending member requests.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Loan Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-[#f9a825]/20 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-[#2c5e1a] flex items-center gap-2 mb-4">
            <i className="ph ph-handshake text-[#f9a825]"></i> Pending Loan Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2c5e1a] text-white">
                  <th className="p-3 text-left">Member Name</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Interest Rate</th>
                  <th className="p-3 text-center">Actions</th>
                  <th className="p-3 text-center">View Details</th>
                </tr>
              </thead>
              <tbody>
                {pendingLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-[#2c5e1a]/70 p-4">
                      <i className="ph ph-check-circle text-2xl mb-2"></i>
                      <p>No pending loan requests.</p>
                    </td>
                  </tr>
                ) : (
                  pendingLoans.map((loan) => (
                    <tr key={loan._id} className="border-b border-[#f9a825]/10 hover:bg-[#f8f5ee]/50 transition-colors">
                      <td className="p-3 text-[#2c5e1a]">{loan.memberId.name}</td>
                      <td className="p-3 text-[#2c5e1a]">₹ {loan.amount.toLocaleString()}</td>
                      <td className="p-3 text-[#2c5e1a]">{loan.interestRate}%</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleLoanAction(loan._id, "approve")}
                            disabled={processingLoan === loan._id}
                            className={`bg-[#2c5e1a] hover:bg-[#1e4a12] text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1 min-w-[120px] justify-center ${
                              processingLoan === loan._id ? "opacity-75" : ""
                            }`}
                          >
                            {processingLoan === loan._id ? (
                              <>
                                <i className="ph ph-spinner animate-spin"></i> Processing...
                              </>
                            ) : (
                              <>
                                <i className="ph ph-check"></i> Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleLoanAction(loan._id, "reject")}
                            disabled={processingLoan === loan._id}
                            className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1 min-w-[120px] justify-center ${
                              processingLoan === loan._id ? "opacity-75" : ""
                            }`}
                          >
                            {processingLoan === loan._id ? (
                              <>
                                <i className="ph ph-spinner animate-spin"></i> Processing...
                              </>
                            ) : (
                              <>
                                <i className="ph ph-x"></i> Reject
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => navigate(`/president/loan-details/${loan._id}`)}
                          className="bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] px-4 py-2 rounded-lg transition-all flex items-center gap-1 mx-auto min-w-[120px] justify-center"
                        >
                          <i className="ph ph-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;