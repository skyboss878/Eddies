import React, { useState } from 'react';
import { getStatusColor, getStatusIcon, formatDate, formatTime } from './helpers';

const AppointmentDetailsModal = ({ appointment, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...appointment });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{appointment.customer_name}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)} <span className="ml-2 capitalize">{appointment.status}</span>
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
                <h4 className="font-semibold text-gray-900 mb-2">Vehicle Info</h4>
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
              <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors">Close</button>
              <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">Edit</button>
              <button onClick={() => onDelete(appointment.id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">Delete</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* You can reuse AddAppointmentModal fields here */}
            <p className="text-gray-700">Editing mode (expand fields like AddAppointmentModal)</p>
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
