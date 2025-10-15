import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Car, Key, Eye, EyeOff, UserPlus, Loader2, AlertCircle, User, Mail, Phone, ArrowLeft } from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    registrationCode: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    const validCodes = ['EDDIE2024', 'STAFF2024', 'MANAGER2024'];
    if (!formData.registrationCode.trim()) {
      newErrors.registrationCode = 'Registration code is required';
    } else if (!validCodes.includes(formData.registrationCode.toUpperCase())) {
      newErrors.registrationCode = 'Invalid registration code';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      // Success handled by AuthContext redirect
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Eddie's Automotive</h1>
          <p className="text-blue-200">Create Your Account</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Join Our Team</h2>
            <p className="text-blue-200 text-sm">Create your account to get started</p>
          </div>

          <div className="space-y-4">
            {/* Registration Code */}
            <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <label className="block text-orange-200 text-sm font-medium mb-2">
                <Key className="inline w-4 h-4 mr-1" /> Registration Code *
              </label>
              <input
                type="text"
                value={formData.registrationCode}
                onChange={(e) => handleInputChange('registrationCode', e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter registration code"
              />
              {errors.registrationCode && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.registrationCode}
                </p>
              )}
              <p className="text-orange-200 text-xs mt-2">
                Valid codes: <span className="font-mono">EDDIE2024, STAFF2024, MANAGER2024</span>
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" /> First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-300 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" /> Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-300 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-1" /> Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Phone className="inline w-4 h-4 mr-1" /> Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Key className="inline w-4 h-4 mr-1" /> Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
              <p className="text-white/60 text-xs mt-1">Must be 8+ characters with uppercase, lowercase, and numbers</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Key className="inline w-4 h-4 mr-1" /> Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors underline underline-offset-2"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
