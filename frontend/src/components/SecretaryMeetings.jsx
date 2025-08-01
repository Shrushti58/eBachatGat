import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const ScheduleMeeting = ({
  onClose,
  fetchMeetings,
  meetingToEdit,
  defaultDate,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [minutes, setMinutes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (meetingToEdit) {
      setTitle(meetingToEdit.title || "");
      const formattedDate = meetingToEdit.date
        ? new Date(meetingToEdit.date).toISOString().split("T")[0]
        : "";
      setDate(formattedDate);
      setTime(meetingToEdit.time || "");
      setAgenda(meetingToEdit.agenda || "");
      setMinutes(meetingToEdit.minutes || "");
    } else {
      const formatted = defaultDate
        ? new Date(defaultDate).toISOString().split("T")[0]
        : "";
      setTitle("");
      setDate(formatted);
      setTime("");
      setAgenda("");
      setMinutes("");
    }
  }, [meetingToEdit, defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      Swal.fire(
        "Invalid Date",
        "Cannot schedule meetings in the past.",
        "warning"
      );
      setIsSubmitting(false);
      return;
    }

    if (date === today) {
      const [inputHour, inputMinute] = time.split(":").map(Number);
      const now = new Date();
      const inputTime = new Date();
      inputTime.setHours(inputHour, inputMinute, 0, 0);

      if (inputTime <= now) {
        Swal.fire("Invalid Time", "Time must be in the future.", "warning");
        setIsSubmitting(false);
        return;
      }
    }

    const data = { title, date, time, agenda };
    if (minutes) data.minutes = minutes;

    try {
      const response = meetingToEdit
        ? await axios.put(
            `${BASE_URL}/secretary/schedule/${meetingToEdit.id}`,
            data,
            { withCredentials: true }
          )
        : await axios.post(
            `${BASE_URL}/secretary/api/schedule`,
            data,
            {
              withCredentials: true,
            }
          );

      Swal.fire(
        "Success",
        `Meeting ${meetingToEdit ? "updated" : "scheduled"} successfully!`,
        "success"
      );
      fetchMeetings();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong.";
      Swal.fire("Error", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This meeting will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/secretary/delete/${meetingToEdit.id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          Swal.fire("Deleted!", "Meeting has been deleted.", "success");
          fetchMeetings();
          onClose();
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to delete meeting.";
        Swal.fire("Error", message, "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#f8f5ee] p-6 rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden">
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

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#2c5e1a]">
            {meetingToEdit ? "Edit Meeting" : "Schedule a Meeting"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2c5e1a]">
                Title
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full px-3 py-2 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c5e1a]">
                Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 w-full px-3 py-2 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c5e1a]">
                Time
              </label>
              <div className="mt-1 w-full">
                <TimePicker
                  onChange={setTime}
                  value={time}
                  format="hh:mm a"
                  clearIcon={null}
                  clockIcon="🕒"
                  className="w-full border border-[#2c5e1a]/30 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c5e1a]">
                Agenda
              </label>
              <textarea
                rows="3"
                required
                className="mt-1 w-full px-3 py-2 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            {meetingToEdit && (
              <div>
                <label className="block text-sm font-medium text-[#2c5e1a]">
                  Minutes (Optional)
                </label>
                <textarea
                  rows="3"
                  className="mt-1 w-full px-3 py-2 border border-[#2c5e1a]/30 rounded-lg focus:ring-2 focus:ring-[#f9a825]/50 focus:border-[#f9a825] transition-all duration-300"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
            )}

            <div className="pt-6 flex justify-between items-center">
              {meetingToEdit ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Delete Meeting
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-[#c5b065] cursor-not-allowed"
                      : "bg-[#f9a825] hover:bg-[#e6951d]"
                  } text-[#2c5e1a] font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-300`}
                >
                  {isSubmitting
                    ? meetingToEdit
                      ? "Updating..."
                      : "Scheduling..."
                    : meetingToEdit
                    ? "Update Meeting"
                    : "Schedule Meeting"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
