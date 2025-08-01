import React, { useState, useEffect } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";

import Summary from "../components/Summary";
import ProfileCard from "../components/ProfileCard";
import PaymentHistory from "../components/PaymentHistory";
import LoanDetails from "../components/LoanDetails";
import UpcomingMeetings from "../components/UpcomingMeetings";
import EditProfile from "../components/EditProfileModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberDashboard = () => {
  const [alertMsg, setAlertMsg] = useState("Loading...");
  const [member, setMember] = useState({});
  const [collections, setCollections] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalLoanPaid, setTotalLoanPaid] = useState(0);
  const [totalLoanPending, setTotalLoanPending] = useState(0);
  const [activeLoanAmount, setActiveLoanAmount] = useState(0);
  const [loans, setLoans] = useState([]);
  const [image, setImage] = useState(null);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/member/dashboard`,
          {
            withCredentials: true,
          }
        );
        console.log("API Response:", response.data);

        if (response.status === 200) {
          const data = response.data;
          setMember(data.member);
          setCollections(data.collections || []);
          setUpcomingMeetings(data.upcomingMeetings);
          setTotalPaid(parseFloat(data.totalPaid));
          setTotalPending(parseFloat(data.totalPending));
          setTotalLoanPaid(parseFloat(data.totalLoanRepaid));
          setTotalLoanPending(parseFloat(data.totalLoanPending))
          setActiveLoanAmount(parseFloat(data.activeLoanAmount));
          setLoans(data.loans);
          setImage(data.image);

          setAlertMsg("Dashboard loaded successfully!");
        } else {
          setAlertMsg("Failed to load dashboard.");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAlertMsg("Server error while loading dashboard.");
      }
    };

    fetchData();
  }, []);
return (
  <div className="min-h-screen bg-gray-50 relative overflow-hidden">
    {/* Decorative Circles - Top Section */}
    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#f9a825]/10 blur-xl"></div>
    <div className="absolute top-32 -left-16 w-48 h-48 rounded-full bg-[#2c5e1a]/10 blur-lg"></div>
    <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-[#f9a825]/5 blur-lg"></div>
    
    {/* Decorative Circles - Middle Section */}
    <div className="absolute top-1/2 right-32 w-24 h-24 rounded-full bg-[#f9a825]/15 blur-md animate-pulse"></div>
    <div className="absolute top-2/3 left-32 w-28 h-28 rounded-full bg-[#2c5e1a]/10 blur-md"></div>
    
    <ToastContainer position="top-center" autoClose={2000} />
    <Navbar userType="member" />
    
    <div className="max-w-6xl mx-auto px-4 py-8 pb-40 relative z-10">
      <ProfileCard member={member} image={image} />
      <Summary
        totalPaid={totalPaid}
        totalPending={totalPending}
        activeLoanAmount={activeLoanAmount}
      />
      <PaymentHistory collections={collections} />
      <LoanDetails
        loans={loans}
        activeLoanAmount={activeLoanAmount}
        totalLoanRepaid={totalLoanPaid}
        totalLoanPending={totalLoanPending}
      />
      <UpcomingMeetings meetings={upcomingMeetings} />
    </div>

    {/* Enhanced SVG Wave Background */}
    <div className="absolute bottom-0 left-0 right-0 z-0 h-64">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2c5e1a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f9a825" stopOpacity="0.1" />
          </linearGradient>
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="#f9a825" fillOpacity="0.15" />
          </pattern>
        </defs>
        <path 
          fill="url(#waveGradient)" 
          d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,250.7C960,267,1056,277,1152,256C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <rect width="100%" height="100%" fill="url(#pattern-circles)" opacity="0.3" />
      </svg>
    </div>

    {/* Bottom Decorative Elements */}
    <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-[#f9a825]/20 blur-md animate-float"></div>
    <div className="absolute bottom-40 left-10 w-12 h-12 rounded-full bg-[#2c5e1a]/15 blur-sm animate-float-slow"></div>
    <div className="absolute bottom-32 right-1/4 w-20 h-20 rounded-full bg-[#f9a825]/10 blur-lg animate-float-delay"></div>
    
    {/* Floating Triangles */}
    <div className="absolute top-1/4 right-1/3 w-16 h-16 clip-path-triangle bg-[#2c5e1a]/10 rotate-45 blur-sm"></div>
    <div className="absolute bottom-1/3 left-1/4 w-12 h-12 clip-path-triangle bg-[#f9a825]/10 rotate-12 blur-sm"></div>
  </div>
);
};

export default MemberDashboard;
