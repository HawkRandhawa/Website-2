'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import AOS from 'aos'
import 'aos/dist/aos.css'
import {
  FaBolt,
  FaHome,
  FaLightbulb,
  FaPlug,
  FaShieldAlt,
  FaWrench,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaEdit,
  FaMapPin,
  FaBlog,
  FaExclamationTriangle,
  FaTools,
  FaUser,
  FaLocationArrow
} from 'react-icons/fa'



// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Essential Electrical Safety Tips for Homeowners",
    excerpt: "Learn the most important electrical safety practices to protect your family and property.",
    content: `
      Electrical safety should be a top priority for every homeowner. Here are essential tips to keep your family safe:

      **1. Regular Inspections**
      Have your electrical system inspected by a professional every 3-5 years, or immediately if you notice any warning signs.

      **2. Know the Warning Signs**
      - Flickering lights
      - Warm outlets or switch plates
      - Burning smell
      - Frequent circuit breaker trips
      - Mild electrical shocks

      **3. Water and Electricity Don't Mix**
      Never use electrical devices near water or with wet hands. Install GFCI outlets in bathrooms, kitchens, and outdoor areas.

      **4. Don't Overload Circuits**
      Avoid using multiple high-wattage appliances on the same circuit. Use power strips with surge protection.

      **5. Replace Old Wiring**
      Homes over 40 years old may need rewiring. Aluminum wiring and knob-and-tube systems should be updated.
    `,
    icon: <FaShieldAlt className="text-4xl" />,
    date: "January 15, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "When to Call a Professional Electrician",
    excerpt: "Understand which electrical tasks require professional expertise and which you can safely handle yourself.",
    content: `
      While some electrical tasks can be DIY projects, many require professional expertise for safety and compliance:

      **Call a Professional For:**
      - Installing new circuits or outlets
      - Electrical panel upgrades
      - Whole-house rewiring
      - Any work requiring permits
      - Troubleshooting electrical problems
      - Installing ceiling fans or chandeliers

      **Safe DIY Tasks:**
      - Replacing light bulbs
      - Resetting circuit breakers
      - Testing GFCI outlets
      - Replacing outlet covers

      **Why Choose Professionals?**
      - Proper training and licensing
      - Insurance coverage
      - Code compliance
      - Safety first approach
      - Warranty on work performed

      Always prioritize safety over cost savings when it comes to electrical work.
    `,
    icon: <FaTools className="text-4xl" />,
    date: "January 10, 2025",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Electrical Maintenance Guide: Keeping Your System Running Smoothly",
    excerpt: "Regular maintenance tips to extend the life of your electrical system and prevent costly repairs.",
    content: `
      Regular electrical maintenance can prevent problems and extend your system's lifespan:

      **Monthly Checks:**
      - Test GFCI outlets monthly
      - Check for loose outlet covers
      - Look for frayed cords
      - Ensure smoke detectors work

      **Annual Maintenance:**
      - Professional electrical inspection
      - Clean electrical panels
      - Check outdoor lighting
      - Test emergency generators

      **Signs of Electrical Problems:**
      - Lights dimming when appliances start
      - Outlets not working
      - Circuit breakers tripping frequently
      - Electrical burning smell

      **Energy Efficiency Tips:**
      - Switch to LED bulbs
      - Install programmable thermostats
      - Use power strips to eliminate phantom loads
      - Consider whole-house surge protection

      Preventive maintenance is always less expensive than emergency repairs!
    `,
    icon: <FaWrench className="text-4xl" />,
    date: "January 5, 2025",
    readTime: "6 min read"
  }
]

