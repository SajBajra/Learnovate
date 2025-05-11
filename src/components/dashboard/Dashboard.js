"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { format } from "date-fns"
import PageTransition from "../common/PageTransition"
import AnimatedCounter from "../common/AnimatedCounter"
import "./Dashboard.css"

const Dashboard = ({ currentUser, sessionRequests, users }) => {
  // Filter session requests based on user role
  const userRequests = sessionRequests.filter((request) =>
    currentUser.role === "mentor" ? request.mentorId === currentUser.id : request.apprenticeId === currentUser.id,
  )

  // Get pending requests count
  const pendingRequests = userRequests.filter((request) => request.status === "pending").length

  // Get upcoming sessions (accepted requests with future dates)
  const upcomingSessions = userRequests.filter((request) => request.status === "accepted")

  // Get user stats
  const stats = {
    completedSessions: userRequests.filter((request) => request.status === "completed").length,
    pendingRequests,
    upcomingSessions: upcomingSessions.length,
  }

  // Get recent activity
  const recentActivity = userRequests.slice(0, 3)

  // Prepare chart data
  const sessionsByStatus = [
    { name: "Completed", value: stats.completedSessions, color: "#10b981" },
    { name: "Pending", value: stats.pendingRequests, color: "#f59e0b" },
    { name: "Upcoming", value: stats.upcomingSessions, color: "#3b82f6" },
  ]

  // Activity timeline data
  const activityData = userRequests
    .map((request) => ({
      date: new Date(request.createdAt).getTime(),
      status: request.status,
      value: 1,
    }))
    .sort((a, b) => a.date - b.date)

  // Group by month for the area chart
  const monthlyActivity = activityData.reduce((acc, item) => {
    const month = format(item.date, "MMM")
    if (!acc[month]) {
      acc[month] = { name: month, completed: 0, pending: 0, accepted: 0 }
    }
    acc[month][item.status === "completed" ? "completed" : item.status === "pending" ? "pending" : "accepted"]++
    return acc
  }, {})

  const monthlyActivityArray = Object.values(monthlyActivity)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <PageTransition>
      <div className="dashboard">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-header"
          >
            <div>
              <h1>Welcome, {currentUser.name}!</h1>
              <p className="role-badge">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
            </div>
            <div className="dashboard-date">
              <p>{format(new Date(), "EEEE, MMMM do, yyyy")}</p>
            </div>
          </motion.div>

          <motion.div className="dashboard-stats" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="stat-card" variants={itemVariants}>
              <h3>Completed Sessions</h3>
              <p className="stat-number">
                <AnimatedCounter end={stats.completedSessions} />
              </p>
            </motion.div>
            <motion.div className="stat-card" variants={itemVariants}>
              <h3>Pending Requests</h3>
              <p className="stat-number">
                <AnimatedCounter end={stats.pendingRequests} />
              </p>
            </motion.div>
            <motion.div className="stat-card" variants={itemVariants}>
              <h3>Upcoming Sessions</h3>
              <p className="stat-number">
                <AnimatedCounter end={stats.upcomingSessions} />
              </p>
            </motion.div>
          </motion.div>

          <div className="dashboard-grid">
            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2>Session Overview</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sessionsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sessionsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sessions`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2>Activity Timeline</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyActivityArray} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="accepted"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                {currentUser.role === "apprentice" && (
                  <>
                    <Link to="/mentors" className="btn btn-primary">
                      Find Mentors
                    </Link>
                    <Link to="/requests" className="btn btn-outline">
                      View My Requests
                    </Link>
                  </>
                )}
                {currentUser.role === "mentor" && (
                  <>
                    <Link to="/requests" className="btn btn-primary">
                      View Session Requests
                      {pendingRequests > 0 && <span className="badge badge-light">{pendingRequests}</span>}
                    </Link>
                    <Link to="/profile" className="btn btn-outline">
                      Update Availability
                    </Link>
                  </>
                )}
                {currentUser.role === "admin" && (
                  <>
                    <Link to="/admin/users" className="btn btn-primary">
                      Manage Users
                    </Link>
                    <Link to="/admin/feedback" className="btn btn-outline">
                      View Feedback
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2>Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <ul className="activity-list">
                  {recentActivity.map((activity, index) => {
                    const otherUser = users.find((user) =>
                      currentUser.role === "mentor" ? user.id === activity.apprenticeId : user.id === activity.mentorId,
                    )

                    return (
                      <motion.li
                        key={activity.id}
                        className="activity-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <div className={`activity-icon status-${activity.status}`}>
                          {activity.status === "pending" && "⏳"}
                          {activity.status === "accepted" && "✅"}
                          {activity.status === "completed" && "🎓"}
                          {activity.status === "rejected" && "❌"}
                        </div>
                        <div className="activity-content">
                          <p>
                            <strong>{activity.topic}</strong> with <strong>{otherUser?.name}</strong>
                          </p>
                          <p className="activity-date">
                            {activity.date} at {activity.time}
                          </p>
                          <p className={`activity-status status-${activity.status}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </p>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              ) : (
                <p className="no-activity">No recent activity.</p>
              )}
            </motion.div>
          </div>

          {upcomingSessions.length > 0 && (
            <motion.div
              className="dashboard-card upcoming-sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2>Upcoming Sessions</h2>
              <ul className="session-list">
                {upcomingSessions.map((session, index) => {
                  const otherUser = users.find((user) =>
                    currentUser.role === "mentor" ? user.id === session.apprenticeId : user.id === session.mentorId,
                  )

                  return (
                    <motion.li
                      key={session.id}
                      className="session-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <div className="session-details">
                        <h3>{session.topic}</h3>
                        <p>
                          with <strong>{otherUser?.name}</strong>
                        </p>
                        <p className="session-time">
                          <span className="session-date">{session.date}</span> at{" "}
                          <span className="session-hour">{session.time}</span>
                        </p>
                      </div>
                      <div className="session-actions">
                        <Link to={`/messages/${otherUser?.id}`} className="btn btn-sm btn-outline">
                          Message
                        </Link>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard
