import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const LoanRequest = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [adminInterestRate, setAdminInterestRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState(1);
  const [reason, setReason] = useState("");
  const [document1, setDocument1] = useState(null);
  const [document2, setDocument2] = useState(null);
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [loanError, setLoanError] = useState("");
  const [totalRepayable, setTotalRepayable] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/loan/api/request-loan`, {
          withCredentials: true,
        });
        const data = response.data;
        setMember(data.member);
        setAdminInterestRate(data.adminInterestRate);
        setIsEligible(data.eligible);
        setReasons(data.reasons || []);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load loan info.");
        setLoading(false);
      }
    };
    fetchLoanData();
  }, []);

  useEffect(() => {
    const interest = (amount * adminInterestRate) / 100;
    setTotalRepayable((amount + interest).toFixed(2));
  }, [amount, adminInterestRate]);

  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const max = (member?.totalSavings || 0) * 3;
    setAmount(val);
    setLoanError(val > max ? `Loan cannot exceed ₹${max}` : "");
  };

  const handleFileChange = (event, setFile, setPreview) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed.");
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !reason || !document1 || !document2 || loanError) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("memberId", member._id);
    formData.append("amount", amount);
    formData.append("interestRate", adminInterestRate);
    formData.append("tenure", tenure);
    formData.append("reason", reason);
    formData.append("guarantorDoc1", document1);
    formData.append("guarantorDoc2", document2);

    try {
      await axios.post(`${BASE_URL}/loan/api/loan-request`, formData, {
        withCredentials: true,
      });

      toast.success("Loan request submitted!", {
        position: "top-center",
        className: "bg-[#2c5e1a] text-white",
        progressClassName: "bg-[#f9a825]",
      });

      setTimeout(() => {
        navigate("/member/dashboard");
      }, 2000);
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="ph ph-hand-coins text-[#f9a825] text-5xl mb-4 animate-pulse"></i>
          <p className="text-lg text-[#2c5e1a]">Loading loan information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5ee] min-h-screen relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Top SVG Wave */}
      <div className="absolute top-0 left-0 w-full rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill="#2c5e1a" 
            fillOpacity="0.1" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-3xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-[#f9a825]/30">
          <div className="text-center mb-8">
            <i className="ph ph-hand-coins text-[#f9a825] text-5xl mb-4"></i>
            <h2 className="text-3xl font-bold text-[#2c5e1a]">Loan Request</h2>
            <p className="text-gray-600 mt-2">Apply for a loan from your savings group</p>
          </div>

          {!isEligible && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium text-sm">
              <p className="font-semibold">You are not eligible for a loan:</p>
              <ul className="list-disc list-inside mt-1">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
                  <input
                    type="text"
                    value={member.name}
                    disabled
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-[#2c5e1a]/30 rounded-lg shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
                  <input
                    type="text"
                    value={member.email}
                    disabled
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-[#2c5e1a]/30 rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Loan Amount (₹)</label>
              <div className="relative">
                <i className="fas fa-rupee-sign absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300 ${
                    loanError ? "border-red-500" : "border-[#2c5e1a]/30"
                  }`}
                />
              </div>
              {loanError && <p className="text-red-500 text-sm mt-1">{loanError}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Interest Rate (%)</label>
                <div className="relative">
                  <i className="fas fa-percent absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
                  <input
                    type="text"
                    value={adminInterestRate}
                    disabled
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-[#2c5e1a]/30 rounded-lg shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Tenure (Months)</label>
                <div className="relative">
                  <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]"></i>
                  <select
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((m) => (
                      <option key={m} value={m}>
                        {m} Month{m > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c5e1a] mb-1">Reason for Loan</label>
              <div className="relative">
                <i className="fas fa-comment-alt absolute left-3 top-4 text-[#4c8c2a]"></i>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full pl-10 pr-3 py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825]"
                  placeholder="Briefly explain the purpose of this loan"
                />
              </div>
            </div>

            {[{ label: "Guarantor Document 1", preview: preview1, setFile: setDocument1, setPreview: setPreview1 },
              { label: "Guarantor Document 2", preview: preview2, setFile: setDocument2, setPreview: setPreview2 }].map(
              ({ label, preview, setFile, setPreview }, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-[#2c5e1a] mb-1">{label}</label>
                  <div className="relative">
                    <i className={`fas ${idx === 0 ? "fa-id-card" : "fa-file-alt"} absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c8c2a]`}></i>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, setFile, setPreview)}
                      className="w-full pl-10 pr-3 py-2 border border-[#2c5e1a]/30 rounded-lg shadow-sm file:bg-transparent file:border-0 file:text-sm file:font-medium file:text-[#2c5e1a] hover:file:bg-[#f9a825]/10"
                    />
                  </div>
                  {preview && (
                    <a href={preview} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm text-[#2c5e1a] hover:text-[#f9a825] transition-colors duration-300">
                      <i className="fas fa-eye mr-1"></i> Preview uploaded document
                    </a>
                  )}
                </div>
              )
            )}

            <div className="bg-[#f9a825]/10 px-4 py-3 rounded-lg text-[#2c5e1a] font-medium text-center border border-[#f9a825]/30">
              <p className="text-sm">Total Repayable Amount</p>
              <p className="text-xl font-bold">₹{totalRepayable}</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isEligible || submitting}
                className={`w-full py-3 px-4 bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center ${
                  !isEligible || submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin w-5 h-5 mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Submit Loan Request
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <Link 
                to="/member/dashboard" 
                className="text-[#2c5e1a] font-semibold hover:text-[#f9a825] transition-colors duration-300"
              >
                <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill="#2c5e1a" 
            fillOpacity="0.1" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4 text-[#2c5e1a]">Confirm Loan Submission</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to submit this loan request?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={submitting}
                className="bg-[#f9a825] text-[#2c5e1a] font-semibold px-4 py-2 rounded-lg hover:bg-[#e6951d] flex items-center gap-2 transition-colors duration-300"
              >
                {submitting && <Loader className="animate-spin w-4 h-4" />}
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequest;