import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, Loader, User, Calendar, DollarSign, Percent, Clock, FileImage } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoanDetailsP = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/president/loan-details/${id}`,
          { withCredentials: true }
        );
        setLoan(res.data.loan);
      } catch (err) {
        console.error("Error fetching loan details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#f8f5ee] to-[#e8e5de] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#f9a825]/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-[#f9a825] rounded-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <p className="text-lg font-medium text-[#2c5e1a]">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="bg-gradient-to-b from-[#f8f5ee] to-[#e8e5de] min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loan Not Found</h3>
          <p className="text-gray-600 mb-6">The requested loan details could not be loaded.</p>
          <button
            onClick={() => navigate("/president/dashboard")}
            className="bg-[#2c5e1a] text-white px-6 py-2 rounded-lg hover:bg-[#1e4a12] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const calculateRepayment = () => {
    const interest = (loan.amount * loan.interestRate) / 100;
    const total = loan.amount + interest;
    const monthly = total / loan.tenure;
    return { total, monthly };
  };

  const repayment = calculateRepayment();

  return (
    <div className="bg-gradient-to-b from-[#f8f5ee] to-[#e8e5de] min-h-screen">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Header */}
      <div className="bg-[#2c5e1a] text-white pt-12 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => navigate("/president/dashboard")}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <User className="w-4 h-4" />
                  <span>{loan.memberId?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {loan.requestedAt ? new Date(loan.requestedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[200px]">
              <div className="text-white/80 text-sm mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  loan.status === 'approved' ? 'bg-green-400' : 
                  loan.status === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="font-medium capitalize">{loan.status || 'pending'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9a825]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f9a825]/10 rounded-full blur-xl"></div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "details"
                    ? "border-[#f9a825] text-[#2c5e1a]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Details
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "documents"
                    ? "border-[#f9a825] text-[#2c5e1a]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileImage className="w-4 h-4" />
                Documents
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "details" && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Loan details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c5e1a] mb-4">Loan Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#f9a825]/10 rounded-lg text-[#f9a825]">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">₹{loan.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#f9a825]/10 rounded-lg text-[#f9a825]">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="font-medium">{loan.interestRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#f9a825]/10 rounded-lg text-[#f9a825]">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tenure</p>
                        <p className="font-medium">{loan.tenure} months</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="mt-1 text-gray-700">{loan.reason || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Repayment details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c5e1a] mb-4">Repayment Plan</h3>
                  <div className="bg-[#f9f8f5] border border-[#f9a825]/20 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Total Repayment</p>
                        <p className="text-xl font-bold text-[#2c5e1a]">₹{repayment.total.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500">Monthly</p>
                        <p className="text-xl font-bold text-[#2c5e1a]">₹{repayment.monthly.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {Array.from({ length: loan.tenure }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/80 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#f9a825] rounded-full"></div>
                            <span className="text-sm font-medium">Month {i + 1}</span>
                          </div>
                          <span className="text-sm font-medium">₹{repayment.monthly.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && loan.guarantorDocs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#2c5e1a] mb-4">Guarantor Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loan.guarantorDocs.map((doc, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <img
                        src={doc.url}
                        alt={`Guarantor Document ${index + 1}`}
                        className="w-full h-64 object-contain bg-gray-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white">
                          <p className="font-medium">Document {index + 1}</p>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white/80 hover:text-white underline mt-1 inline-block"
                          >
                            View full size
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default LoanDetailsP;