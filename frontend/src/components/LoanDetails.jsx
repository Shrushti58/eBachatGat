import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  CaretDown,
  CaretUp,
  CurrencyCircleDollar,
} from "phosphor-react";
import { FaRegCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import { Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

const LoanDetails = ({
  activeLoanAmount,
  totalLoanRepaid,
  totalLoanPending,
  loans,
}) => {
  const [openSchedule, setOpenSchedule] = useState({});
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const toggleSchedule = (loanId) => {
    setOpenSchedule((prevState) => ({
      ...prevState,
      [loanId]: !prevState[loanId],
    }));
  };

  const handlePayment = async (loanId, installmentIndex) => {
    try {
      // Step 1: Create Razorpay order for the specific loan installment
      const { data } = await axios.post(
        `${BASE_URL}/online/create-loan-order`,
        {
          loanId,
          installmentIndex,
        },
        { withCredentials: true }
      );

      const { orderId, amount: orderAmount, currency, key } = data;

      // Step 2: Initialize Razorpay payment
      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "Loan Repayment",
        description: `Loan Installment #${installmentIndex + 1}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment with backend
            await axios.post(
              `${BASE_URL}/online/verify-loan-payment`,
              {
                loanId,
                installmentIndex,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mode: "Online",
              },
              { withCredentials: true }
            );

            // Show success notification
            toast.success(
              <div className="flex items-center gap-2">
                .
                <CheckCircle2 className="text-green-500" />
                <span>
                  Payment successful! Receipt: {response.razorpay_payment_id}
                </span>
              </div>
            );

      
          } catch (err) {
            toast.error(
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" />
                <span>
                  Payment verification failed:{" "}
                  {err.response?.data?.error || err.message}
                </span>
              </div>
            );
            console.error("Verification error:", err);
          }
        },
        prefill: {
          name:"Member", // Use actual user data if available
          email:"member@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2c5e1a", // Matching your loan app theme
        },
      };

      // Step 4: Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        toast.error(
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500" />
            <span>Payment failed: {response.error.description}</span>
          </div>
        );
      });
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500" />
          <span>
            Payment initiation failed:{" "}
            {err.response?.data?.error || err.message}
          </span>
        </div>
      );
      console.error("Order creation error:", err);
    }
  };

  console.log("Loan list debug:", loans);
  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Modern Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2c5e1a] to-[#3a7d2e] relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f9a825]/10 rounded-full -mr-8 -mt-8 blur-lg"></div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <FaRegCreditCard className="text-[#f9a825]" size={20} />
            </div>
            <span>Your Loans</span>
          </h2>
        </div>

        {/* Modern Summary Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Active Loan Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#2c5e1a]/10 rounded-full -mr-4 -mt-4"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#2c5e1a]/10">
                    <i className="ph ph-currency-inr text-[#2c5e1a] text-xl"></i>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Active Loan
                  </h3>
                </div>
                <p className="text-3xl font-bold text-[#2c3e50]">
                  ₹{activeLoanAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Total Repaid Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#4c8c2a]/10 rounded-full -mr-4 -mt-4"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#4c8c2a]/10">
                    <i className="ph ph-wallet text-[#4c8c2a] text-xl"></i>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Repaid
                  </h3>
                </div>
                <p className="text-3xl font-bold text-[#2c3e50]">
                  ₹{totalLoanRepaid}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#e2725b]/10 rounded-full -mr-4 -mt-4"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#e2725b]/10">
                    <i className="ph ph-clock text-[#e2725b] text-xl"></i>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Pending
                  </h3>
                </div>
                <p className="text-3xl font-bold text-[#2c3e50]">
                  ₹{totalLoanPending}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Loan Table */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[#2c5e1a]">
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loans.map((loan, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        ₹{loan.loanAmount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loan.interestRate}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loan.status === "Pending" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f9a825]/10 text-[#f9a825]">
                            <Clock
                              size={14}
                              weight="duotone"
                              className="mr-1"
                            />{" "}
                            Pending
                          </span>
                        )}
                        {loan.status === "Approved" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#4c8c2a]/10 text-[#4c8c2a]">
                            <CheckCircle
                              size={14}
                              weight="duotone"
                              className="mr-1"
                            />{" "}
                            Approved
                          </span>
                        )}
                        {loan.status === "Repaid" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2c5e1a]/10 text-[#2c5e1a]">
                            <CheckCircle
                              size={14}
                              weight="duotone"
                              className="mr-1"
                            />{" "}
                            Repaid
                          </span>
                        )}
                        {loan.status === "Rejected" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#e2725b]/10 text-[#e2725b]">
                            <XCircle
                              size={14}
                              weight="duotone"
                              className="mr-1"
                            />{" "}
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Repayment Schedule */}
                    {loan.status === "Approved" &&
                      loan.repaymentSchedule.length > 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-2">
                            <div
                              className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                              onClick={() => toggleSchedule(loan._id)}
                            >
                              <div className="flex items-center gap-2 text-[#2c5e1a]">
                                <FileText
                                  size={18}
                                  weight="duotone"
                                  className="text-[#f9a825]"
                                />
                                <span className="font-medium">
                                  Repayment Schedule
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <span className="text-sm">
                                  {openSchedule[loan._id] ? "Hide" : "Show"}
                                </span>
                                {openSchedule[loan._id] ? (
                                  <CaretUp size={18} weight="bold" />
                                ) : (
                                  <CaretDown size={18} weight="bold" />
                                )}
                              </div>
                            </div>

                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                openSchedule[loan._id]
                                  ? "max-h-screen"
                                  : "max-h-0"
                              }`}
                            >
                              <div className="mt-2 rounded-lg border border-gray-100 overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gray-50 text-[#2c5e1a]">
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                        Due Date
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                        Amount Due
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                        Amount Paid
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {loan.repaymentSchedule.map(
                                      (payment, idx) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-gray-50/50"
                                        >
                                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            {new Date(
                                              payment.dueDate
                                            ).toLocaleDateString()}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                            ₹{payment.amountDue}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                                            ₹{payment.amountPaid}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {payment.status === "Pending" && (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f9a825]/10 text-[#f9a825]">
                                                <Clock
                                                  size={12}
                                                  weight="duotone"
                                                  className="mr-1"
                                                />{" "}
                                                Pending
                                              </span>
                                            )}
                                            {payment.status === "Paid" && (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4c8c2a]/10 text-[#4c8c2a]">
                                                <CheckCircle
                                                  size={12}
                                                  weight="duotone"
                                                  className="mr-1"
                                                />{" "}
                                                Paid
                                              </span>
                                            )}
                                            {payment.status === "Late" && (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e2725b]/10 text-[#e2725b]">
                                                <XCircle
                                                  size={12}
                                                  weight="duotone"
                                                  className="mr-1"
                                                />{" "}
                                                Late
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {(payment.status === "Pending" ||
                                              payment.status === "Late") && (
                                              <button
                                                onClick={() =>
                                                  handlePayment(loan._id, idx)
                                                }
                                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#2c5e1a] text-white hover:bg-[#1e3e12] transition-colors"
                                              >
                                                <CurrencyCircleDollar
                                                  size={12}
                                                  weight="duotone"
                                                  className="mr-1"
                                                />{" "}
                                                Pay Now
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
