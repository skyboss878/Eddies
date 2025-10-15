// src/pages/Invoice.jsx
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { jobService, vehicleService, customerService } from "../utils/api";
import html2pdf from "html2pdf.js";

function Invoice() {
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const printRef = useRef();

  // Currency formatting
  const currency = (num) => `$${(parseFloat(num) || 0).toFixed(2)}`;

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    if (type !== 'error') {
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const showCustomConfirm = (text, action) => {
    setMessage({ text, type: 'confirm' });
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const handleConfirmResponse = (confirmed) => {
    setShowConfirm(false);
    setMessage({ text: '', type: '' });
    if (confirmed && confirmAction) confirmAction();
    setConfirmAction(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Waiting for Parts': 'bg-orange-100 text-orange-800',
      'Scheduled': 'bg-purple-100 text-purple-800',
      'Canceled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCheckList = (obj) => {
    if (!obj || typeof obj !== 'object') return 'N/A';
    const checked = Object.keys(obj).filter(k => obj[k]);
    return checked.length ? checked.map(item =>
      item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    ).join(', ') : 'None Checked';
  };

  useEffect(() => {
    async function fetchInvoice() {
      if (!jobId) return setLoading(false);
      setLoading(true);
      try {
        const job = await jobService.get(jobId);
        const [vehicle, customer] = await Promise.all([
          vehicleService.get(job.vehicleId),
          customerService.get(job.customerId),
        ]);

        const partsTotal = job.parts.reduce((sum, p) => sum + p.totalCost, 0);
        const laborTotal = job.labor.reduce((sum, l) => sum + l.totalCost, 0);

        setInvoiceData({
          jobId: job.id,
          date: job.date || new Date().toISOString().slice(0, 10),
          customer: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email || 'N/A',
            address: customer.address || 'N/A'
          },
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            mileage: job.mileage || 'N/A',
            vin: vehicle.vin || 'N/A',
            licensePlate: vehicle.licensePlate || 'N/A',
            oilType: vehicle.oilType || 'N/A',
          },
          description: job.description,
          status: job.status,
          notes: job.notes || 'None',
          parts: job.parts,
          labor: job.labor,
          actualJobCost: job.actualCost || job.estimatedCost,
          partsTotal,
          laborTotal,
          hazardousWasteFee: job.hazardousWasteFee || 0,
          shopSuppliesFee: job.shopSuppliesFee || 0,
          taxRate: 8.75,
          fluids: job.fluids || {},
          belts: job.belts || {},
        });
      } catch (err) {
        showMessage("Failed to load invoice: " + err.message, 'error');
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [jobId]);

  const subtotal = invoiceData
    ? invoiceData.actualJobCost + invoiceData.partsTotal + invoiceData.laborTotal
    : 0;
  const tax = invoiceData ? subtotal * (invoiceData.taxRate / 100) : 0;
  const total = invoiceData ? subtotal + invoiceData.hazardousWasteFee + invoiceData.shopSuppliesFee + tax : 0;

  const handlePrint = () => window.print();

  const handlePDFDownload = () => {
    if (!printRef.current) return;
    html2pdf()
      .set({ margin: 0.5, filename: `invoice-${jobId}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } })
      .from(printRef.current)
      .save();
  };

  const handleEmailInvoice = () => {
    showCustomConfirm("Email this invoice to the customer?", async () => {
      try {
        await jobService.emailInvoice?.(jobId) // TODO: Add emailInvoice method;
        showMessage("Invoice emailed successfully", "success");
      } catch (err) {
        showMessage("Error emailing invoice: " + err.message, "error");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-4 border-red-500 rounded-full mx-auto mb-4" />
          <p className="text-xl font-semibold">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return <div className="p-6 text-red-600 text-center">Invoice not found or failed to load.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-lg my-8 overflow-auto print:shadow-none print:my-0" ref={printRef}>
      {/* Message Box */}
      {message.text && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded z-50 shadow-lg
          ${message.type === 'success' ? 'bg-green-500 text-white' : ''}
          ${message.type === 'error' ? 'bg-red-500 text-white' : ''}
          ${message.type === 'info' ? 'bg-blue-500 text-white' : ''}
          ${message.type === 'confirm' ? 'bg-yellow-500 text-white' : ''}
          flex items-center justify-between`}>
          <span>{message.text}</span>
          {showConfirm && (
            <div className="ml-4 flex gap-2">
              <button onClick={() => handleConfirmResponse(true)} className="px-3 py-1 bg-white text-yellow-700 rounded hover:bg-gray-100 font-semibold">Yes</button>
              <button onClick={() => handleConfirmResponse(false)} className="px-3 py-1 bg-white text-yellow-700 rounded hover:bg-gray-100 font-semibold">No</button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-6 print:border-none">
        <h1 className="text-3xl font-bold text-red-600">Fast Eddie's 56 Chevy Garage</h1>
        <p className="text-gray-700">3123 Chester Ave. Bakersfield, CA 93301</p>
        <p>Phone: (661) 327-4242</p>
        <p className="mt-3 font-semibold text-blue-700">Invoice ID: #{invoiceData.jobId.toString().padStart(4, '0')}</p>
        <p>Date Issued: {new Date().toLocaleDateString()}</p>
        <p>Job Date: {invoiceData.date}</p>
      </div>

      {/* Customer & Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b border-gray-200 pb-6 print:border-none">
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">Customer</h2>
          <p><strong>Name:</strong> {invoiceData.customer.name}</p>
          <p><strong>Phone:</strong> {invoiceData.customer.phone}</p>
          <p><strong>Email:</strong> {invoiceData.customer.email}</p>
          <p><strong>Address:</strong> {invoiceData.customer.address}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">Vehicle</h2>
          <p><strong>{invoiceData.vehicle.year} {invoiceData.vehicle.make} {invoiceData.vehicle.model}</strong></p>
          <p><strong>VIN:</strong> {invoiceData.vehicle.vin}</p>
          <p><strong>Plate:</strong> {invoiceData.vehicle.licensePlate}</p>
          <p><strong>Mileage:</strong> {invoiceData.vehicle.mileage} mi</p>
          <p><strong>Oil Type:</strong> {invoiceData.vehicle.oilType}</p>
        </div>
      </div>

      {/* Work Order Details */}
      <div className="mb-6 border-b border-gray-200 pb-6 print:border-none">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Work Order</h2>
        <p><strong>Description:</strong> {invoiceData.description}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadge(invoiceData.status)}`}>{invoiceData.status}</span></p>
        <p><strong>Fluids Checked:</strong> {formatCheckList(invoiceData.fluids)}</p>
        <p><strong>Belts Checked:</strong> {formatCheckList(invoiceData.belts)}</p>
        <p><strong>Notes:</strong> {invoiceData.notes}</p>
      </div>

      {/* Parts & Labor */}
      {invoiceData.parts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Parts</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
            </thead>
            <tbody>
              {invoiceData.parts.map((p, i) => (
                <tr key={i} className="text-right">
                  <td className="text-left px-2">{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{currency(p.costPerUnit)}</td>
                  <td>{currency(p.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoiceData.labor.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Labor</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr><th>Description</th><th>Hours</th><th>Rate</th><th>Total</th></tr>
            </thead>
            <tbody>
              {invoiceData.labor.map((l, i) => (
                <tr key={i} className="text-right">
                  <td className="text-left px-2">{l.description}</td>
                  <td>{l.hours.toFixed(1)}</td>
                  <td>{currency(l.ratePerHour)}</td>
                  <td>{currency(l.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="text-right border-t-2 pt-4">
        <p><strong>Base Job:</strong> {currency(invoiceData.actualJobCost)}</p>
        <p><strong>Parts:</strong> {currency(invoiceData.partsTotal)}</p>
        <p><strong>Labor:</strong> {currency(invoiceData.laborTotal)}</p>
        <p><strong>Subtotal:</strong> {currency(subtotal)}</p>
        <p><strong>Hazardous Waste:</strong> {currency(invoiceData.hazardousWasteFee)}</p>
        <p><strong>Shop Supplies:</strong> {currency(invoiceData.shopSuppliesFee)}</p>
        <p><strong>Tax ({invoiceData.taxRate}%):</strong> {currency(tax)}</p>
        <p className="text-2xl font-bold text-red-700 mt-2">Total: {currency(total)}</p>
      </div>

      {/* Print-only Signature */}
      <div className="hidden print:block mt-10 text-center border-t pt-6 text-gray-800">
        <p>Customer Signature: ____________________________</p>
        <p>Date: ____________________</p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4 justify-end print:hidden">
        <button onClick={handlePrint} className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800">🖨️ Print</button>
        <button onClick={handlePDFDownload} className="bg-indigo-700 text-white px-4 py-2 rounded shadow hover:bg-indigo-800">📄 Download PDF</button>
        <button onClick={handleEmailInvoice} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">📧 Email</button>
        <button onClick={() => navigate(`/create-job/${jobId}`)} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">✏️ Edit</button>
      </div>
    </div>
  );
}

export default Invoice;
