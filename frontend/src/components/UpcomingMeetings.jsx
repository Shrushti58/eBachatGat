import React, { useState } from 'react';
import { Calendar, FileText, CaretDown, CaretUp } from "phosphor-react";

const UpcomingMeetings = ({ meetings }) => {
  const [openAgenda, setOpenAgenda] = useState({});

  const toggleAgenda = (meetingId) => {
    setOpenAgenda(prevState => ({
      ...prevState,
      [meetingId]: !prevState[meetingId],
    }));
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg border border-[#f9a825]/20 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#2c5e1a] p-4 relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#f9a825]/20 rounded-full blur-lg"></div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 relative z-10">
            <Calendar className="text-[#f9a825]" size={20} />
            Upcoming Meetings
          </h2>
        </div>

        {meetings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No upcoming meetings scheduled.
          </div>
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8f5ee] text-[#2c5e1a]">
                    <th className="p-3 border-b border-[#2c5e1a]/20 text-left">Title</th>
                    <th className="p-3 border-b border-[#2c5e1a]/20 text-left">Date</th>
                    <th className="p-3 border-b border-[#2c5e1a]/20 text-left">Time</th>
                
                    <th className="p-3 border-b border-[#2c5e1a]/20 text-left">Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting, index) => (
                    <React.Fragment key={index}>
                      <tr className="border-b border-[#2c5e1a]/10 hover:bg-[#f8f5ee]/50 transition-colors">
                        <td className="p-3 font-medium">{meeting.title}</td>
                        <td className="p-3">{new Date(meeting.date).toLocaleDateString()}</td>
                        <td className="p-3">{meeting.time}</td>
                        <td className="p-3">
                          {meeting.minutes ? (
                            <span className="bg-[#2c5e1a]/20 text-[#2c5e1a] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <FileText size={14} weight="duotone" /> Available
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">Not available</span>
                          )}
                        </td>
                      </tr>

                      {/* Agenda Details */}
                      {meeting.agenda && (
                        <tr>
                          <td colSpan="5" className="p-2">
                            <div 
                              className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#f8f5ee]/30 rounded"
                              onClick={() => toggleAgenda(meeting.id)}
                            >
                              <div className="flex items-center gap-2 text-[#2c5e1a]">
                                <FileText size={18} weight="duotone" className="text-[#f9a825]" />
                                <span className="font-medium">Meeting Agenda</span>
                              </div>
                              <div className="flex items-center gap-1 text-[#2c5e1a]/70">
                                <span className="text-sm">
                                  {openAgenda[meeting.id] ? "Hide" : "Show"}
                                </span>
                                {openAgenda[meeting.id] ? (
                                  <CaretUp size={18} weight="bold" />
                                ) : (
                                  <CaretDown size={18} weight="bold" />
                                )}
                              </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${openAgenda[meeting.id] ? "max-h-screen" : "max-h-0"}`}>
                              <div className="p-4 bg-[#f8f5ee]/30 rounded mt-2 text-[#2c5e1a]">
                                {meeting.agenda}
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
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;