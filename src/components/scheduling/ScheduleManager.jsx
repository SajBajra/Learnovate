"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isAfter,
  addDays,
  getDay,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday as dateFnsIsToday,
} from "date-fns"
import PageTransition from "../common/PageTransition"
import { toast } from "react-toastify"
import "./Scheduling.css"

const ScheduleManager = ({ currentUser, users, sessionRequests, setSessionRequests }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState("month") // "month" or "week"
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [sessionTopic, setSessionTopic] = useState("")
  const [sessionMessage, setSessionMessage] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState(currentUser.role === "mentor" ? "availability" : "booking")
  const [timeSlots, setTimeSlots] = useState([
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ])

  const location = useLocation()
  const navigate = useNavigate()

  // Mock availability data - in a real app, this would come from a database
  const [mentorAvailability, setMentorAvailability] = useState([
    {
      mentorId: 1, // John Doe
      slots: [
        { date: "2025-05-05", time: "10:00" },
        { date: "2025-05-05", time: "14:00" },
        { date: "2025-05-06", time: "11:00" },
        { date: "2025-05-07", time: "15:00" },
        { date: "2025-05-08", time: "09:00" },
        { date: "2025-05-09", time: "13:00" },
        { date: "2025-05-12", time: "10:00" },
        { date: "2025-05-14", time: "14:00" },
        { date: "2025-05-16", time: "11:00" },
        { date: "2025-05-19", time: "15:00" },
        { date: "2025-05-21", time: "09:00" },
        { date: "2025-05-23", time: "13:00" },
      ],
    },
    {
      mentorId: 2, // Jane Smith
      slots: [
        { date: "2025-05-05", time: "09:00" },
        { date: "2025-05-06", time: "13:00" },
        { date: "2025-05-07", time: "10:00" },
        { date: "2025-05-08", time: "14:00" },
        { date: "2025-05-09", time: "16:00" },
        { date: "2025-05-13", time: "09:00" },
        { date: "2025-05-15", time: "13:00" },
        { date: "2025-05-17", time: "10:00" },
        { date: "2025-05-20", time: "14:00" },
        { date: "2025-05-22", time: "16:00" },
      ],
    },
    {
      mentorId: 6, // David Chen
      slots: [
        { date: "2025-05-05", time: "11:00" },
        { date: "2025-05-06", time: "15:00" },
        { date: "2025-05-07", time: "09:00" },
        { date: "2025-05-08", time: "13:00" },
        { date: "2025-05-09", time: "17:00" },
        { date: "2025-05-12", time: "11:00" },
        { date: "2025-05-14", time: "15:00" },
        { date: "2025-05-16", time: "09:00" },
        { date: "2025-05-19", time: "13:00" },
        { date: "2025-05-21", time: "17:00" },
      ],
    },
    {
      mentorId: 7, // Emily Rodriguez
      slots: [
        { date: "2025-05-05", time: "13:00" },
        { date: "2025-05-06", time: "09:00" },
        { date: "2025-05-07", time: "14:00" },
        { date: "2025-05-08", time: "10:00" },
        { date: "2025-05-09", time: "15:00" },
        { date: "2025-05-13", time: "13:00" },
        { date: "2025-05-15", time: "09:00" },
        { date: "2025-05-17", time: "14:00" },
        { date: "2025-05-20", time: "10:00" },
        { date: "2025-05-22", time: "15:00" },
      ],
    },
  ])

  // Get mentors
  const mentors = users.filter((user) => user.role === "mentor")

  // Set selected mentor if coming from another page
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const mentorId = urlParams.get("mentorId")

    if (mentorId) {
      const mentor = mentors.find((m) => m.id === Number.parseInt(mentorId))
      if (mentor) {
        setSelectedMentor(mentor)
        setView("booking")
      }
    }
  }, [location.search, mentors])

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  // Generate calendar days
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getDaysInWeek = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday
    return eachDayOfInterval({ start, end })
  }

  // Get day of week (0-6, where 0 is Sunday)
  const getFirstDayOfMonth = () => {
    return getDay(startOfMonth(currentDate))
  }

  // For mentors: Toggle availability for a time slot
  const toggleAvailability = (date, time) => {
    if (currentUser.role !== "mentor") return

    const dateStr = format(date, "yyyy-MM-dd")
    const mentorIndex = mentorAvailability.findIndex((m) => m.mentorId === currentUser.id)

    if (mentorIndex === -1) {
      // Create new availability for this mentor
      setMentorAvailability([
        ...mentorAvailability,
        {
          mentorId: currentUser.id,
          slots: [{ date: dateStr, time }],
        },
      ])
      toast.success(`Added availability for ${format(date, "MMM d")} at ${time}`)
    } else {
      // Update existing availability
      const mentor = mentorAvailability[mentorIndex]
      const slotIndex = mentor.slots.findIndex((slot) => slot.date === dateStr && slot.time === time)

      let updatedSlots
      if (slotIndex === -1) {
        // Add new slot
        updatedSlots = [...mentor.slots, { date: dateStr, time }]
        toast.success(`Added availability for ${format(date, "MMM d")} at ${time}`)
      } else {
        // Remove existing slot
        updatedSlots = mentor.slots.filter((_, i) => i !== slotIndex)
        toast.info(`Removed availability for ${format(date, "MMM d")} at ${time}`)
      }

      const updatedAvailability = [...mentorAvailability]
      updatedAvailability[mentorIndex] = {
        ...mentor,
        slots: updatedSlots,
      }

      setMentorAvailability(updatedAvailability)
    }
  }

  // Check if a slot is available for a mentor
  const isSlotAvailable = (mentorId, date, time) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const mentor = mentorAvailability.find((m) => m.mentorId === mentorId)

    if (!mentor) return false

    return mentor.slots.some((slot) => slot.date === dateStr && slot.time === time)
  }

  // Check if a slot is already booked
  const isSlotBooked = (mentorId, date, time) => {
    const dateStr = format(date, "yyyy-MM-dd")

    return sessionRequests.some(
      (request) =>
        request.mentorId === mentorId &&
        request.date === dateStr &&
        request.time === time &&
        (request.status === "accepted" || request.status === "pending"),
    )
  }

  // For apprentices: Select a date
  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  // For apprentices: Select a time slot
  const handleSlotSelect = (date, time) => {
    if (!selectedMentor) return

    const dateStr = format(date, "yyyy-MM-dd")
    setSelectedSlot({ date: dateStr, time, mentorId: selectedMentor.id })
  }

  // Request a session
  const requestSession = () => {
    if (!selectedSlot || !sessionTopic || !sessionMessage) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: sessionRequests.length + 1,
        mentorId: selectedSlot.mentorId,
        apprenticeId: currentUser.id,
        status: "pending",
        topic: sessionTopic,
        date: selectedSlot.date,
        time: selectedSlot.time,
        message: sessionMessage,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setSessionRequests([...sessionRequests, newRequest])
      setShowConfirmation(true)
      setLoading(false)
      toast.success(`Session request sent to ${selectedMentor.name}!`)

      // Reset form
      setTimeout(() => {
        setShowConfirmation(false)
        setSelectedSlot(null)
        setSessionTopic("")
        setSessionMessage("")
      }, 3000)
    }, 1000)
  }

  // Get upcoming sessions for the current user
  const upcomingSessions = sessionRequests
    .filter((request) => {
      const isUserInvolved =
        (currentUser.role === "mentor" && request.mentorId === currentUser.id) ||
        (currentUser.role === "apprentice" && request.apprenticeId === currentUser.id)

      const isUpcoming =
        (request.status === "accepted" || request.status === "pending") &&
        isAfter(parseISO(`${request.date}T${request.time}`), new Date())

      return isUserInvolved && isUpcoming
    })
    .sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`)
      const dateB = parseISO(`${b.date}T${b.time}`)
      return dateA - dateB
    })

  // Check if a date has any available slots
  const hasAvailableSlots = (date, mentorId) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const mentor = mentorAvailability.find((m) => m.mentorId === mentorId)

    if (!mentor) return false

    return mentor.slots.some((slot) => slot.date === dateStr)
  }

  // Check if a date has any booked slots
  const hasBookedSlots = (date, mentorId) => {
    const dateStr = format(date, "yyyy-MM-dd")

    return sessionRequests.some(
      (request) =>
        request.mentorId === mentorId &&
        request.date === dateStr &&
        (request.status === "accepted" || request.status === "pending"),
    )
  }

  // Handle accepting a session request
  const handleAcceptSession = (sessionId) => {
    const updatedRequests = sessionRequests.map((request) =>
      request.id === sessionId ? { ...request, status: "accepted" } : request,
    )
    setSessionRequests(updatedRequests)
    toast.success("Session accepted!")
  }

  // Handle declining a session request
  const handleDeclineSession = (sessionId) => {
    const updatedRequests = sessionRequests.map((request) =>
      request.id === sessionId ? { ...request, status: "declined" } : request,
    )
    setSessionRequests(updatedRequests)
    toast.info("Session declined")
  }

  // Render calendar for month view
  const renderMonthCalendar = () => {
    const days = getDaysInMonth()
    const firstDayOfMonth = getFirstDayOfMonth()

    // Adjust for Monday as first day of week
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Get all days needed for the calendar grid (including days from prev/next months)
    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="calendar-month-view">
        <div className="calendar-days-header">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-name">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid-month">
          {calendarDays.map((day) => {
            const isToday = dateFnsIsToday(day)
            const isSelected = isSameDay(day, selectedDate)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const dateStr = format(day, "yyyy-MM-dd")

            // Check if this day has available slots (for the selected mentor or current user)
            const mentorId = view === "booking" ? (selectedMentor ? selectedMentor.id : null) : currentUser.id
            const hasAvailable = mentorId ? hasAvailableSlots(day, mentorId) : false
            const hasBooked = mentorId ? hasBookedSlots(day, mentorId) : false

            return (
              <div
                key={dateStr}
                className={`calendar-day 
                  ${isToday ? "today" : ""} 
                  ${isSelected ? "selected" : ""} 
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${hasAvailable ? "has-available" : ""} 
                  ${hasBooked ? "has-booked" : ""}`}
                onClick={() => handleDateSelect(day)}
              >
                <span className="day-number">{format(day, "d")}</span>
                {hasAvailable && <div className="day-indicator available"></div>}
                {hasBooked && <div className="day-indicator booked"></div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render calendar for week view
  const renderWeekCalendar = () => {
    const days = getDaysInWeek()

    return (
      <div className="calendar-week-view">
        <div className="calendar-days-header">
          {days.map((day) => (
            <div key={day.toString()} className="calendar-day-column">
              <div className={`calendar-day-header ${dateFnsIsToday(day) ? "today" : ""}`}>
                <div className="day-name">{format(day, "EEE")}</div>
                <div className="day-number">{format(day, "d")}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-time-slots">
          {timeSlots.map((time) => (
            <div key={time} className="time-row">
              <div className="time-label">{time}</div>

              {days.map((day) => {
                const mentorId = view === "booking" ? (selectedMentor ? selectedMentor.id : null) : currentUser.id
                const isAvailable = mentorId ? isSlotAvailable(mentorId, day, time) : false
                const isBooked = mentorId ? isSlotBooked(mentorId, day, time) : false
                const dateStr = format(day, "yyyy-MM-dd")
                const isSelected = selectedSlot && selectedSlot.date === dateStr && selectedSlot.time === time

                return (
                  <div
                    key={`${day}-${time}`}
                    className={`time-slot 
                      ${isAvailable ? "available" : ""} 
                      ${isBooked ? "booked" : ""} 
                      ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      if (view === "booking") {
                        isAvailable && !isBooked && handleSlotSelect(day, time)
                      } else {
                        !isBooked && toggleAvailability(day, time)
                      }
                    }}
                  >
                    {isBooked ? (
                      <span className="slot-status booked">Booked</span>
                    ) : isAvailable ? (
                      isSelected ? (
                        <span className="slot-status selected">Selected</span>
                      ) : (
                        <span className="slot-status available">Available</span>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render time slots for selected date
  const renderTimeSlots = () => {
    if (!selectedDate || (view === "booking" && !selectedMentor)) return null

    const mentorId = view === "booking" ? selectedMentor.id : currentUser.id
    const dateStr = format(selectedDate, "yyyy-MM-dd")

    return (
      <div className="time-slots-container">
        <h3>Available Times for {format(selectedDate, "MMMM d, yyyy")}</h3>

        <div className="time-slots-grid">
          {timeSlots.map((time) => {
            const isAvailable = isSlotAvailable(mentorId, selectedDate, time)
            const isBooked = isSlotBooked(mentorId, selectedDate, time)
            const isSelected = selectedSlot && selectedSlot.date === dateStr && selectedSlot.time === time

            return (
              <div
                key={time}
                className={`time-slot-card 
                  ${isAvailable ? "available" : ""} 
                  ${isBooked ? "booked" : ""} 
                  ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (view === "booking") {
                    isAvailable && !isBooked && handleSlotSelect(selectedDate, time)
                  } else {
                    !isBooked && toggleAvailability(selectedDate, time)
                  }
                }}
              >
                <span className="time-slot-time">{time}</span>
                <span className="time-slot-status">
                  {isBooked ? "Booked" : isAvailable ? (isSelected ? "Selected" : "Available") : "Unavailable"}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="schedule-manager">
        <div className="container">
          <div className="schedule-header">
            <h1>Schedule Manager</h1>

            {currentUser.role === "mentor" && (
              <div className="view-toggle">
                <button
                  className={`view-button ${view === "availability" ? "active" : ""}`}
                  onClick={() => setView("availability")}
                >
                  Manage Availability
                </button>
                <button
                  className={`view-button ${view === "sessions" ? "active" : ""}`}
                  onClick={() => setView("sessions")}
                >
                  Upcoming Sessions
                </button>
              </div>
            )}

            {currentUser.role === "apprentice" && (
              <div className="view-toggle">
                <button
                  className={`view-button ${view === "booking" ? "active" : ""}`}
                  onClick={() => setView("booking")}
                >
                  Book a Session
                </button>
                <button
                  className={`view-button ${view === "sessions" ? "active" : ""}`}
                  onClick={() => setView("sessions")}
                >
                  My Sessions
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Sessions View */}
          {view === "sessions" && (
            <div className="upcoming-sessions-container">
              <h2>Upcoming Sessions</h2>

              {upcomingSessions.length === 0 ? (
                <div className="no-sessions">
                  <p>You don't have any upcoming sessions.</p>
                  {currentUser.role === "apprentice" && (
                    <button className="btn btn-primary" onClick={() => setView("booking")}>
                      Book a Session
                    </button>
                  )}
                  {currentUser.role === "mentor" && (
                    <button className="btn btn-primary" onClick={() => setView("availability")}>
                      Update Availability
                    </button>
                  )}
                </div>
              ) : (
                <div className="sessions-grid">
                  {upcomingSessions.map((session) => {
                    const otherUser = users.find((user) =>
                      currentUser.role === "mentor" ? user.id === session.apprenticeId : user.id === session.mentorId,
                    )

                    return (
                      <motion.div
                        key={session.id}
                        className="session-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="session-status">
                          <span className={`status-badge ${session.status}`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>

                        <div className="session-details">
                          <h3>{session.topic}</h3>
                          <div className="session-with">
                            <img
                              src={otherUser?.profilePicture || "/placeholder.svg?height=50&width=50"}
                              alt={otherUser?.name}
                              className="user-avatar"
                            />
                            <div className="user-info">
                              <p className="user-name">{otherUser?.name}</p>
                              <p className="user-role">
                                {otherUser?.role.charAt(0).toUpperCase() + otherUser?.role.slice(1)}
                              </p>
                            </div>
                          </div>

                          <div className="session-time-info">
                            <div className="session-date">
                              <i className="calendar-icon">📅</i>
                              <span>{session.date}</span>
                            </div>
                            <div className="session-time">
                              <i className="clock-icon">🕒</i>
                              <span>{session.time}</span>
                            </div>
                          </div>

                          <p className="session-message">{session.message}</p>
                        </div>

                        <div className="session-actions">
                          {session.status === "pending" && currentUser.role === "mentor" && (
                            <>
                              <button className="btn btn-success" onClick={() => handleAcceptSession(session.id)}>
                                Accept
                              </button>
                              <button className="btn btn-danger" onClick={() => handleDeclineSession(session.id)}>
                                Decline
                              </button>
                            </>
                          )}

                          {session.status === "accepted" && <button className="btn btn-primary">Join Session</button>}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mentor Availability Management View */}
          {currentUser.role === "mentor" && view === "availability" && (
            <div className="availability-manager">
              <div className="calendar-controls">
                <div className="calendar-navigation">
                  {calendarView === "month" ? (
                    <>
                      <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                        &lt; Previous Month
                      </button>
                      <h2>{format(currentDate, "MMMM yyyy")}</h2>
                      <button className="calendar-nav-btn" onClick={goToNextMonth}>
                        Next Month &gt;
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="calendar-nav-btn" onClick={goToPreviousWeek}>
                        &lt; Previous Week
                      </button>
                      <h2>
                        {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} -{" "}
                        {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}
                      </h2>
                      <button className="calendar-nav-btn" onClick={goToNextWeek}>
                        Next Week &gt;
                      </button>
                    </>
                  )}
                </div>

                <div className="calendar-view-toggle">
                  <button
                    className={`view-button ${calendarView === "month" ? "active" : ""}`}
                    onClick={() => setCalendarView("month")}
                  >
                    Month
                  </button>
                  <button
                    className={`view-button ${calendarView === "week" ? "active" : ""}`}
                    onClick={() => setCalendarView("week")}
                  >
                    Week
                  </button>
                </div>
              </div>

              <div className="calendar-container">
                {calendarView === "month" ? renderMonthCalendar() : renderWeekCalendar()}
              </div>

              {calendarView === "month" && renderTimeSlots()}

              <div className="availability-legend">
                <div className="legend-item">
                  <div className="legend-color available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color booked"></div>
                  <span>Booked</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color"></div>
                  <span>Unavailable</span>
                </div>
              </div>

              <div className="availability-instructions">
                <h3>Instructions</h3>
                <p>
                  Click on a day to view and manage time slots. Your apprentices will only be able to book sessions
                  during your available times.
                </p>
                <ul>
                  <li>Click on any time slot to mark it as available</li>
                  <li>Click again to remove availability</li>
                  <li>Booked slots cannot be modified</li>
                </ul>
              </div>
            </div>
          )}

          {/* Apprentice Booking View */}
          {currentUser.role === "apprentice" && view === "booking" && (
            <div className="booking-manager">
              {!selectedMentor ? (
                <div className="no-mentor-selected">
                  <h2>Please select a mentor from the Mentors page</h2>
                  <button className="btn btn-primary" onClick={() => navigate("/mentors")}>
                    Browse Mentors
                  </button>
                </div>
              ) : (
                <div className="booking-container">
                  <div className="selected-mentor-info">
                    <div className="mentor-header">
                      <img
                        src={selectedMentor.profilePicture || "/placeholder.svg?height=80&width=80"}
                        alt={selectedMentor.name}
                        className="mentor-image"
                      />
                      <div className="mentor-info">
                        <h2>Booking a Session with {selectedMentor.name}</h2>
                        <div className="mentor-rating">
                          <span className="rating-stars">{"★".repeat(Math.floor(selectedMentor.rating || 0))}</span>
                          <span className="rating-number">{selectedMentor.rating || "No ratings"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="time-selection">
                    <h3>Select a Date & Time</h3>

                    <div className="calendar-controls">
                      <div className="calendar-navigation">
                        {calendarView === "month" ? (
                          <>
                            <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                              &lt; Previous Month
                            </button>
                            <h3>{format(currentDate, "MMMM yyyy")}</h3>
                            <button className="calendar-nav-btn" onClick={goToNextMonth}>
                              Next Month &gt;
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="calendar-nav-btn" onClick={goToPreviousWeek}>
                              &lt; Previous Week
                            </button>
                            <h3>
                              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} -{" "}
                              {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}
                            </h3>
                            <button className="calendar-nav-btn" onClick={goToNextWeek}>
                              Next Week &gt;
                            </button>
                          </>
                        )}
                      </div>

                      <div className="calendar-view-toggle">
                        <button
                          className={`view-button ${calendarView === "month" ? "active" : ""}`}
                          onClick={() => setCalendarView("month")}
                        >
                          Month
                        </button>
                        <button
                          className={`view-button ${calendarView === "week" ? "active" : ""}`}
                          onClick={() => setCalendarView("week")}
                        >
                          Week
                        </button>
                      </div>
                    </div>

                    <div className="calendar-container">
                      {calendarView === "month" ? renderMonthCalendar() : renderWeekCalendar()}
                    </div>

                    {calendarView === "month" && renderTimeSlots()}
                  </div>

                  {selectedSlot && (
                    <div className="session-form">
                      <h2>Session Details</h2>
                      <div className="form-group">
                        <label htmlFor="sessionTopic">Topic</label>
                        <input
                          type="text"
                          id="sessionTopic"
                          className="form-control"
                          placeholder="e.g., React Component Optimization"
                          value={sessionTopic}
                          onChange={(e) => setSessionTopic(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="sessionMessage">Message to Mentor</label>
                        <textarea
                          id="sessionMessage"
                          className="form-control"
                          placeholder="Describe what you'd like to discuss in this session..."
                          rows="4"
                          value={sessionMessage}
                          onChange={(e) => setSessionMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="session-summary">
                        <h3>Session Summary</h3>
                        <p>
                          <strong>Mentor:</strong> {selectedMentor?.name}
                        </p>
                        <p>
                          <strong>Date:</strong> {selectedSlot.date}
                        </p>
                        <p>
                          <strong>Time:</strong> {selectedSlot.time}
                        </p>
                      </div>

                      <button
                        className="btn btn-primary btn-block"
                        onClick={requestSession}
                        disabled={!sessionTopic || !sessionMessage || loading}
                      >
                        {loading ? "Requesting..." : "Request Session"}
                      </button>

                      {showConfirmation && (
                        <div className="confirmation-message">
                          <p>Session request sent successfully! The mentor will be notified.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default ScheduleManager
