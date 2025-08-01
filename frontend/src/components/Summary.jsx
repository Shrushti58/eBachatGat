import React from 'react';
import axios from 'axios';

const Summary = ({ totalPaid, totalPending, activeLoanAmount }) => {
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handlePayNow = async (amount) => {
    try {
     
      const { data } = await axios.post(
       `${BASE_URL}/online/create-order`,
        { amount },
        { withCredentials: true } 
      );

      const { orderId, amount: orderAmount, currency, key } = data;

     
      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "Bachat Gat Payment",
        description: "Monthly Collection + Penalty",
        order_id: orderId,
        handler: async function (response) {
          try {
            // ✅ Step 3: Verify payment with backend
            await axios.post(
             `${BASE_URL}/online/verify-payment`,
              {
                amount: orderAmount / 100,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true } // ✅ send cookies again
            );

            alert("✅ Payment successful!");
            window.location.reload();
          } catch (err) {
            alert("❌ Payment verification failed.");
            console.error("Verification error:", err);
          }
        },
        prefill: {
          name: "Member",
          email: "member@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#ff9800"
        }
      };

      // ✅ Step 4: Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert("❌ Failed to initiate payment.");
      console.error("Order creation error:", err);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#2c3e50] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#f9a825]/10">
              <i className="ph ph-chart-bar text-[#f9a825] text-xl"></i>
            </div>
            <span>Financial Summary</span>
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Paid */}
          <SummaryCard
            title="Total Paid"
            icon="ph-wallet"
            color="#4caf50"
            value={totalPaid}
            footer="All completed payments"
          />

          <SummaryCard
            title="Pending Amount"
            icon="ph-clock"
            color="#ff9800"
            value={totalPending}
            footer="Outstanding payments"
            action={
              totalPending > 0 && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => handlePayNow(totalPending)}
                    className="bg-[#ff9800] text-white text-sm px-4 py-2 rounded hover:bg-[#e68900] transition-all"
                  >
                    Pay ₹{totalPending} Now
                  </button>
                </div>
              )
            }
          />

          {/* Active Loan */}
          <SummaryCard
            title="Active Loan"
            icon="ph-currency-inr"
            color="#2c5e1a"
            value={activeLoanAmount}
            footer="Current loan balance"
          />
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, icon, color, value, footer, action }) => (
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f8f9fa] to-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className={`absolute top-0 right-0 w-16 h-16`} style={{ backgroundColor: `${color}1A`, borderRadius: '9999px', marginRight: '-1rem', marginTop: '-1rem' }}></div>
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}1A` }}>
            <i className={`${icon} text-xl`} style={{ color }}></i>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        </div>
        <p className="text-3xl font-bold text-[#2c3e50]">₹{value}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100/50">
      <p className="text-sm text-gray-500 flex items-center gap-1">
        <i className="ph ph-info text-gray-400"></i>
        <span>{footer}</span>
      </p>
      {action}
    </div>
  </div>
);

export default Summary;
