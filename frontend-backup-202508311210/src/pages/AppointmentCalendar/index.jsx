import React, { useState } from 'react';
import AddAppointmentModal from './AddAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { getStatusColor } from './helpers';

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const addAppointment = (data) => setAppointments([...appointments, data]);
  const updateAppointment = (updated) => setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
  const deleteAppointment = (id) => setAppointments(appointments.filter(a => a.id !== id));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Add Appointment</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => setSelected(a)}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{a.customer_name}</h3>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(a.status)}`}>{a.status}</span>
            </div>
            <p className="text-gray-500">{a.service_type}</p>
            <p className="text-gray-500">{a.appointment_date} @ {a.appointment_time}</p>
          </div>
        ))}
        {appointments.length === 0 && <p className="text-gray-500 col-span-full">No appointments scheduled</p>}
      </div>

      {showAddModal && <AddAppointmentModal onClose={() => setShowAddModal(false)} onSubmit={addAppointment} />}
      {selected && <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} onUpdate={updateAppointment} onDelete={deleteAppointment} />}
    </div>
  );
};

export default AppointmentCalendar;
