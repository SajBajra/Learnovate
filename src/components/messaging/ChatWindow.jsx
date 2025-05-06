"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "../common/PageTransition"
import "./ChatWindow.css"

const ChatWindow = ({ currentUser, users, messages, setMessages, simulateLoading }) => {
  const { userId } = useParams()
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingEffect, setTypingEffect] = useState(false)
  const messagesEndRef = useRef(null)

  // Get the other user
  const otherUser = users.find((user) => user.id === Number.parseInt(userId))

  // Filter messages between current user and other user
  const chatMessages = messages.filter(
    (message) =>
      (message.senderId === currentUser.id && message.receiverId === Number.parseInt(userId)) ||
      (message.senderId === Number.parseInt(userId) && message.receiverId === currentUser.id),
  )

  // Sort messages by timestamp
  chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Simulate typing effect for received messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1]
      if (lastMessage.senderId === Number.parseInt(userId)) {
        setTypingEffect(true)
        const timer = setTimeout(() => {
          setTypingEffect(false)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [chatMessages, userId])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setLoading(true)

    // Simulate API call
    simulateLoading(() => {
      const newMsg = {
        id: Date.now(),
        senderId: currentUser.id,
        receiverId: Number.parseInt(userId),
        content: newMessage,
        timestamp: new Date().toISOString(),
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
      setLoading(false)
    }, 500)
  }

  if (!otherUser) {
    return (
      <PageTransition>
        <div className="container">
          <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
            <h2>User not found</h2>
            <p>The user you're trying to message doesn't exist.</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <PageTransition>
      <div className="chat-window">
        <div className="container">
          <motion.div
            className="chat-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="chat-header">
              <img
                src={otherUser.profilePicture || "/placeholder.svg"}
                alt={otherUser.name}
                className="chat-user-image"
              />
              <div className="chat-user-info">
                <h2>{otherUser.name}</h2>
                <p className="user-role">{otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)}</p>
              </div>
            </div>

            <motion.div className="chat-messages" variants={containerVariants} initial="hidden" animate="visible">
              {chatMessages.length > 0 ? (
                <>
                  <AnimatePresence>
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`message ${message.senderId === currentUser.id ? "sent" : "received"}`}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        layout
                      >
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </motion.div>
                    ))}
                    {typingEffect && (
                      <motion.div
                        className="message received typing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </motion.div>

            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="form-control"
                disabled={loading}
              />
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Sending..." : "Send"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default ChatWindow
