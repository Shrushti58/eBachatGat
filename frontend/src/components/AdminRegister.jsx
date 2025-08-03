import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { LockSimple, EnvelopeSimple, UserPlus } from "@phosphor-icons/react";
import "react-toastify/dist/ReactToastify.css";

export default function AdminRegister() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/admin/register`, form);

      if (res.status === 201) {
        toast.success("Admin registered successfully!", {
          position: "top-center",
          autoClose: 2000,
          className: "bg-[#2c5e1a] text-white font-medium shadow",
          progressClassName: "bg-[#f9a825]",
          onClose: () => navigate("/admin/login"),
        });
        setForm({ email: "", password: "" });
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        let message = data.message || "Unknown error occurred.";
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          className: "bg-red-600 text-white font-medium shadow",
        });
      } else {
        toast.error("Network error. Please check your connection.", {
          position: "top-center",
          autoClose: 3000,
          className: "bg-red-600 text-white font-medium shadow",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen relative overflow-hidden px-4 sm:px-6">
      {/* Background Wave */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#2c5e1a"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-[#f9a825]/10 blur-xl hidden sm:block"></div>
      <div className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-[#2c5e1a]/10 blur-lg hidden sm:block"></div>

      <ToastContainer />

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-[#f9a825]/30 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9a825]/10 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f9a825"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c5e1a]">
            Admin Registration
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Secure the Bachat Gat portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300 text-sm sm:text-base"
            />
            <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#4c8c2a]">
              <EnvelopeSimple size={20} />
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-[#2c5e1a]/30 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300 text-sm sm:text-base"
            />
            <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#4c8c2a]">
              <LockSimple size={20} />
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 sm:py-3 px-4 bg-[#f9a825] hover:bg-[#e6951d] text-[#2c5e1a] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            } text-sm sm:text-base`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#2c5e1a]"
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
                Registering...
              </>
            ) : (
              <>
                <UserPlus size={18} className="mr-2" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/admin/login"
            className="text-[#2c5e1a] font-semibold hover:text-[#f9a825] transition-colors duration-300"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}