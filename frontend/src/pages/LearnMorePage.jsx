import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaHandHoldingUsd,
  FaUserShield,
  FaFileAlt,
  FaShieldAlt,
  FaBell,
  FaChartPie,
  FaCalendarAlt,
  FaFilePdf,
  FaMobileAlt,
  FaEnvelope,
  FaGlobe,
  FaLightbulb,
  FaRocket,
  FaQuestionCircle,
  FaLeaf,
  FaWater,
  FaSeedling,
  FaLayerGroup, FaRobot
} from 'react-icons/fa';

const LearnMorePage = () => {
  const featuresRef = useRef(null);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  // Scroll to features function
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Decorative elements
  const FloatingLeaves = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, x: Math.random() * 100, rotate: Math.random() * 360 }}
          animate={{
            y: [0, 50, 0],
            rotate: [0, 180, 360],
            x: [0, Math.random() * 50 - 25, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-[#2c5e1a]/20"
          style={{
            fontSize: `${20 + Math.random() * 30}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          <FaLeaf />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#f0f7ed] to-[#e0f0e0] min-h-screen p-6 md:p-10 relative overflow-hidden">
      <FloatingLeaves />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#f9a825]/10 blur-xl opacity-70"></div>
      <div className="absolute bottom-1/4 right-20 w-60 h-60 rounded-full bg-[#2c5e1a]/10 blur-xl opacity-50"></div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16 relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#f9a825]/20 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#f9a825]/20 blur-md"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#2c5e1a]/20 blur-md"></div>
          
          <motion.h1 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-[#2c5e1a] mb-6 font-serif"
          >
            Discover <span className="text-[#f9a825] font-cursive">e-Bachat Gat</span>
          </motion.h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto">
            A digital revolution for your savings group, bringing transparency, efficiency, and simplicity to your financial management.
          </p>
          <motion.button
            onClick={scrollToFeatures}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center bg-gradient-to-r from-[#f9a825] to-[#f9c225] text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all group"
          >
            <span>How It Works</span>
            <motion.span 
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              ↓
            </motion.span>
          </motion.button>
        </div>
      </motion.section>

      {/* Why We Built It */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto mb-20 relative z-10"
      >
        <motion.div 
          variants={item}
          className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#f9a825] relative overflow-hidden"
        >
          {/* Watercolor effect background */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#f9a825]/10 blur-3xl opacity-30"></div>
          
          <div className="flex flex-col md:flex-row items-start mb-6">
            <div className="bg-[#f9a825]/10 p-3 rounded-full mr-4 mb-4 md:mb-0">
              <FaLightbulb className="text-2xl text-[#f9a825]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2c5e1a] mb-2">Why We Built It</h2>
              <p className="text-gray-700">
                Traditional savings groups face challenges with manual record-keeping, transparency, and accessibility. 
                e-Bachat Gat eliminates these pain points with a secure, easy-to-use digital platform that works for everyone.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { 
                icon: <FaFileAlt className="text-[#2c5e1a]" size={20} />, 
                title: "No More Paperwork", 
                desc: "Digital records replace bulky registers",
                bg: "bg-[#f0f7ed]"
              },
              { 
                icon: <FaUserShield className="text-[#4c8c2a]" size={20} />, 
                title: "Full Transparency", 
                desc: "Every transaction is visible to authorized members",
                bg: "bg-[#e8f5e9]"
              },
              { 
                icon: <FaChartPie className="text-[#f9a825]" size={20} />, 
                title: "Save Time", 
                desc: "Automated calculations and reports",
                bg: "bg-[#f9f5e9]"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className={`${item.bg} p-4 rounded-xl border border-[#2c5e1a]/10 relative overflow-hidden`}
              >
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  {index === 0 && <FaFileAlt size={60} />}
                  {index === 1 && <FaUserShield size={60} />}
                  {index === 2 && <FaChartPie size={60} />}
                </div>
                <div className="flex items-center mb-3">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-[#2c5e1a]">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Current Features - This is the section we're scrolling to */}
      <motion.section
        ref={featuresRef}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mb-20 relative z-10"
      >
        <div className="text-center mb-12">
          <motion.h2 
            variants={item}
            className="text-3xl md:text-4xl font-bold text-[#2c5e1a] mb-4 font-serif"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            variants={item}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything your savings group needs in one place
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: <FaUsers size={24} />, 
              title: "Member Management", 
              desc: "Register and manage all group members with profiles",
              color: "text-[#2c5e1a]",
              bg: "bg-[#2c5e1a]/10"
            },
            { 
              icon: <FaUserShield size={24} />, 
              title: "Approval System", 
              desc: "President approval for important actions",
              color: "text-[#4c8c2a]",
              bg: "bg-[#4c8c2a]/10"
            },
            { 
              icon: <FaHandHoldingUsd size={24} />, 
              title: "Savings Tracking", 
              desc: "Digital tracking of all contributions",
              color: "text-[#f9a825]",
              bg: "bg-[#f9a825]/10"
            },
            { 
              icon: <FaChartPie size={24} />, 
              title: "Financial Overview", 
              desc: "Visual dashboard of group finances",
              color: "text-[#2c5e1a]",
              bg: "bg-[#2c5e1a]/10"
            },
            { 
              icon: <FaFileAlt size={24} />, 
              title: "Loan Management", 
              desc: "Request, approve, and track loans with documents",
              color: "text-[#4c8c2a]",
              bg: "bg-[#4c8c2a]/10"
            },
            { 
              icon: <FaShieldAlt size={24} />, 
              title: "Secure Guarantors", 
              desc: "Upload and manage guarantor information securely",
              color: "text-[#f9a825]",
              bg: "bg-[#f9a825]/10"
            },
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-[#f9a825]/10 hover:border-[#f9a825]/30 transition-all relative overflow-hidden group"
            >
              {/* Animated background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#f9a825]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon with unique shape */}
              <div className={`${feature.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform`}>
                <span className={feature.color}>{feature.icon}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-[#2c5e1a] mb-2 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.desc}</p>
              
              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#f9a825]/30 rounded-bl-xl"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Who Can Use It */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-20 relative z-10"
      >
        <motion.div 
          variants={item}
          className="bg-gradient-to-br from-[#2c5e1a] via-[#3a7a24] to-[#4c8c2a] p-8 rounded-2xl shadow-lg text-white relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 opacity-20">
            <FaSeedling size={120} />
          </div>
          <div className="absolute bottom-0 left-0 opacity-20">
            <FaWater size={100} />
          </div>
          
          <div className="flex flex-col md:flex-row items-start relative z-10">
            <div className="bg-white/20 p-3 rounded-full mr-4 mb-4 md:mb-0">
              <FaQuestionCircle className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Who Can Use It?</h2>
              <p className="mb-4 opacity-90">
                Currently, e-Bachat Gat is being carefully developed for a single group, allowing us to refine the platform based on real user feedback.
              </p>
              <div className="bg-white/10 p-4 rounded-lg border-l-4 border-[#f9a825]">
                <p className="opacity-90 italic">
                  "Our goal is to expand access in the future, but right now we're focused on perfecting the experience for our pilot group."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>




     
    </div>
  );
};

export default LearnMorePage;