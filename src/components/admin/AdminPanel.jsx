"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import PageTransition from "../common/PageTransition"
import AnimatedCounter from "../common/AnimatedCounter"
import "./Admin.css"

const AdminPanel = ({ feedback, sessionRequests, users }) => {
  // Calculate statistics
  const totalUsers = users.length
  const totalMentors = users.filter((user) => user.role === "mentor").length
  const totalApprentices = users.filter((user) => user.role === "apprentice").length
  const totalSessions = sessionRequests.length
  const completedSessions = sessionRequests.filter((req) => req.status === "completed").length
  const pendingSessions = sessionRequests.filter((req) => req.status === "pending").length
  const acceptedSessions = sessionRequests.filter((req) => req.status === "accepted").length
  const averageRating =
    feedback.length > 0 ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1) : 0

  // Prepare chart data
  const sessionStatusData = [
    { name: "Completed", value: completedSessions, color: "#10b981" },
    { name: "Pending", value: pendingSessions, color: "#f59e0b" },
    { name: "Accepted", value: acceptedSessions, color: "#3b82f6" },
  ]

  const userRoleData = [
    { name: "Mentors", value: totalMentors, color: "#3b82f6" },
    { name: "Apprentices", value: totalApprentices, color: "#f59e0b" },
    { name: "Admins", value: users.filter((user) => user.role === "admin").length, color: "#6366f1" },
  ]

  // Top skills data
  const skillsData = users
    .filter((user) => user.skills && user.skills.length > 0)
    .flatMap((user) => user.skills)
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {})

  const topSkills = Object.entries(skillsData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

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
      <div className="admin-panel">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Admin Dashboard
          </motion.h1>

          <motion.div className="admin-stats" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="admin-stat-card" variants={itemVariants}>
              <h3>Total Users</h3>
              <p className="stat-number">
                <AnimatedCounter end={totalUsers} />
              </p>
            </motion.div>
            <motion.div className="admin-stat-card" variants={itemVariants}>
              <h3>Total Sessions</h3>
              <p className="stat-number">
                <AnimatedCounter end={totalSessions} />
              </p>
            </motion.div>
            <motion.div className="admin-stat-card" variants={itemVariants}>
              <h3>Completion Rate</h3>
              <p className="stat-number">
                <AnimatedCounter
                  end={totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0}
                  suffix="%"
                  decimals={1}
                />
              </p>
            </motion.div>
            <motion.div className="admin-stat-card" variants={itemVariants}>
              <h3>Average Rating</h3>
              <p className="stat-number">
                <AnimatedCounter end={Number.parseFloat(averageRating)} decimals={1} suffix="/5" />
              </p>
            </motion.div>
          </motion.div>

          <div className="admin-dashboard-grid">
            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2>User Distribution</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2>Session Status</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sessionStatusData.map((entry, index) => (
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
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2>Top Skills</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topSkills}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Users with skill" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2>Quick Actions</h2>
              <div className="admin-actions">
                <Link to="/admin/users" className="admin-action-card">
                  <div className="admin-action-icon">👥</div>
                  <div className="admin-action-content">
                    <h3>Manage Users</h3>
                    <p>View, edit, and manage all users on the platform</p>
                  </div>
                </Link>
                <Link to="/admin/feedback" className="admin-action-card">
                  <div className="admin-action-icon">⭐</div>
                  <div className="admin-action-content">
                    <h3>View Feedback</h3>
                    <p>Review feedback submitted by apprentices about their mentors</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="admin-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2>Admin Information</h2>
            <p>
              As an admin, you have access to manage all aspects of the MentorLink platform. Use the tools above to
              ensure the platform runs smoothly and users have a positive experience.
            </p>
            <p>
              For any technical issues or questions, please contact the development team at
              <a href="mailto:dev@mentorlink.com"> dev@mentorlink.com</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AdminPanel
