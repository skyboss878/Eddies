// src/pages/AppointmentCalendar.jsx - Complete Appointment System
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  User,
  Car,
  Wrench,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'day', 'week', 'month'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Sample appointment data - replace with API calls
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const sampleAppointments = [
        {
          id: 1,
          customer_name: 'John Smith',
          customer_phone: '(555) 123-4567',
          customer_email: 'john.smith@email.com',
          vehicle_info: '2020 Honda Civic - ABC123',
          service_type: 'Oil Change',
          appointment_date: '2025-01-15',
          appointment_time: '09:00',
          duration: 60,
          status: 'confirmed',
          notes: 'Regular maintenance check',
          created_at: '2025-01-10T10:00:00Z'
        },
        {
          id: 2,
          customer_name: 'Sarah Johnson',
          customer_phone: '(555) 987-6543',
          customer_email: 'sarah.johnson@email.com',
          vehicle_info: '2018 Toyota Camry - XYZ789',
          service_type: 'Brake Inspection',
          appointment_date: '2025-01-15',
          appointment_time: '14:00',
          duration: 90,
          status: 'pending',
          notes: 'Customer reports squeaking noise',
          created_at: '2025-01-12T14:30:00Z'
        },
        {
          id: 3,
          customer_name: 'Mike Davis',
          customer_phone: '(555) 456-7890',
          customer_email: 'mike.davis@email.com',
          vehicle_info: '2019 Ford F-150 - DEF456',
          service_type: 'Transmission Service',
          appointment_date: '2025-01-16',
          appointment_time: '10:30',
          duration: 120,
          status: 'confirmed',
          notes: 'Annual transmission fluid change',
          created_at: '2025-01-11T09:15:00Z'
        }
      ];
      
      setAppointments(sampleAppointments);
      setFilteredAppointments(sampleAppointments);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search and filters
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(apt => apt.service_type === serviceFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, serviceFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span>Appointment Calendar</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage customer appointments and scheduling</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Services</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Brake Inspection">Brake Inspection</option>
            <option value="Transmission Service">Transmission Service</option>
            <option value="Engine Diagnostic">Engine Diagnostic</option>
            <option value="Tire Rotation">Tire Rotation</option>
          </select>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Today\'s Appointments', 
            value: '8', 
            color: 'bg-blue-600', 
            icon: Calendar 
          },
          { 
            title: 'Pending Confirmations', 
            value: '3', 
            color: 'bg-yellow-600', 
            icon: AlertCircle 
          },
          { 
            title: 'This Week', 
            value: '24', 
            color: 'bg-green-600', 
            icon: CheckCircle 
          },
          { 
            title: 'Average Duration', 
            value: '1.5h', 
            color: 'bg-purple-600', 
            icon: Clock 
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Appointments ({filteredAppointments.length})
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Schedule your first appointment to get started'
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{appointment.customer_name}</span>
                      </h3>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(appointment.appointment_time)} ({appointment.duration}min)</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Wrench className="w-4 h-4" />
                        <span>{appointment.service_type}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>{appointment.vehicle_info}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.customer_phone}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3 mb-4">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {/* Edit appointment */}}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Appointment"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {/* Delete appointment */}}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel Appointment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(newAppointment) => {
            setAppointments(prev => [...prev, { ...newAppointment, id: Date.now() }]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

// Add Appointment Modal Component
const AddAppointmentModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    vehicle_info: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    duration: 60,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pending',
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.customer_phone}
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Information</label>
            <input
              type="text"
              required
              placeholder="e.g., 2020 Honda Civic - ABC123"
              value={formData.vehicle_info}
              onChange={(e) => setFormData({...formData, vehicle_info: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                required
                value={formData.service_type}
                onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Service</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="Transmission Service">Transmission Service</option>
                <option value="Engine Diagnostic">Engine Diagnostic</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.appointment_date}
                onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                required
                value={formData.appointment_time}
                onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional information about the appointment..."
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Appointment Details Modal
const AppointmentDetailsModal = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{appointment.customer_name}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                <span className="ml-2 capitalize">{appointment.status}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{appointment.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{appointment.customer_email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vehicle Information</h4>
              <p className="text-gray-700">{appointment.vehicle_info}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Type</h4>
              <p className="text-gray-700">{appointment.service_type}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Date</h4>
              <p className="text-gray-700">{formatDate(appointment.appointment_date)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Time</h4>
              <p className="text-gray-700">{formatTime(appointment.appointment_time)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
              <p className="text-gray-700">{appointment.duration} minutes</p>
            </div>
          </div>

          {appointment.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{appointment.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Edit Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
