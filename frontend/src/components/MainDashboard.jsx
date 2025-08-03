import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHandHoldingUsd,
  FaUsers,
  FaCalendarAlt,
  FaRupeeSign,
  FaChartLine,
  FaLock,
  FaEye,
  FaCloud,
  FaFileAlt,
  FaUserFriends,
  FaHandsHelping,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiHandCoinLine } from "react-icons/ri";
import { Mail } from "lucide-react";

const MainDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Animation variants
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const testimonials = [
    {
      icon: <FaRupeeSign className="text-xl" />,
      color: "bg-[#f9a825]",
      message:
        "E-Bachat Gat has transformed how we manage our group. No more manual calculations or disputes about payments.",
      name: "Sunita Patil",
      role: "Group Leader",
    },
    {
      icon: <FaFileAlt className="text-xl" />,
      color: "bg-[#4c8c2a]",
      message:
        "The transparency in transactions has built so much trust among our members. No more doubts about the accounts.",
      name: "Rajesh More",
      role: "Group Member",
    },
    {
      icon: <FaUserFriends className="text-xl" />,
      color: "bg-[#e67e22]",
      message:
        "Scheduling meetings is no longer a mess. Members get reminders and everything runs on time.",
      name: "Manisha Pawar",
      role: "Secretary",
    },
    {
      icon: <FaHandsHelping className="text-xl" />,
      color: "bg-[#6a1b9a]",
      message:
        "Approving loans is now seamless. I can view documents, verify guarantors, and approve digitally. Total control with transparency!",
      name: "Nilesh Kadam",
      role: "President",
    },
  ];
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const cardHover = {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3 },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-[#f8f5ee] min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="bg-[#2c5e1a] text-white sticky top-0 shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4 md:p-5">
          <motion.div
            className="flex items-center text-xl md:text-2xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RiHandCoinLine className="text-[#f9a825] text-3xl md:text-4xl" />
            <span className="ml-2 md:ml-3">E-BachatGat</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-3 md:space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="hover:text-[#f9a825] text-sm md:text-lg font-medium transition-colors duration-300"
                to="/member/login"
              >
                Member Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="hover:text-[#f9a825] text-sm md:text-lg font-medium transition-colors duration-300"
                to="/admin/login"
              >
                Admin Panel
              </Link>
            </motion.div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#2c5e1a] px-4 pb-4"
          >
            <div className="flex flex-col space-y-3">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Link
                  className="block hover:text-[#f9a825] text-lg font-medium transition-colors duration-300 py-2"
                  to="/member/login"
                >
                  Member Login
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Link
                  className="block hover:text-[#f9a825] text-lg font-medium transition-colors duration-300 py-2"
                  to="/admin/login"
                >
                  Admin Panel
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2c5e1a] to-[#4c8c2a] text-white py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-10"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              Welcome to <span className="text-[#f9a825]">E-BachatGat</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Digital Management for Your Savings Group
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/member/register"
                className="bg-[#f9a825] hover:bg-[#f57f17] text-[#2c5e1a] font-bold py-3 px-8 rounded-lg shadow-lg inline-flex items-center transition-all duration-300"
              >
                Get Started
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f8f5ee"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 md:py-16 bg-[#f8f5ee]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#2c5e1a] mb-3">
              Group Management Made Simple
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your savings group in one place
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-center"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: (
                  <FaHandHoldingUsd className="w-12 h-12 mx-auto text-[#2c5e1a]" />
                ),
                title: "Savings Tracking",
                desc: "Monitor all member contributions in real-time",
              },
              {
                icon: <FaUsers className="w-12 h-12 mx-auto text-[#4c8c2a]" />,
                title: "Loan Management",
                desc: "Track loans issued and repayments with ease",
              },
              {
                icon: (
                  <FaCalendarAlt className="w-12 h-12 mx-auto text-[#f9a825]" />
                ),
                title: "Meeting Scheduler",
                desc: "Plan and document all group meetings",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-[#f9a825]/20 hover:shadow-lg transition-all duration-300"
                variants={item}
                whileHover={cardHover}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-[#2c5e1a]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm md:text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marathi Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
              बचत गटाच्या डिजिटल नोंदीचे महत्त्व
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
              डिजिटल व्यवस्थापन हे पारंपरिक लेखापद्धतीपेक्षा वेगवान, सुरक्षित
              आणि पारदर्शक आहे. आमचे प्लॅटफॉर्म तुमच्या गटाच्या सर्व आर्थिक
              व्यवहारांची सुसूत्री नोंदणी करते.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <FaEye className="w-8 h-8 mx-auto text-[#2c5e1a]" />,
                title: "100% पारदर्शकता",
                desc: "प्रत्येक व्यवहार ऑनलाईन रेकॉर्ड केला जातो.",
              },
              {
                icon: (
                  <FaChartLine className="w-8 h-8 mx-auto text-[#4c8c2a]" />
                ),
                title: "स्मार्ट वित्त व्यवस्थापन",
                desc: "बचत व कर्जाच्या व्यवहारांची स्वयंचलित गणना.",
              },
              {
                icon: <FaCloud className="w-8 h-8 mx-auto text-[#f9a825]" />,
                title: "ऑनलाइन प्रवेश",
                desc: "कुठूनही, कधीही आर्थिक माहिती पाहू शकतात.",
              },
              {
                icon: <FaLock className="w-8 h-8 mx-auto text-[#e2725b]" />,
                title: "डेटा सुरक्षा",
                desc: "तुमचे सर्व आर्थिक रेकॉर्ड सुरक्षित आहेत.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#f8f5ee] p-4 md:p-6 rounded-lg shadow-md border border-[#f9a825]/20 hover:shadow-lg transition-all duration-300"
                variants={item}
                whileHover={cardHover}
              >
                <div className="mb-3 md:mb-4">{item.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-[#2c5e1a]">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-md mt-2 md:mt-3">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-[#f8f5ee]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#2c5e1a] mb-3">
              What Our Members Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our happy group members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <div
                    className={`${t.color} text-white p-3 rounded-full mr-4`}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-gray-700 italic mb-4">"{t.message}"</p>
                    <p className="font-semibold text-[#2c5e1a]">
                      - {t.name}, {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#2c5e1a] to-[#4c8c2a] text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Welcome to Your Digital Bachat Gat
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Access your savings, loans, meetings, and more — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/member/login"
                  className="bg-[#f9a825] hover:bg-[#f57f17] text-[#2c5e1a] font-bold py-3 px-8 rounded-lg shadow-lg inline-flex items-center transition-all duration-300"
                >
                  Member Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg border-2 border-white inline-flex items-center transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c5e1a] text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-xl font-semibold mb-4 md:mb-0">
              <RiHandCoinLine className="text-[#f9a825] text-3xl" />
              <span className="ml-2">E-BachatGat</span>
            </div>
            <div className="flex justify-center items-center gap-2 text-white">
              <Mail className="w-5 h-5 text-[#f9a825]" />
              <a
                href="mailto:ebachatgat5@gmail.com"
                className="hover:text-[#f9a825] transition-colors duration-300"
              >
                ebachatgat5@gmail.com
              </a>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm">
            <p>&copy; 2025 E-BachatGat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainDashboard;