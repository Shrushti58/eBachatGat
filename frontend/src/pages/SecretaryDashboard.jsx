import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import axios from "axios";
import ScheduleMeeting from "../components/SecretaryMeetings";
import interactionPlugin from "@fullcalendar/interaction";
import Headerse from "../components/Headerse";

const SecretaryDashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/secretary/api/meetings`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const formatted = res.data.meetings.map((meeting) => ({
          id: meeting._id,
          title: meeting.title,
          start: moment(
            `${meeting.date} ${meeting.time}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString(),
          extendedProps: {
            date: meeting.date,
            time: meeting.time,
            agenda: meeting.agenda,
            minutes: meeting.minutes || "",
            createdBy: meeting.createdBy,
          },
          color: meeting.minutes ? "#2c5e1a" : "#f9a825", // Green for completed, yellow for pending
        }));
        setMeetings(formatted);
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load meetings", "error");
    }
  };

  const handleEventClick = (info) => {
    const { title, start, extendedProps, id } = info.event;

    Swal.fire({
      title,
      html: `
        <b>Date:</b> ${moment(start).format("MMMM Do YYYY, h:mm A")}<br/>
        <b>Agenda:</b> ${extendedProps.agenda}<br/>
        <b>Minutes:</b> ${extendedProps.minutes || "Not added yet"}
      `,
      showCancelButton: true,
      confirmButtonText: "Edit Meeting",
      cancelButtonText: "Close",
      confirmButtonColor: "#2c5e1a",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedMeeting({
          id,
          title,
          date: extendedProps.date,
          time: extendedProps.time,
          agenda: extendedProps.agenda,
          minutes: extendedProps.minutes,
        });
        setShowScheduleModal(true);
      }
    });
  };

  const handleDateClick = (info) => {
    const clickedDate = moment(info.date).format("YYYY-MM-DD");
    const today = moment().startOf("day");

    if (moment(clickedDate).isBefore(today)) {
      Swal.fire({
        title: "Invalid Date",
        text: "Cannot schedule meetings in the past.",
        icon: "warning",
        confirmButtonColor: "#2c5e1a",
      });
      return;
    }

    setDefaultDate(clickedDate);
    setSelectedMeeting(null);
    setShowScheduleModal(true);
  };

  const handleModalClose = () => {
    setSelectedMeeting(null);
    setDefaultDate(null);
    setShowScheduleModal(false);
  };

  return (
    <>
      <Headerse />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#2c5e1a]">
              Secretary Dashboard
            </h2>
            <div className="w-24 h-1 bg-[#f9a825] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-[#2c5e1a] to-[#3a7d1e] text-white">
              <h1 className="text-2xl font-bold">Meeting Schedule</h1>
              <p className="opacity-90">
                View and manage all committee meetings
              </p>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  <i className="far fa-calendar-alt mr-2 text-[#2c5e1a]"></i>
                  Meeting Calendar
                </h2>
                <button
                  className="bg-[#2c5e1a] hover:bg-[#1e4212] text-white py-2 px-6 rounded-lg shadow-md transition flex items-center"
                  onClick={() => {
                    setSelectedMeeting(null);
                    setDefaultDate(null);
                    setShowScheduleModal(true);
                  }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Schedule Meeting
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={meetings}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  height="auto"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek",
                  }}
                  buttonText={{
                    today: "Today",
                    month: "Month",
                    week: "Week",
                  }}
                  themeSystem="standard"
                />
              </div>
            </div>
          </div>
        </div>

        {showScheduleModal && (
          <ScheduleMeeting
            onClose={handleModalClose}
            fetchMeetings={fetchMeetings}
            meetingToEdit={selectedMeeting}
            defaultDate={defaultDate}
          />
        )}
      </div>
    </>
  );
};

export default SecretaryDashboard;
