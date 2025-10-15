// src/pages/Landing.jsx - FIXED STRUCTURE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import RouteTest from '../components/RouteTest';

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get today's date for form validation
  const today = new Date().toISOString().split('T')[0];

  // Format phone number helper
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // ALL FUNCTIONS DEFINED BEFORE RETURN
  const handleStaffLogin = () => {
    setShowStaffModal(true);
  };

  const handleCustomerAppointment = () => {
    setShowCustomerModal(true);
  };

  const closeModal = () => {
    setShowStaffModal(false);
    setShowCustomerModal(false);
    setShowSuccessModal(false);
  };

  const handleStaffLoginSubmit = (e) => {
    e.preventDefault();
    setShowStaffModal(false);
    // Navigate to login page with correct path
    navigate('/login');
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const appointmentData = Object.fromEntries(formData);

    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'vehicle', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      // Show loading state
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Scheduling...';
      submitButton.disabled = true;

      // Send to backend
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();

      if (response.ok) {
        setShowCustomerModal(false);
        setSuccessMessage(
          `Thank you ${appointmentData.name}! Your appointment request has been received. ` +
          `We'll contact you at ${appointmentData.phone} within 24 hours to confirm your ${appointmentData.service} appointment.` +
          (result.email_sent ? ' A confirmation email has been sent to you.' : '')
        );
        setShowSuccessModal(true);

        // Reset form
        e.target.reset();
      } else {
        // Handle error response
        alert(`Failed to schedule appointment: ${result.error || 'Unknown error'}`);
      }

      // Restore button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    } catch (error) {
      alert('Failed to schedule appointment. Please try again or call us at (661) 327-4242');

      // Restore button
      const submitButton = e.target.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Schedule My Appointment';
        submitButton.disabled = false;
      }
    }
  };

  // LOADING CONDITION BEFORE MAIN RETURN
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading Eddie's Automotive...</p>
        </div>
      </div>
    );
  }

  // SINGLE MAIN RETURN
  return (
    <>
      <style>{`
        .racing-stripes {
          position: fixed;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255, 0, 0, 0.05) 20px,
            rgba(255, 0, 0, 0.05) 40px
          );
          animation: raceStripes 20s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes raceStripes {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes glow {
          from { filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.5)); }
          to { filter: drop-shadow(0 0 30px rgba(0, 100, 255, 0.5)); }
        }

        .hero-title {
          background: linear-gradient(45deg, #ff0000, #ffffff, #0066ff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 3s ease-in-out infinite alternate;
        }

        .pulse-icon {
          animation: pulse 2s infinite;
        }

        .modal-backdrop {
          backdrop-filter: blur(5px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white font-sans overflow-x-hidden">
        <div className="racing-stripes"></div>
        
        {/* Header Section */}
        <div className="relative overflow-hidden pt-16 pb-32 md:pt-24 md:pb-48 lg:pt-32 lg:pb-64">
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-red-600 p-5 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 border-4 border-white/20">
                <svg className="w-16 h-16 text-white pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 tracking-tighter drop-shadow-lg hero-title">
              Eddie's <span className="text-red-500">Automotive</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-300 italic mb-2">"Fast Eddie" Professional Auto Service</p>
            <p className="text-lg text-red-300 mb-8">Racing Speed, Professional Results</p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-12 max-w-3xl mx-auto border border-white/20 shadow-xl">
              <p className="text-lg md:text-xl font-semibold text-blue-100 mb-3">Family-owned and operated since 1990</p>
              <p className="text-blue-200 text-base md:text-lg mb-3">3123 Chester Ave, Bakersfield, CA 93301</p>
              <a href="tel:(661) 327-4242" className="text-white text-2xl md:text-3xl font-bold tracking-wide hover:text-blue-300 transition-colors">
                (661) 327-4242
              </a>
              <p className="text-blue-200 text-base md:text-lg mt-3">
                <a href="mailto:56chevyeddiefasteddie@gmail.com" className="hover:text-white transition-colors">56chevyeddiefasteddie@gmail.com</a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleStaffLogin}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 border-2 border-white/20"
              >
                Staff Login - Shop Management System
              </button>
              <button
                onClick={handleCustomerAppointment}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 border-2 border-white/20"
              >
                Schedule Appointment - Customer Portal
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-black/80 py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 md:mb-12 drop-shadow-lg">
              Professional <span className="text-red-400">Auto Services</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto">
              Racing precision applied to every job - from routine maintenance to complex repairs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: "🛢️", title: "Oil Changes & Maintenance", description: "Premium oils and filters for optimal engine performance." },
                { icon: "🛑", title: "Brake Service", description: "Professional brake repair - your safety is our priority." },
                { icon: "❄️", title: "AC & Heating", description: "Climate control system repair for year-round comfort." },
                { icon: "⚡", title: "Electrical Systems", description: "Complete electrical diagnostics and repair services." },
                { icon: "🔧", title: "Engine Diagnostics", description: "Advanced computer diagnostics for accurate repairs." },
                { icon: "🏁", title: "Performance Tuning", description: "Racing expertise for enhanced vehicle performance." }
              ].map((service, index) => (
                <div key={index} className="bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 relative overflow-hidden">
                  <div className="text-4xl md:text-6xl mb-4 text-red-500">{service.icon}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-6 md:py-8 text-center text-xs md:text-sm">
          <div className="max-w-7xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Eddie's Automotive. All rights reserved.</p>
            <p className="mt-2 text-gray-500">"Racing Speed, Professional Results"</p>
          </div>
        </footer>
      </div>

      {/* Staff Login Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-red-500 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                Staff Login
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-400 text-2xl">×</button>
            </div>
            <form onSubmit={handleStaffLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Username:</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Password:</label>
                <input
                  type="password"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105"
              >
                Access Shop Management System
              </button>
            </form>
            <p className="text-center text-gray-400 text-sm mt-4">
              Staff access only - Manage customers, jobs, inventory, and reports
            </p>
          </div>
        </div>
      )}

      {/* Customer Appointment Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-lg w-full border-2 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                Schedule Appointment
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-blue-400 text-2xl">×</button>
            </div>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Full Name:</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="(661) 555-0000"
                  onChange={(e) => {
                    e.target.value = formatPhoneNumber(e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Vehicle Information:</label>
                <input
                  type="text"
                  name="vehicle"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Year Make Model (e.g., 2020 Honda Civic)"
                />
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Service Needed:</label>
                <select
                  name="service"
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a service</option>
                  <option value="oil-change">Oil Change & Filter</option>
                  <option value="brake-service">Brake Service</option>
                  <option value="ac-repair">AC/Heating Repair</option>
                  <option value="electrical">Electrical Issues</option>
                  <option value="engine-diagnostic">Engine Diagnostic</option>
                  <option value="general-repair">General Repair</option>
                  <option value="maintenance">Scheduled Maintenance</option>
                  <option value="performance">Performance Tuning</option>
                  <option value="other">Other (describe below)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 mb-2 font-semibold">Preferred Date:</label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={today}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 mb-2 font-semibold">Preferred Time:</label>
                  <select
                    name="time"
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-blue-300 mb-2 font-semibold">Description/Comments:</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Please describe the issue or any additional information..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
              >
                Schedule My Appointment
              </button>
            </form>
            <div className="text-center mt-4 space-y-2">
              <p className="text-blue-300 text-sm">We'll contact you within 24 hours to confirm</p>
              <p className="text-red-300 text-sm">For urgent repairs, please call: (661) 327-4242</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Success!</h2>
            <p className="text-white mb-6">{successMessage}</p>
            <button
              onClick={closeModal}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Landing;
