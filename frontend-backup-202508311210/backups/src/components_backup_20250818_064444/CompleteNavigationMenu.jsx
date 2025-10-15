import { useState } from "react";
import { Link } from "react-router-dom";

export default function CompleteNavigationMenu() {
  const [customersOpen, setCustomersOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <nav className="flex flex-col gap-2 p-4 bg-gray-100 h-screen overflow-y-auto">
      <Link to="/" className="font-bold text-lg mb-2">Dashboard</Link>

      {/* Customers Section */}
      <div>
        <button onClick={() => setCustomersOpen(!customersOpen)} className="font-semibold">
          Customers {customersOpen ? "▲" : "▼"}
        </button>
        {customersOpen && (
          <div className="ml-4 flex flex-col gap-1">
            <Link to="/customers">Customer List</Link>
            <Link to="/customers/add">Add Customer</Link>
            <Link to="/vehicles">Vehicle List</Link>
            <Link to="/vehicles/add">Add Vehicle</Link>
          </div>
        )}
      </div>

      {/* Jobs / Appointments Section */}
      <div>
        <button onClick={() => setJobsOpen(!jobsOpen)} className="font-semibold">
          Jobs / Appointments {jobsOpen ? "▲" : "▼"}
        </button>
        {jobsOpen && (
          <div className="ml-4 flex flex-col gap-1">
            <Link to="/appointments">Appointment Calendar</Link>
            <Link to="/jobs/create">Create Job</Link>
            <Link to="/view-jobs">View Jobs</Link>
            <Link to="/estimates">Estimates List</Link>
            <Link to="/estimates/create">Create Estimate</Link>
            <Link to="/estimate-ai">AI Estimate</Link>
          </div>
        )}
      </div>

      {/* Inventory / Parts Section */}
      <div className="ml-0">
        <Link to="/inventory" className="font-semibold">Inventory</Link>
        <Link to="/parts-labor" className="ml-4">Parts & Labor</Link>
      </div>

      {/* Reports / Admin Section */}
      <div>
        <button onClick={() => setAdminOpen(!adminOpen)} className="font-semibold">
          Admin / Reports {adminOpen ? "▲" : "▼"}
        </button>
        {adminOpen && (
          <div className="ml-4 flex flex-col gap-1">
            <Link to="/reports">Reports</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/data-migration">Data Migration</Link>
            <Link to="/diagnosis">Diagnosis</Link>
          </div>
        )}
      </div>

      {/* Misc / Landing */}
      <div className="mt-4">
        <Link to="/landing">Landing</Link>
        <Link to="/landing-backup">Landing Backup</Link>
        <Link to="/test-page">Test Page</Link>
      </div>
    </nav>
  );
}
