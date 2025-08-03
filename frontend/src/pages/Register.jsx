import React, { useState } from "react";
import {
  User,
  EnvelopeSimple,
  LockSimple,
  MapPin,
  Phone,
  UserPlus,
  ShieldCheck,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contact: "",
    image: null,
    otp: "",
  });

  const [otpState, setOtpState] = useState({
    sent: false,
    verified: false,
    attempts: 0,
    resendAvailable: true,
    resendTimer: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Phone number validation - only allow numbers
    if (name === "contact") {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }
    
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    // Basic validation - at least 10 digits
    if (phone.length < 10) {
      toast.warning("Phone number must be at least 10 digits");
      return false;
    }
    return true;
  };

  // Countdown timer for resend OTP
  const startResendTimer = () => {
    setOtpState(prev => ({ ...prev, resendAvailable: false, resendTimer: 60 }));
    
    const timer = setInterval(() => {
      setOtpState(prev => {
        if (prev.resendTimer <= 1) {
          clearInterval(timer);
          return { ...prev, resendAvailable: true, resendTimer: 0 };
        }
        return { ...prev, resendTimer: prev.resendTimer - 1 };
      });
    }, 1000);
  };

  const sendOtp = async () => {
    if (!formData.email) return toast.warning("Please enter your email address");
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.warning("Please enter a valid email address");
    }

    try {
      setLoadingOtp(true);
      const res = await fetch(`${BASE_URL}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpState(prev => ({ 
          ...prev, 
          sent: true, 
          verified: false,
          attempts: 0 
        }));
        startResendTimer();
        toast.success("OTP sent to your email!");
      } else {
        toast.error(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const resendOtp = async () => {
    if (!otpState.resendAvailable) return;
    await sendOtp();
  };

  const verifyOtp = async () => {
    if (!formData.otp || formData.otp.length < 6) {
      return toast.warning("Please enter the 6-digit OTP");
    }

    try {
      setLoadingOtp(true);
      const res = await fetch(`${BASE_URL}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpState(prev => ({ ...prev, verified: true }));
        toast.success("Email verified successfully!");
      } else {
        const attempts = otpState.attempts + 1;
        setOtpState(prev => ({ ...prev, attempts }));
        
        if (attempts >= 3) {
          toast.error("Too many failed attempts. Please request a new OTP.");
          setOtpState(prev => ({ ...prev, sent: false, verified: false }));
          setFormData(prev => ({ ...prev, otp: "" }));
        } else {
          toast.error(data.message || "Invalid OTP. Please try again.");
        }
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpState.verified) {
      return toast.warning("Please verify your email with OTP first");
    }

    // Validate phone number before submission
    if (!validatePhoneNumber(formData.contact)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "otp") formDataObj.append(key, value);
      });

      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success(result.message);
        setTimeout(() => navigate("/member/login"), 2000);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("Registration failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f5ee] flex items-center justify-center min-h-screen relative overflow-hidden p-4">
      {/* Background Wave */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#2c5e1a"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="z-10 bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#f9a825]/30">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2c5e1a] mb-1">Member Registration</h2>
          <p className="text-gray-600 text-sm sm:text-base">Join our savings community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inputs */}
          {[
            { name: "name", placeholder: "Full Name", icon: <User size={20} /> },
            { name: "email", placeholder: "Email", icon: <EnvelopeSimple size={20} /> },
            { name: "password", placeholder: "Password", type: "password", icon: <LockSimple size={20} /> },
            { name: "address", placeholder: "Address", icon: <MapPin size={20} /> },
            { 
              name: "contact", 
              placeholder: "Contact Number", 
              icon: <Phone size={20} />,
              maxLength: 15
            },
          ].map(({ name, placeholder, icon, type = "text", maxLength }) => (
            <div key={name} className="relative">
              <input
                name={name}
                type={type}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
                maxLength={maxLength}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg border-[#2c5e1a]/30 focus:ring-2 focus:ring-[#f9a825]/50 focus:outline-none"
                required
                disabled={name === "email" && otpState.sent}
              />
              <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#4c8c2a]">{icon}</span>
              {name === "email" && !otpState.verified && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <button
                    type="button"
                    onClick={otpState.sent ? resendOtp : sendOtp}
                    disabled={loadingOtp || (otpState.sent && !otpState.resendAvailable)}
                    className={`text-xs sm:text-sm ${
                      otpState.sent 
                        ? "text-[#2c5e1a] bg-[#f9a825]/30 hover:bg-[#f9a825]/50" 
                        : "text-white bg-[#2c5e1a] hover:bg-[#1e4212]"
                    } px-2 sm:px-3 py-1 rounded transition-colors whitespace-nowrap`}
                  >
                    {loadingOtp ? (
                      "Sending..."
                    ) : otpState.sent ? (
                      otpState.resendAvailable ? (
                        <>
                          <ArrowCounterClockwise size={14} className="inline mr-1" />
                          Resend
                        </>
                      ) : (
                        `${otpState.resendTimer}s`
                      )
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* OTP Input */}
          {otpState.sent && !otpState.verified && (
            <div className="relative">
              <input
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg border-[#2c5e1a]/30 focus:ring-2 focus:ring-[#f9a825]/50"
                required
              />
              <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#4c8c2a]">
                <ShieldCheck size={20} />
              </span>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loadingOtp || formData.otp.length < 6}
                  className={`text-xs sm:text-sm ${
                    formData.otp.length < 6
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  } px-2 sm:px-3 py-1 rounded transition-colors`}
                >
                  {loadingOtp ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#2c5e1a] mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs sm:text-sm border border-[#2c5e1a]/30 rounded-lg shadow-sm file:bg-[#f9a825]/20 file:text-[#2c5e1a] file:border-0 file:py-2 file:px-4 file:mr-4 file:rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !otpState.verified}
            className={`w-full py-2 sm:py-3 px-4 ${
              isSubmitting || !otpState.verified
                ? "bg-[#f9a825]/50 cursor-not-allowed"
                : "bg-[#f9a825] hover:bg-[#e6951d]"
            } text-[#2c5e1a] font-bold rounded-lg shadow transition-colors text-sm sm:text-base`}
          >
            {isSubmitting ? (
              "Registering..."
            ) : (
              <>
                <UserPlus size={18} className="inline-block mr-2" />
                {otpState.verified ? "Complete Registration" : "Verify Email to Continue"}
              </>
            )}
          </button>

          <div className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/member/login"
              className="text-[#2c5e1a] font-semibold hover:text-[#f9a825] transition-colors"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;