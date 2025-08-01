import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoanRepaymentFormT = ({ activeLoans, setting, refreshData }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [minAmount, setMinAmount] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleLoanChange = (e) => {
    const loanId = e.target.value;
    const loan = activeLoans.find((l) => l._id === loanId);
    if (!loan) return;

    const nextInstallment = loan.repaymentSchedule.find(
      (i) => i.status === "Pending" || i.status === "Late"
    );

    if (!nextInstallment) {
      setMinAmount(0);
      setPenalty(0);
      setAmount(0);
      setSelectedLoan(null);
      toast.warning("All installments are already paid for this loan.");
      return;
    }

    const dueDate = new Date(nextInstallment.dueDate);
    const today = new Date();
    const lateDays =
      dueDate < today
        ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        : 0;

    const penaltyAmount = Math.round(
      lateDays * (setting?.penaltyAmount || 0)
    );
    const amountDue = Math.round(nextInstallment.amountDue || 0);

    const totalMinPayable = amountDue + penaltyAmount;

    setMinAmount(totalMinPayable);
    setAmount(totalMinPayable);
    setPenalty(penaltyAmount);
    setMemberId(loan.memberId._id);
    setSelectedLoan(loan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLoan) return toast.error("Please select a loan first.");
    if (amount < minAmount)
      return toast.warning(`Minimum repayment amount is ₹${minAmount}`);

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/treasurer/api/collect-loan-repayment`,
        {
          memberId,
          loanId: selectedLoan._id,
          loanRepayment: amount,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      // Reset state
      setSelectedLoan(null);
      setAmount(0);
      setPenalty(0);
      setMinAmount(0);

      // ✅ Refresh all loan-related data
      if (refreshData) refreshData();
    } catch (err) {
      console.error("❌ Repayment failed:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <h3 className="text-xl font-semibold text-[#2c5e1a] mb-4 pb-2 border-b border-[#2c5e1a]/20">
        Collect Loan Repayment
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg border border-[#f9a825]/20 shadow-sm"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2c5e1a] mb-1">
            Select Loan:
          </label>
          <select
            onChange={handleLoanChange}
            className="w-full p-2 border border-[#2c5e1a]/30 rounded-md focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#4c8c2a]"
            required
          >
            <option value="">Select Loan</option>
            {activeLoans
              .filter((loan) => loan.remainingBalance > 0)
              .map((loan) => (
                <option key={loan._id} value={loan._id}>
                  {loan.memberId.name} - ₹{loan.remainingBalance}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2c5e1a] mb-1">
            Repayment Amount:
          </label>
          <input
            type="number"
            min={minAmount}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full p-2 border border-[#2c5e1a]/30 rounded-md focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#4c8c2a]"
          />
        </div>

        {penalty > 0 && (
          <div className="mb-4 p-2 bg-[#e2725b]/10 rounded-md">
            <p className="text-sm font-medium text-[#e2725b]">
              Penalty Applied: ₹{penalty}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#2c5e1a] text-white px-4 py-2 rounded-md hover:bg-[#4c8c2a] transition-colors duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Collect Repayment"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoanRepaymentFormT;