"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AnimatePresence } from "framer-motion"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./components/pages/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/dashboard/Dashboard"
import Profile from "./components/profile/Profile"
import MentorDirectory from "./components/mentors/MentorDirectory"
import SessionRequests from "./components/sessions/SessionRequests"
import ChatWindow from "./components/messaging/ChatWindow"
import AdminPanel from "./components/admin/AdminPanel"
import AdminUsers from "./components/admin/AdminUsers"
import AdminFeedback from "./components/admin/AdminFeedback"
import NotFound from "./components/pages/NotFound"
import LoadingScreen from "./components/common/LoadingScreen"
import ScheduleManager from "./components/scheduling/ScheduleManager"

// Mock Data
import { mockUsers, mockSessionRequests, mockFeedback, mockMessages } from "./data/mockData"

// Animation wrapper
const AnimatedRoutes = ({ children, isAuthenticated, currentUser }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Application data state
  const [users, setUsers] = useState(mockUsers)
  const [sessionRequests, setSessionRequests] = useState(mockSessionRequests)
  const [feedback, setFeedback] = useState(mockFeedback)
  const [messages, setMessages] = useState(mockMessages)

  // Check if user is authenticated
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />
  }

  // Check if user is admin
  const AdminRoute = ({ children }) => {
    return isAuthenticated && currentUser?.role === "admin" ? children : <Navigate to="/dashboard" />
  }

  // Simulate loading for better UX
  const simulateLoading = (callback, duration = 800) => {
    setIsLoading(true)
    setTimeout(() => {
      callback()
      setIsLoading(false)
    }, duration)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          setIsAuthenticated={setIsAuthenticated}
          setCurrentUser={setCurrentUser}
        />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setCurrentUser={setCurrentUser}
                    users={users}
                    simulateLoading={simulateLoading}
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <Register
                    setIsAuthenticated={setIsAuthenticated}
                    setCurrentUser={setCurrentUser}
                    users={users}
                    setUsers={setUsers}
                    simulateLoading={simulateLoading}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard currentUser={currentUser} sessionRequests={sessionRequests} users={users} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      users={users}
                      setUsers={setUsers}
                      simulateLoading={simulateLoading}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mentors"
                element={
                  <PrivateRoute>
                    <MentorDirectory
                      users={users}
                      currentUser={currentUser}
                      sessionRequests={sessionRequests}
                      setSessionRequests={setSessionRequests}
                      simulateLoading={simulateLoading}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <PrivateRoute>
                    <SessionRequests
                      currentUser={currentUser}
                      sessionRequests={sessionRequests}
                      setSessionRequests={setSessionRequests}
                      users={users}
                      setFeedback={setFeedback}
                      simulateLoading={simulateLoading}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages/:userId"
                element={
                  <PrivateRoute>
                    <ChatWindow
                      currentUser={currentUser}
                      users={users}
                      messages={messages}
                      setMessages={setMessages}
                      simulateLoading={simulateLoading}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <ScheduleManager
                      currentUser={currentUser}
                      users={users}
                      sessionRequests={sessionRequests}
                      setSessionRequests={setSessionRequests}
                      simulateLoading={simulateLoading}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel feedback={feedback} sessionRequests={sessionRequests} users={users} />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers users={users} setUsers={setUsers} simulateLoading={simulateLoading} />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <AdminRoute>
                    <AdminFeedback feedback={feedback} users={users} />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App
