import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from 'react';

const AllRecordsT = () => {
  const [collections, setCollections] = useState([]);
  const [members, setMembers] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/treasurer/records`,
        {
          params: { month, year },
        }
      );

      setCollections(data.collections || []);
      setMembers(data.members || []);
    } catch (err) {
      console.error("❌ Error fetching records:", err);
      toast.error("Failed to fetch records", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const getMonthName = (num) =>
    new Date(2025, num - 1).toLocaleString("default", { month: "long" });

  return (
    <div className="bg-[#f8f5ee] min-h-screen relative overflow-hidden">
      {/* SVG Wave Background */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#2c5e1a"
            fillOpacity="0.1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Header */}
      <header className="bg-[#2c5e1a] text-white sticky top-0 shadow-lg z-40">
        <div className="container mx-auto flex justify-between items-center p-5">
          <div className="flex items-center text-2xl font-semibold">
            <i className="ph ph-hand-coins text-[#f9a825] text-4xl"></i>
            <span className="ml-3">E-BachatGat</span>
          </div>
          <nav>
            <Link
              to="/treasurer/dashboard"
              className="hover:text-[#f9a825] text-lg font-medium transition-colors duration-300"
            >
              Back Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto bg-white p-8 mt-6 rounded-2xl shadow-lg border border-[#f9a825]/30 relative z-10 mb-10">
        <h2 className="text-3xl font-bold text-[#2c5e1a] mb-6 flex items-center">
          <i className="ph ph-list-checks text-[#f9a825] text-4xl mr-3"></i>
          All Contribution Records
        </h2>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#f8f5ee] p-6 rounded-xl shadow-md mb-8 border border-[#f9a825]/20">
          <div>
            <label className="text-[#2c5e1a] font-medium mb-2 block">
              Select Month:
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all"
            >
              <option value="">All</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#2c5e1a] font-medium mb-2 block">
              Select Year:
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all"
            >
              <option value="">All</option>
              {[...Array(10)].map((_, i) => {
                const y = 2020 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className={`bg-[#2c5e1a] text-white px-5 py-3 rounded-lg shadow-md hover:bg-[#1e4a12] transition-all flex-1 flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Loading...
                </>
              ) : (
                <>
                  <i className="ph ph-magnifying-glass mr-2"></i>
                  Get Record
                </>
              )}
            </button>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${BASE_URL}/treasurer/records/pdf?month=${month}&year=${year}`}
              className="bg-[#f9a825] text-[#2c5e1a] px-5 py-3 rounded-lg shadow-md hover:bg-[#e6951d] transition-all flex-1 flex items-center justify-center"
            >
              <i className="ph ph-file-pdf mr-2"></i>
              Download PDF
            </a>
          </div>
        </div>

        {/* Table */}
        {collections.length === 0 ? (
          <div className="bg-[#f8f5ee] p-8 rounded-xl text-center border border-[#f9a825]/20">
            <i className="ph ph-warning-circle text-[#f9a825] text-5xl mb-4"></i>
            <p className="text-[#2c5e1a] text-lg">
              No records found for the selected month/year.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md border border-[#f9a825]/20">
            <table className="w-full border-collapse">
              <thead className="bg-[#2c5e1a] text-white">
                <tr>
                  <th className="p-4 border-b border-[#f9a825]/30">
                    Contributor
                  </th>
                  <th className="p-4 border-b border-[#f9a825]/30">Role</th>
                  <th className="p-4 border-b border-[#f9a825]/30">Amount</th>
                  <th className="p-4 border-b border-[#f9a825]/30">Penalty</th>
                  <th className="p-4 border-b border-[#f9a825]/30">
                    Total Paid
                  </th>
                  <th className="p-4 border-b border-[#f9a825]/30">Date</th>
                  <th className="p-4 border-b border-[#f9a825]/30">Status</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr
                    key={col._id}
                    className="hover:bg-[#f8f5ee]/50 transition-colors"
                  >
                    <td className="p-4 border-b border-[#f9a825]/10 flex items-center">
                      {col.memberId?.image ? (
                        <img
                          src={col.memberId.image}
                          alt="Profile"
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#f9a825]/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-[#2c5e1a] font-semibold">
                            {col.memberId?.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <span className="text-[#2c5e1a]">
                        {col.memberId?.name || "Unknown Member"}
                      </span>
                    </td>

                    <td className="p-4 border-b border-[#f9a825]/10 text-center text-[#2c5e1a]">
                      {col.memberId?.role || "-"}
                    </td>

                    <td className="p-4 border-b border-[#f9a825]/10 text-center font-semibold text-green-700">
                      ₹ {col.amount}
                    </td>
                    <td
                      className={`p-4 border-b border-[#f9a825]/10 text-center font-semibold ${
                        col.penalty > 0 ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      ₹ {col.penalty || 0}
                    </td>
                    <td className="p-4 border-b border-[#f9a825]/10 text-center font-semibold text-blue-700">
                      ₹ {col.amount + (col.penalty || 0)}
                    </td>
                    <td className="p-4 border-b border-[#f9a825]/10 text-center text-[#2c5e1a]">
                      {col.datePaid
                        ? new Date(col.datePaid).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 border-b border-[#f9a825]/10 text-center">
                      {col.status === "Pending" ? (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          Unpaid
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllRecordsT;