// Service areas for map
const serviceAreas = [
  { name: 'Fresno', lat: 36.7468, lng: -119.7726, customers: 45 },
  { name: 'Sanger', lat: 36.7081, lng: -119.5559, customers: 12 },
  { name: 'Fowler', lat: 36.6302, lng: -119.6790, customers: 8 },
  { name: 'Clovis', lat: 36.8252, lng: -119.7029, customers: 32 },
  { name: 'Selma', lat: 36.5702, lng: -119.6120, customers: 15 },
  { name: 'Madera', lat: 36.9613, lng: -120.0607, customers: 18 }
]

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    problem: '',
    image: null as File | null
  })


  const [isClient, setIsClient] = useState(false)

  // Review submission form state
  const [reviewData, setReviewData] = useState({
    name: '',
    location: '',
    rating: 5,
    review: '',
    serviceUsed: ''
  })


  // All reviews (default + submitted) with maximum of 15
  const [allReviews, setAllReviews] = useState([
    {
      name: "Sarah Johnson",
      location: "Downtown",
      rating: 5,
      review: "Excellent service! They fixed our electrical issues quickly and professionally. Highly recommend Deep Spark Electric for any electrical work."
    },
    {
      name: "Mike Chen",
      location: "Suburbs",
      rating: 5,
      review: "Outstanding work on our kitchen renovation electrical. Clean, efficient, and very knowledgeable. Will definitely use again."
    },
    {
      name: "Emily Rodriguez",
      location: "Westside",
      rating: 5,
      review: "Emergency call on a Sunday and they came out the same day! Professional, courteous, and fair pricing. Thank you!"
    }
  ])

  // Current slide index for carousel
  const [currentSlide, setCurrentSlide] = useState(0)

  // Blog state
  const [selectedBlogPost, setSelectedBlogPost] = useState<number | null>(null)

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8])

  // Professional tool animations
  const drillY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const drillRotate = useTransform(scrollYProgress, [0, 1], [0, 720])
  const hammerX = useTransform(scrollYProgress, [0, 1], [100, -100])
  const hammerRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const screwdriverY = useTransform(scrollYProgress, [0, 1], [50, -300])
  const screwdriverRotate = useTransform(scrollYProgress, [0, 1], [0, 540])

  // Dynamic blur effect for testimonials section
  const testimonialsBlur = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ['blur(2px)', 'blur(8px)', 'blur(12px)', 'blur(16px)'])
  const testimonialsOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.8)'])



  // Particle system initialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine)
  }, [])



  useEffect(() => {
    setIsClient(true)

    AOS.init({
      duration: 1200,
      once: true,
      offset: 100
    })

    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll)
    })

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll)
      })
    }
  }, [])

  // Auto-slide reviews carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const maxSlides = Math.ceil(allReviews.length / 3) // 3 reviews per slide
        return (prev + 1) % maxSlides
      })
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [allReviews.length])

  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState({ name: '', email: '' })

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   try {
  //     // Show beautiful notification
  //     setNotificationData({ name: formData.name, email: formData.email || 'the phone number provided' })
  //     setShowNotification(true)
  //     setFormData({ name: '', email: '', phone: '', problem: '', image: null })

  //     // Auto-hide notification after 5 seconds
  //     setTimeout(() => {
  //       setShowNotification(false)
  //     }, 5000)
  //   } catch (error) {
  //     console.error('Error submitting form:', error)
  //     alert('Please call us directly at (559) 977-2027 for immediate assistance.')
  //   }
  // }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }



  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add new review to the beginning of the array
    setAllReviews(prev => {
      const newReview = { ...reviewData }
      const updatedReviews = [newReview, ...prev]

      // Keep only the latest 15 reviews
      return updatedReviews.slice(0, 15)
    })

    // Show beautiful notification for review submission
    setNotificationData({ name: reviewData.name, email: 'your review has been added to the testimonials' })
    setShowNotification(true)
    setReviewData({ name: '', location: '', rating: 5, review: '', serviceUsed: '' })
    setCurrentSlide(0) // Reset to show the new review

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-x-hidden">
      {/* Beautiful Success Notification */}
      {showNotification && (
        <motion.div
          className="fixed top-4 right-4 z-[60] max-w-md"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-2xl border border-green-400/30 backdrop-blur-md">
            <div className="flex items-start space-x-4">
              <motion.div
                className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {notificationData.email.includes('review') ? 'Review Submitted Successfully!' : 'Request Received Successfully!'}
                </h3>
                <p className="text-green-100 text-sm mb-3">
                  Thank you <span className="font-semibold">{notificationData.name}</span>!
                  {notificationData.email.includes('review')
                    ? ' Your review has been added to our testimonials section.'
                    : ` Your request has been received. We'll contact you soon at ${notificationData.email}.`
                  }
                </p>
                {!notificationData.email.includes('review') && (
                  <div className="flex items-center space-x-2 text-xs text-green-200">
                    <FaPhone className="w-3 h-3" />
                    <span>For immediate assistance: (559) 977-2027</span>
                  </div>
                )}
              </div>
              <motion.button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}


      {/* Electrical Particle Effects */}
      {isClient && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: ["#fbbf24", "#3b82f6", "#ef4444", "#10b981"],
            },
            links: {
              color: "#fbbf24",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/3 w-20 h-20 bg-green-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Floating Professional Tools */}
      <motion.div
        className="fixed top-1/4 right-10 z-10 pointer-events-none w-20 h-20 flex items-center justify-center"
        style={{
          y: drillY,
          rotate: drillRotate,
          scale: scale
        }}
      >
        <motion.div
          className="text-6xl filter drop-shadow-lg"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔧
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-1/2 left-10 z-10 pointer-events-none w-16 h-16 flex items-center justify-center"
        style={{
          x: hammerX,
          rotate: hammerRotate,
          scale: scale
        }}
      >
        <motion.div
          className="text-5xl filter drop-shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          🔨
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-3/4 right-1/4 z-10 pointer-events-none w-14 h-14 flex items-center justify-center"
        style={{
          y: screwdriverY,
          rotate: screwdriverRotate,
          scale: scale
        }}
      >
        <motion.div
          className="text-4xl filter drop-shadow-lg"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🪛
        </motion.div>
      </motion.div>

      {/* Lightning Effects */}
      <motion.div
        className="fixed top-10 left-1/2 z-5 pointer-events-none"
        animate={{
          opacity: [0, 1, 0, 1, 0],
          scale: [1, 1.2, 1, 1.1, 1]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <div className="text-6xl text-yellow-400 filter drop-shadow-lg">⚡</div>
      </motion.div>

      <motion.div
        className="fixed bottom-1/4 left-1/4 z-5 pointer-events-none"
        animate={{
          opacity: [0, 1, 0, 1, 0],
          scale: [1, 1.3, 1, 1.2, 1]
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatDelay: 4,
          delay: 1
        }}
      >
        <div className="text-5xl text-blue-400 filter drop-shadow-lg">⚡</div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full bg-black/20 backdrop-blur-lg z-50 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaBolt className="text-yellow-400 text-2xl" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Deep Spark Electric
              </span>
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {['Home', 'Services', 'Service Areas', 'Reviews', 'Blog', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-white hover:text-yellow-400 transition-colors relative group"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-yellow-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="ml-8">
              <motion.a
                href="tel:+15599772027"
                className="relative group"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black px-8 py-3 rounded-xl font-bold shadow-2xl overflow-hidden border border-yellow-300/50">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></span>
                  <div className="relative flex items-center space-x-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <FaPhone className="text-lg" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium opacity-90 leading-none">24/7 Emergency</span>
                      <span className="text-lg font-bold leading-none">Call Now</span>
                    </div>
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 z-10">
              <motion.h1
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <span className="text-white">Professional</span>
                <motion.span
                  className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Electrical
                </motion.span>
                <span className="text-white">Services</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                Experienced electricians ready to solve your electrical problems.
                From simple repairs to complete installations - we've got you covered.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              >
                <motion.a
                  href="#contact"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-block text-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Free Estimate
                </motion.a>
                <motion.a
                  href="tel:+15599772027"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all inline-block text-center"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Emergency Service
                </motion.a>
              </motion.div>

              <motion.div
                className="mt-8 flex items-center justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaStar className="text-yellow-400 mr-2" />
                  </motion.div>
                  <span className="text-gray-300">5-Star Rated Service</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="lg:w-1/2 mt-12 lg:mt-0 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div
                className="relative perspective-1000"
                style={{
                  transform: 'perspective(1000px) rotateY(10deg) rotateX(5deg)'
                }}
              >
                <motion.div
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-12 inline-block shadow-2xl relative"
                  animate={{
                    rotateY: [0, 15, 0, -15, 0],
                    boxShadow: [
                      "0 25px 50px rgba(251, 191, 36, 0.3)",
                      "0 35px 70px rgba(251, 191, 36, 0.5)",
                      "0 25px 50px rgba(251, 191, 36, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaBolt className="text-white text-9xl" />
                </motion.div>

                <motion.div
                  className="absolute -top-6 -right-6 bg-blue-500 rounded-full p-6 shadow-xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <FaWrench className="text-white text-5xl" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 bg-green-500 rounded-full p-6 shadow-xl"
                  animate={{
                    x: [0, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <FaHome className="text-white text-5xl" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="py-20 pb-32 relative z-10"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional electrical services for residential and commercial properties.
              No job too big or small.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHome className="text-4xl" />,
                title: "Residential Wiring",
                description: "Basic electrical wiring repairs, new outlet installations, and electrical troubleshooting for your home.",
                color: "from-blue-500 to-purple-600"
              },
              {
                icon: <FaLightbulb className="text-4xl" />,
                title: "Lighting Installation",
                description: "Indoor and outdoor lighting solutions, LED upgrades, and smart lighting systems.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <FaPlug className="text-4xl" />,
                title: "Outlet & Switch Repair",
                description: "Fix faulty outlets, install new switches, and upgrade to USB outlets.",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: <FaShieldAlt className="text-4xl" />,
                title: "Safety Inspections",
                description: "Comprehensive electrical safety inspections and code compliance checks.",
                color: "from-red-500 to-pink-600"
              },
              {
                icon: <FaBolt className="text-4xl" />,
                title: "Emergency Repairs",
                description: "24/7 emergency electrical repair services for urgent electrical issues.",
                color: "from-purple-500 to-indigo-600"
              },
              {
                icon: <FaWrench className="text-4xl" />,
                title: "Ceiling Fan Installation",
                description: "Professional ceiling fan installation and replacement services for all room types.",
                color: "from-teal-500 to-cyan-600"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
              >
                <div className={`bg-gradient-to-br ${service.color} p-8 rounded-xl shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-500 h-full transform-gpu cursor-pointer`}>
                  <motion.div
                    className="text-white mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-white/90 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>



      {/* Service Areas with Satellite Map Integration */}
      <motion.section
        id="service-areas"
        className="py-20 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-green-400/20 rounded-full border border-green-400/30"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-green-400 font-semibold">🛰️ Service Areas</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-4">Where We Serve</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Proudly serving communities throughout Central California with professional electrical services.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Satellite Map */}
            <motion.div
              className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg p-8 h-96 flex items-center justify-center relative overflow-hidden border-2 border-gray-600 shadow-2xl">
                {/* Satellite view background - realistic earth tones */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 35%, rgba(101, 67, 33, 0.8) 0%, transparent 45%),
                    radial-gradient(circle at 75% 25%, rgba(34, 197, 94, 0.6) 0%, transparent 35%),
                    radial-gradient(circle at 85% 75%, rgba(101, 67, 33, 0.9) 0%, transparent 40%),
                    radial-gradient(circle at 15% 85%, rgba(34, 197, 94, 0.7) 0%, transparent 50%),
                    radial-gradient(circle at 65% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 30%),
                    radial-gradient(circle at 40% 10%, rgba(245, 158, 11, 0.4) 0%, transparent 25%),
                    linear-gradient(135deg,
                      rgba(71, 69, 64, 0.9) 0%,
                      rgba(87, 83, 74, 0.8) 25%,
                      rgba(34, 197, 94, 0.3) 50%,
                      rgba(71, 69, 64, 0.9) 75%,
                      rgba(52, 50, 47, 1) 100%)
                  `,
                  backgroundSize: '80% 80%, 60% 60%, 70% 70%, 90% 90%, 40% 40%, 50% 50%, 100% 100%'
                }}>

                  {/* Satellite terrain texture overlay */}
                  <div className="absolute inset-0 opacity-60" style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px),
                      repeating-linear-gradient(-45deg,
                        transparent,
                        transparent 3px,
                        rgba(255,255,255,0.02) 3px,
                        rgba(255,255,255,0.02) 6px),
                      radial-gradient(circle at 50% 50%,
                        rgba(0,0,0,0.2) 0%,
                        transparent 50%)
                    `
                  }}></div>

                  {/* Water bodies - darker blue for satellite view */}
                  <div className="absolute top-12 right-16 w-18 h-14 bg-blue-900 rounded-lg opacity-80 shadow-xl" style={{clipPath: 'polygon(0% 10%, 90% 0%, 100% 90%, 10% 100%)'}}></div>
                  <div className="absolute bottom-16 left-20 w-20 h-8 bg-blue-800 rounded-full opacity-75 shadow-lg"></div>
                  <div className="absolute top-1/2 right-12 w-12 h-20 bg-blue-850 opacity-70 shadow-lg" style={{clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'}}></div>

                  {/* Agricultural and developed areas - satellite colors */}
                  <div className="absolute top-20 left-12 w-16 h-18 bg-amber-700 rounded opacity-60 shadow-md" style={{clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'}}></div>
                  <div className="absolute bottom-24 right-20 w-14 h-14 bg-green-800 rounded-full opacity-65 shadow-md"></div>
                  <div className="absolute top-1/3 left-1/4 w-12 h-8 bg-yellow-800 rounded opacity-50 shadow-sm"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-10 h-12 bg-green-900 opacity-55 rounded shadow-sm"></div>
                  <div className="absolute top-3/4 left-1/2 w-8 h-6 bg-amber-800 opacity-45 rounded shadow-sm"></div>

                  {/* Urban areas - gray satellite view */}
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-gray-600 opacity-80 rounded-sm shadow-lg border border-gray-500"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-gray-550 opacity-75 rounded-sm shadow-lg border border-gray-500"></div>
                  <div className="absolute top-2/3 left-1/4 w-14 h-10 bg-gray-650 opacity-80 rounded-sm shadow-lg border border-gray-500"></div>
                  <div className="absolute bottom-1/6 right-1/3 w-8 h-8 bg-gray-500 opacity-70 rounded-sm shadow-md border border-gray-400"></div>
                  <div className="absolute top-1/6 right-2/3 w-10 h-8 bg-gray-600 opacity-75 rounded-sm shadow-md border border-gray-500"></div>

                  {/* Major highways - satellite view roads */}
                  <div className="absolute top-1/3 left-0 w-full h-2 bg-gray-400 opacity-70 shadow-lg" style={{background: 'linear-gradient(90deg, rgba(107,114,128,0.7) 0%, rgba(156,163,175,0.8) 50%, rgba(107,114,128,0.7) 100%)'}}></div>
                  <div className="absolute left-1/2 top-0 w-2 h-full bg-gray-400 opacity-70 shadow-lg" style={{background: 'linear-gradient(180deg, rgba(107,114,128,0.7) 0%, rgba(156,163,175,0.8) 50%, rgba(107,114,128,0.7) 100%)'}}></div>

                  {/* Secondary roads */}
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-gray-500 opacity-60 transform rotate-45 shadow-md"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1 bg-gray-500 opacity-60 transform -rotate-45 shadow-md"></div>
                  <div className="absolute top-2/3 left-1/6 w-2/3 h-1 bg-gray-500 opacity-55 transform rotate-12 shadow-md"></div>

                  {/* Elevation shadows for 3D satellite effect */}
                  <div className="absolute top-20 left-8 w-6 h-20 bg-black opacity-20 blur-sm transform skew-x-12"></div>
                  <div className="absolute bottom-16 right-12 w-8 h-16 bg-black opacity-15 blur-sm transform -skew-x-12"></div>
                  <div className="absolute top-1/2 left-1/3 w-4 h-12 bg-black opacity-10 blur-sm transform skew-y-6"></div>
                </div>

                {/* Service area markers with enhanced styling */}
                {serviceAreas.map((area, index) => (
                  <motion.div
                    key={area.name}
                    className="absolute z-10"
                    style={{
                      left: `${15 + (index % 3) * 30}%`,
                      top: `${15 + Math.floor(index / 3) * 35}%`
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.4 }}
                  >
                    <div className="relative group">
                      <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-full p-2 shadow-2xl border-2 border-white/50">
                        <FaMapPin className="text-white text-2xl drop-shadow-lg" />
                      </div>
                      <div className="absolute w-4 h-4 bg-red-500 rounded-full -bottom-1 left-1/2 transform -translate-x-1/2 opacity-60"></div>
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/95 text-white px-4 py-3 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-gray-600 backdrop-blur-sm">
                        <div className="font-semibold text-yellow-400 text-base">{area.name}</div>
                        <div className="text-gray-300">{area.customers} customers served</div>
                        <div className="text-green-400 text-xs mt-1">Active Service Area</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Enhanced city labels with satellite styling */}
                <div className="absolute top-8 left-8 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Madera</div>
                <div className="absolute top-16 right-20 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Clovis</div>
                <div className="absolute bottom-20 left-12 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Fresno</div>
                <div className="absolute bottom-12 right-24 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Sanger</div>
                <div className="absolute top-1/2 left-20 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Selma</div>
                <div className="absolute bottom-1/3 right-12 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/20">Fowler</div>

                <motion.div
                  className="absolute bottom-4 right-4 bg-gray-900/90 px-4 py-3 rounded-lg text-white text-sm border border-gray-500 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="font-semibold text-yellow-400 flex items-center">
                    <span className="mr-2">🛰️</span>
                    Central California
                  </div>
                  <div className="text-xs text-gray-300">Satellite Service Coverage</div>
                </motion.div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-300 text-sm">
                  <FaMapMarkerAlt className="inline mr-2 text-yellow-400" />
                  Real-time satellite view of our service areas
                </p>
                <p className="text-gray-400 text-xs mt-1">Hover over markers to see detailed coverage information</p>
              </div>
            </motion.div>

            {/* Service Areas List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-8">Our Service Areas</h3>
              <div className="grid gap-4">
                {serviceAreas.map((area, index) => (
                  <motion.div
                    key={area.name}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FaLocationArrow className="text-yellow-400 text-xl" />
                        <div>
                          <h4 className="text-xl font-semibold text-white">{area.name}</h4>
                          <p className="text-gray-300 text-sm">Full electrical services available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">{area.customers}+</div>
                        <div className="text-gray-400 text-sm">Happy Customers</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-lg border-l-4 border-green-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-400" />
                  Don't See Your Area?
                </h4>
                <p className="text-gray-300 mb-3">
                  We're always expanding our service areas. Contact us to see if we can help with your electrical needs.
                </p>
                <motion.a
                  href="tel:+15599772027"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Call to Check Availability →
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section with Review Submission */}
      <motion.section
        id="reviews"
        className="py-20 mt-16 relative z-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/20 via-gray-900/30 to-black/20 shadow-lg"
          style={{
            backdropFilter: testimonialsBlur,
            backgroundColor: testimonialsOpacity
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-yellow-400/20 rounded-full border border-yellow-400/30"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="text-yellow-400 font-semibold">⭐ Customer Reviews</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-300">Real experiences from satisfied customers</p>
          </motion.div>

          {/* Leave a Review Section */}
          <motion.div
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-md p-8 rounded-xl border border-yellow-400/30 shadow-xl">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-block mb-4 px-6 py-2 bg-yellow-400/30 rounded-full border border-yellow-400/50"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <span className="text-yellow-400 font-semibold">⭐ Share Your Experience</span>
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Leave Us a Review</h3>
                <p className="text-gray-300 text-lg">
                  We'd love to hear about your experience with Deep Spark Electric!
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-white font-semibold mb-3">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewData.name}
                      onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                      placeholder="Your full name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-white font-semibold mb-3">Location</label>
                    <input
                      type="text"
                      value={reviewData.location}
                      onChange={(e) => setReviewData({ ...reviewData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                      placeholder="City/Area (e.g., Fresno, Clovis)"
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-white font-semibold mb-3">Rating *</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className={`text-4xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaStar />
                        </motion.button>
                      ))}
                      <span className="ml-4 text-white font-semibold">
                        {reviewData.rating} / 5 Stars
                      </span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-white font-semibold mb-3">Service Used</label>
                    <select
                      value={reviewData.serviceUsed}
                      onChange={(e) => setReviewData({ ...reviewData, serviceUsed: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white backdrop-blur-md"
                    >
                      <option value="" className="bg-gray-800">Select service...</option>
                      <option value="Residential Wiring" className="bg-gray-800">Residential Wiring</option>
                      <option value="Lighting Installation" className="bg-gray-800">Lighting Installation</option>
                      <option value="Outlet & Switch Repair" className="bg-gray-800">Outlet & Switch Repair</option>
                      <option value="Safety Inspection" className="bg-gray-800">Safety Inspection</option>
                      <option value="Emergency Repair" className="bg-gray-800">Emergency Repair</option>
                      <option value="Ceiling Fan Installation" className="bg-gray-800">Ceiling Fan Installation</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-white font-semibold mb-3">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewData.review}
                    onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                    placeholder="Tell us about your experience with Deep Spark Electric. What made our service special?"
                  />
                </motion.div>

                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-3"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px rgba(251, 191, 36, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStar className="text-xl" />
                    <span>Submit Review</span>
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>



          {/* Sliding Reviews Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-1000 ease-in-out"
              animate={{
                x: `${-currentSlide * 100}%`
              }}
              transition={{
                type: "tween",
                duration: 1
              }}
            >
              {Array.from({ length: Math.ceil(allReviews.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="min-w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                  {allReviews.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial, reviewIndex) => {
                    const globalIndex = slideIndex * 3 + reviewIndex
                    return (
                      <motion.div
                        key={`${testimonial.name}-${globalIndex}`}
                        className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: reviewIndex * 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.15)"
                        }}
                      >
                        <div className="flex text-yellow-400 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: reviewIndex * 0.2 + i * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <FaStar />
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-white/90 mb-6 italic">"{testimonial.review}"</p>
                        <div>
                          <h4 className="font-semibold text-white">{testimonial.name}</h4>
                          <p className="text-gray-400 text-sm">{testimonial.location}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </motion.div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(allReviews.length / 3) }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-yellow-400 scale-125' : 'bg-white/30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={() => setCurrentSlide(prev => prev === 0 ? Math.ceil(allReviews.length / 3) - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all border border-white/20"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={() => setCurrentSlide(prev => (prev + 1) % Math.ceil(allReviews.length / 3))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all border border-white/20"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section
        id="blog"
        className="py-20 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-sm" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-purple-400/20 rounded-full border border-purple-400/30"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-purple-400 font-semibold">📚 Electrical Tips</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-4">Electrical Safety & Tips</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Learn valuable electrical safety tips and maintenance guides from our expert electricians.
            </p>
          </motion.div>

          {selectedBlogPost ? (
            // Blog Post Detail View
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <motion.button
                onClick={() => setSelectedBlogPost(null)}
                className="mb-6 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                whileHover={{ x: -5 }}
              >
                <span>←</span>
                <span>Back to Blog</span>
              </motion.button>

              {(() => {
                const post = blogPosts.find(p => p.id === selectedBlogPost)
                if (!post) return null

                return (
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-purple-400">{post.icon}</div>
                      <div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/20">
                      <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-6 rounded-lg">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <FaExclamationTriangle className="mr-2 text-yellow-400" />
                          Need Professional Help?
                        </h4>
                        <p className="text-gray-300 mb-4">
                          For any electrical work beyond basic maintenance, always consult with licensed professionals.
                        </p>
                        <motion.a
                          href="#contact"
                          className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Contact Our Experts
                        </motion.a>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          ) : (
            // Blog Posts Grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedBlogPost(post.id)}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all h-full">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-purple-400 group-hover:scale-110 transition-transform">
                        {post.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <motion.div
                      className="flex items-center text-purple-400 font-semibold group-hover:text-yellow-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span>Read More</span>
                      <span className="ml-2">→</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Contact Section with enhanced form */}
      <motion.section
        id="contact"
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">Get Your Free Estimate</h2>
            <p className="text-xl text-gray-300">
              Describe your electrical problem and upload a photo for a quick assessment
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <form
                action="https://formspree.io/f/xgvzwkal"  // Replace with your actual Formspree form ID
                method="POST"
                encType="multipart/form-data"
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div>
                  <label className="block text-white font-semibold mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Your Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                    placeholder="Your email address"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Your Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Describe Your Problem</label>
                  <textarea
                    name="problem"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-md"
                    placeholder="Tell us what electrical issue you're facing"
                  ></textarea>
                </div>

                {/* <div>
                  <label className="block text-white font-semibold mb-2">Upload Image (Optional)</label>
                  <input
                    type="file"
                    name="image"
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-300 hover:file:bg-yellow-400/30"
                  />
                </div> */}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-3"
                  >
                    <span>Send Request</span>
                  </button>
                </div>
              </form>
            </motion.div>
          

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <FaPhone className="text-yellow-400 text-xl mr-4" />
                    <div>
                      <h4 className="font-semibold text-white">Phone</h4>
                      <a href="tel:+15599772027" className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer">
                        (559) 977-2027
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <FaEnvelope className="text-yellow-400 text-xl mr-4" />
                    <div>
                      <h4 className="font-semibold text-white">Email</h4>
                      <a href="mailto:randhawawork559@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                        randhawawork559@gmail.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    <FaMapMarkerAlt className="text-yellow-400 text-xl mr-4" />
                    <div>
                      <h4 className="font-semibold text-white">Service Area</h4>
                      <p className="text-gray-300">Fresno, Sanger, Fowler, Clovis, Selma, Madera & All Nearby Areas</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-8 p-6 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg border-l-4 border-yellow-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-white mb-2">Emergency Service Available</h4>
                  <p className="text-gray-300">
                    24/7 emergency electrical services for urgent issues.
                    Call now for immediate assistance!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Professional Disclaimer Section */}
      <motion.section
        className="py-16 bg-gradient-to-br from-gray-800/50 via-blue-800/30 to-purple-800/50 backdrop-blur-sm border-t border-white/10 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-blue-400/20 rounded-full border border-blue-400/30"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-400 font-semibold">📋 Professional Disclosure</span>
            </motion.div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
              <motion.h3
                className="text-2xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                About Deep Spark Electric
              </motion.h3>

              <motion.div
                className="space-y-4 text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-lg">
                  <span className="text-yellow-400 font-semibold">Deep Spark Electric</span> is operated by a skilled handyman with extensive expertise in electrical work.
                  I have completed comprehensive electrical studies through college and bring years of hands-on experience to every project.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <motion.div
                    className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/20"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <FaUser className="mr-2" />
                      Professional Background
                    </h4>
                    <p className="text-sm">
                      College-educated in electrical systems with extensive hands-on training and practical experience in residential electrical work.
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-400/20"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(245, 158, 11, 0.15)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <FaTools className="mr-2" />
                      Service Expertise
                    </h4>
                    <p className="text-sm">
                      Specializing in residential electrical repairs, installations, and maintenance with a focus on safety and quality workmanship.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 p-4 bg-orange-500/10 rounded-lg border border-orange-400/20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-orange-200 italic">
                    <span className="font-semibold text-orange-400">Important Note:</span> While I am not a licensed electrician,
                    I am a qualified handyman with specialized electrical expertise gained through formal education and extensive practical experience.
                    All work is performed with the highest standards of safety and quality in mind.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-black/50 backdrop-blur-md text-white py-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center space-x-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaBolt className="text-yellow-400 text-2xl" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Deep Spark Electric
              </span>
            </motion.div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2025 Deep Spark Electric</p>
              <p className="text-gray-400">Professional • Reliable • Expert</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
