"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import PageTransition from "../common/PageTransition"
import AnimatedCounter from "../common/AnimatedCounter"
import "./Home.css"
// Import the FeedbackForm component
import FeedbackForm from "./FeedbackForm"

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [expanded, setExpanded] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Frontend Developer",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      quote:
        "MentorLink helped me find an amazing mentor who guided me through learning React. I landed my dream job within 3 months! The personalized attention and structured approach made all the difference.",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Senior UX Designer",
      company: "DesignHub",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      quote:
        "Being a mentor on MentorLink has been incredibly rewarding. I've helped several apprentices grow their skills while improving my own leadership abilities. The platform makes it easy to connect and schedule sessions.",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Data Scientist",
      company: "DataViz",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      quote:
        "The structured mentorship program at MentorLink helped me transition from academia to industry. My mentor provided invaluable insights about real-world applications of machine learning that you can't learn from books.",
    },
  ]

  // Mentor categories data
  const categories = [
    {
      id: 1,
      name: "Software Development",
      icon: "💻",
      image:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1812&q=80",
      mentorCount: 245,
      description: "Expert guidance in web, mobile, and software engineering",
      skills: ["JavaScript", "Python", "React", "Node.js", "Java", "Cloud Computing"],
    },
    {
      id: 2,
      name: "Design & UX",
      icon: "🎨",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      mentorCount: 178,
      description: "Learn UI/UX design, graphic design, and product design",
      skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Product Design", "Design Systems"],
    },
    {
      id: 3,
      name: "Data Science & AI",
      icon: "📊",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      mentorCount: 132,
      description: "Master data science, machine learning, and AI technologies",
      skills: ["Python", "Machine Learning", "Data Analysis", "Deep Learning", "NLP", "Computer Vision"],
    },
    {
      id: 4,
      name: "Product Management",
      icon: "🚀",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      mentorCount: 98,
      description: "Learn product strategy, roadmapping, and execution",
      skills: ["Product Strategy", "User Research", "Agile", "Roadmapping", "Go-to-Market", "Analytics"],
    },
    {
      id: 5,
      name: "Marketing & Growth",
      icon: "📈",
      image:
        "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      mentorCount: 87,
      description: "Develop marketing strategies and growth tactics",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Analytics", "Growth Hacking"],
    },
    {
      id: 6,
      name: "Leadership & Management",
      icon: "👥",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      mentorCount: 112,
      description: "Develop leadership skills and management techniques",
      skills: ["Team Management", "Leadership", "Communication", "Strategy", "Conflict Resolution", "Coaching"],
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "How does MentorLink work?",
      answer:
        "MentorLink connects mentors and apprentices based on skills, goals, and availability. Create a profile, browse mentors, request sessions, and start learning. Our platform handles scheduling, communication, and feedback.",
    },
    {
      question: "How much does it cost?",
      answer:
        "MentorLink is currently free for all users during our beta period. In the future, we plan to introduce premium features while maintaining core functionality free of charge.",
    },
    {
      question: "How are mentors vetted?",
      answer:
        "All mentors go through a verification process that includes skill assessment, background check, and a review of professional experience. We also maintain a rating system to ensure quality mentorship.",
    },
    {
      question: "Can I be both a mentor and an apprentice?",
      answer:
        "Yes! Many of our users are both mentors and apprentices. You can create separate profiles for each role and switch between them as needed.",
    },
    {
      question: "What if I'm not satisfied with my mentor?",
      answer:
        "If you're not satisfied with your mentorship experience, you can end the relationship at any time and find a new mentor. We also encourage providing feedback to help mentors improve.",
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Intersection observer hooks for animations
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const toggleFaq = (index) => {
    setExpanded(expanded === index ? null : index)
  }

  return (
    <PageTransition>
      <div className="home">
        {/* Hero Section - FIXED */}
        <section className="hero-fixed">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
          <div className="container hero-container-fixed">
            <motion.div
              className="hero-content-fixed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="hero-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="badge-icon">⭐</span>
                <span className="badge-text">Trusted by 10,000+ professionals</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Find Your Perfect <span className="gradient-text">Mentor</span> and Accelerate Your Career
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                MentorLink connects you with industry experts who've been where you want to go. Get personalized
                guidance, actionable feedback, and the accountability you need to reach your goals faster.
              </motion.p>

              <motion.div
                className="hero-buttons-fixed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a href="/register" className="btn-fixed btn-primary-fixed">
                  Find a Mentor
                </a>
                <a href="/register" className="btn-fixed btn-outline-fixed">
                  Become a Mentor
                </a>
              </motion.div>

              <motion.div
                className="hero-stats-fixed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="hero-stat-fixed">
                  <span className="hero-stat-number">500+</span>
                  <span className="hero-stat-label">Expert Mentors</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-fixed">
                  <span className="hero-stat-number">40+</span>
                  <span className="hero-stat-label">Skill Categories</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-fixed">
                  <span className="hero-stat-number">95%</span>
                  <span className="hero-stat-label">Success Rate</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-image-fixed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="hero-image-container">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Mentorship Session"
                  className="hero-img-main"
                />

                <motion.div
                  className="floating-card card-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="floating-card-icon">✅</div>
                  <div className="floating-card-content">
                    <h4>Session Completed</h4>
                    <p>Great progress on your React project!</p>
                  </div>
                </motion.div>

                <motion.div
                  className="floating-card card-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <div className="floating-card-icon">🚀</div>
                  <div className="floating-card-content">
                    <h4>Goal Achieved</h4>
                    <p>Frontend Developer role at Google</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats" ref={statsRef}>
          <div className="container">
            <div className="stats-grid">
              <motion.div
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="stat-number">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="stat-label">Active Mentors</div>
              </motion.div>
              <motion.div
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="stat-number">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <div className="stat-label">Mentorship Sessions</div>
              </motion.div>
              <motion.div
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="stat-number">
                  <AnimatedCounter end={95} suffix="%" />
                </div>
                <div className="stat-label">Satisfaction Rate</div>
              </motion.div>
              <motion.div
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="stat-number">
                  <AnimatedCounter end={40} suffix="+" />
                </div>
                <div className="stat-label">Skill Categories</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mentor Categories Section - NEW */}
        <section className="categories" ref={categoriesRef}>
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Explore Mentor Categories
            </motion.h2>

            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Find expert mentors across a wide range of professional fields and specialties
            </motion.p>

            <div className="categories-grid">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className={`category-card ${activeCategory === category.id ? "active" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                >
                  <div className="category-image">
                    <img src={category.image || "/placeholder.svg"} alt={category.name} />
                    <div className="category-overlay"></div>
                    <div className="category-icon">{category.icon}</div>
                  </div>

                  <div className="category-content">
                    <div className="category-header">
                      <h3>{category.name}</h3>
                      <span className="category-count">{category.mentorCount} mentors</span>
                    </div>

                    <p className="category-description">{category.description}</p>

                    <div className="category-skills">
                      {category.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                      {category.skills.length > 3 && (
                        <span className="skill-tag more-skills">+{category.skills.length - 3} more</span>
                      )}
                    </div>

                    <div className="category-footer">
                      <Link to="/mentors" className="btn btn-sm btn-outline">
                        Browse Mentors
                      </Link>
                      <div className="category-expand">
                        {activeCategory === category.id ? "Less Info" : "More Info"}
                        <span className="expand-icon">{activeCategory === category.id ? "−" : "+"}</span>
                      </div>
                    </div>
                  </div>

                  {activeCategory === category.id && (
                    <motion.div
                      className="category-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4>Popular Skills</h4>
                      <div className="category-skills-full">
                        {category.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="category-action">
                        <Link to="/mentors" className="btn btn-primary">
                          Find {category.name} Mentors
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="categories-cta">
              <Link to="/mentors" className="btn btn-primary btn-lg">
                Explore All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" ref={featuresRef}>
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Why Choose MentorLink
            </motion.h2>
            <div className="features-grid">
              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="feature-icon">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                    alt="Personalized Matching"
                  />
                </div>
                <h3>Personalized Matching</h3>
                <p>
                  Our intelligent algorithm connects you with mentors who match your specific goals, learning style, and
                  career aspirations.
                </p>
              </motion.div>
              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="feature-icon">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                    alt="Flexible Scheduling"
                  />
                </div>
                <h3>Flexible Scheduling</h3>
                <p>
                  Book sessions that fit your calendar with our easy-to-use scheduling system. Learn at your own pace
                  and on your own time.
                </p>
              </motion.div>
              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="feature-icon">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                    alt="Progress Tracking"
                  />
                </div>
                <h3>Progress Tracking</h3>
                <p>
                  Monitor your growth with detailed progress reports, skill assessments, and milestone tracking to
                  celebrate your achievements.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works" ref={howItWorksRef}>
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              How It Works
            </motion.h2>
            <div className="steps-container">
              <div className="steps-timeline"></div>
              <motion.div
                className="step"
                initial={{ opacity: 0, x: -50 }}
                animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Create Your Profile</h3>
                  <p>
                    Sign up as a mentor or apprentice and build a comprehensive profile showcasing your skills,
                    experience, and goals.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="step"
                initial={{ opacity: 0, x: 50 }}
                animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Find Your Match</h3>
                  <p>
                    Browse our curated list of mentors or apprentices, filter by expertise, and connect with
                    professionals who align with your needs.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="step"
                initial={{ opacity: 0, x: -50 }}
                animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Schedule Sessions</h3>
                  <p>
                    Book one-on-one sessions at times that work for both of you using our intuitive scheduling system.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="step"
                initial={{ opacity: 0, x: 50 }}
                animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Learn & Grow</h3>
                  <p>
                    Attend sessions, receive personalized guidance, track your progress, and accelerate your
                    professional development.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">Success Stories</h2>
            <div className="testimonials-carousel">
              <div className="testimonials-track">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    className={`testimonial-card ${index === activeTestimonial ? "active" : ""}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: index === activeTestimonial ? 1 : 0,
                      scale: index === activeTestimonial ? 1 : 0.8,
                      x: `${(index - activeTestimonial) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="testimonial-content">
                      <div className="quote-icon">"</div>
                      <p>{testimonial.quote}</p>
                    </div>
                    <div className="testimonial-author">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="author-image"
                      />
                      <div className="author-info">
                        <h4>{testimonial.name}</h4>
                        <p>
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === activeTestimonial ? "active" : ""}`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-container">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={`faq-item ${expanded === index ? "expanded" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button className="faq-question" onClick={() => toggleFaq(index)}>
                    {faq.question}
                    <span className="faq-icon">{expanded === index ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {expanded === index && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Ready to Accelerate Your Growth?</h2>
              <p>
                Join MentorLink today and take the next step in your professional development journey with personalized
                mentorship.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn-cta">
                  Sign Up Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Add Feedback Form */}
        <FeedbackForm />
      </div>
    </PageTransition>
  )
}

export default Home
