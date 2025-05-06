"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import PageTransition from "../common/PageTransition"
import "./Pricing.css"

const Pricing = () => {
  const [annual, setAnnual] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [expanded, setExpanded] = useState(null)

  // Pricing plans data
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started with mentorship",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        { text: "3 mentorship sessions per month", included: true },
        { text: "Access to community forums", included: true },
        { text: "Basic profile customization", included: true },
        { text: "Email support", included: true },
        { text: "Session scheduling", included: true },
        { text: "Progress tracking", included: false },
        { text: "Advanced matching algorithm", included: false },
        { text: "Priority booking with top mentors", included: false },
        { text: "Personalized learning path", included: false },
        { text: "Direct messaging with mentors", included: false },
      ],
      popular: false,
      cta: "Get Started",
      color: "gray",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For serious professionals seeking growth",
      price: {
        monthly: 29,
        annual: 19,
      },
      features: [
        { text: "10 mentorship sessions per month", included: true },
        { text: "Access to community forums", included: true },
        { text: "Full profile customization", included: true },
        { text: "Priority email support", included: true },
        { text: "Advanced session scheduling", included: true },
        { text: "Progress tracking", included: true },
        { text: "Advanced matching algorithm", included: true },
        { text: "Priority booking with top mentors", included: false },
        { text: "Personalized learning path", included: false },
        { text: "Direct messaging with mentors", included: false },
      ],
      popular: true,
      cta: "Start Pro Plan",
      color: "blue",
    },
    {
      id: "premium",
      name: "Premium",
      description: "For those who want the ultimate mentorship experience",
      price: {
        monthly: 79,
        annual: 59,
      },
      features: [
        { text: "Unlimited mentorship sessions", included: true },
        { text: "Access to community forums", included: true },
        { text: "Full profile customization", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Advanced session scheduling", included: true },
        { text: "Progress tracking", included: true },
        { text: "Advanced matching algorithm", included: true },
        { text: "Priority booking with top mentors", included: true },
        { text: "Personalized learning path", included: true },
        { text: "Direct messaging with mentors", included: true },
      ],
      popular: false,
      cta: "Start Premium Plan",
      color: "purple",
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "Can I switch plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, all paid plans come with a 14-day free trial. You won't be charged until the trial period ends, and you can cancel anytime before then.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and in some regions, we support Apple Pay and Google Pay.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with your experience, contact our support team within 30 days of your purchase for a full refund.",
    },
    {
      question: "Do you offer discounts for students or non-profits?",
      answer:
        "Yes, we offer special pricing for students, educational institutions, and non-profit organizations. Please contact our support team with verification of your status to apply for these discounts.",
    },
  ]

  // Intersection observer hooks for animations
  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [faqRef, faqInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const toggleFaq = (index) => {
    setExpanded(expanded === index ? null : index)
  }

  return (
    <PageTransition>
      <div className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="container">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Choose the perfect plan for your mentorship journey
            </motion.p>

            <motion.div
              className="pricing-toggle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className={!annual ? "active" : ""}>Monthly</span>
              <label className="toggle">
                <input type="checkbox" checked={annual} onChange={() => setAnnual(!annual)} />
                <span className="slider"></span>
              </label>
              <span className={annual ? "active" : ""}>
                Annual <span className="save-badge">Save 20%</span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="pricing-plans" ref={pricingRef}>
          <div className="container">
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className={`plan-card ${plan.popular ? "popular" : ""} ${selectedPlan === plan.id ? "selected" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{annual ? plan.price.annual : plan.price.monthly}</span>
                    <span className="period">/ month</span>
                  </div>
                  {annual && plan.price.annual > 0 && (
                    <div className="annual-savings">
                      <p>Save ${(plan.price.monthly * 12 - plan.price.annual * 12).toFixed(0)} per year</p>
                    </div>
                  )}
                  <ul className="plan-features">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={feature.included ? "included" : "excluded"}>
                        <span className="feature-icon">{feature.included ? "✓" : "×"}</span>
                        <span className="feature-text">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="plan-cta">
                    <Link to="/register" className={`btn btn-${plan.color}`}>
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="pricing-testimonials" ref={testimonialsRef}>
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              What Our Members Say
            </motion.h2>
            <div className="testimonials-grid">
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="testimonial-content">
                  <p>
                    "The Pro plan was exactly what I needed to accelerate my career. The advanced matching algorithm
                    connected me with the perfect mentor who helped me land a senior developer role within 3 months."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                    alt="James Wilson"
                    className="author-image"
                  />
                  <div className="author-info">
                    <h4>James Wilson</h4>
                    <p>Senior Frontend Developer</p>
                    <div className="plan-badge pro">Pro Plan</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="testimonial-content">
                  <p>
                    "I started with the Free plan to test the waters, and was so impressed that I upgraded to Premium
                    within a week. The unlimited sessions and personalized learning path have been game-changers for my
                    career."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                    alt="Emily Rodriguez"
                    className="author-image"
                  />
                  <div className="author-info">
                    <h4>Emily Rodriguez</h4>
                    <p>Product Manager</p>
                    <div className="plan-badge premium">Premium Plan</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="testimonial-content">
                  <p>
                    "As a startup founder, the Premium plan has been invaluable. The ability to message mentors directly
                    and get quick feedback on my ideas has helped me navigate countless challenges."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                    alt="David Chen"
                    className="author-image"
                  />
                  <div className="author-info">
                    <h4>David Chen</h4>
                    <p>Startup Founder</p>
                    <div className="plan-badge premium">Premium Plan</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pricing-faq" ref={faqRef}>
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="faq-container">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={`faq-item ${expanded === index ? "expanded" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button className="faq-question" onClick={() => toggleFaq(index)}>
                    {faq.question}
                    <span className="faq-icon">{expanded === index ? "−" : "+"}</span>
                  </button>
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pricing-cta">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Ready to Start Your Mentorship Journey?</h2>
              <p>
                Join thousands of professionals who are accelerating their careers with personalized mentorship. Start
                with our 14-day free trial.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn-cta">
                  Get Started Now
                </Link>
              </motion.div>
              <div className="guarantee">
                <span className="guarantee-icon">🛡️</span>
                <span className="guarantee-text">30-day money-back guarantee</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Pricing
