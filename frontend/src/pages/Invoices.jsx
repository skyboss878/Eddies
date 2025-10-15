// src/pages/Invoice.jsx - FIXED VERSION
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { apiEndpoints } from "../utils";
import html2pdf from "html2pdf.js";

function Invoice() {
  const navigate = useNavigate();
  const { id: invoiceId } = useParams(); // Changed from jobId to invoiceId
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // ... other existing functions ...

  useEffect(() => {
    async function fetchInvoice() {
      if (!invoiceId) return setLoading(false);
      setLoading(true);
      try {
        // FIXED: Call the actual invoice endpoint instead of jobs
        const invoice = await apiEndpoints.invoices.getById(invoiceId);
        
        // Get related data
        const [vehicle, customer] = await Promise.all([
          apiEndpoints.vehicles.getById(invoice.vehicleId),
          apiEndpoints.customers.getById(invoice.customerId),
        ]);

        // Set invoice data properly
        setInvoiceData({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          date: invoice.date || new Date().toISOString().slice(0, 10),
          customer: {
            name: customer.name || `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            zip_code: customer.zip_code
          },
          vehicle: {
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin,
            license: vehicle.license_plate,
            mileage: vehicle.mileage
          },
          // Use invoice data instead of calculating from job parts/labor
          partsTotal: invoice.parts_total || 0,
          laborTotal: invoice.labor_total || 0,
          taxAmount: invoice.tax_amount || 0,
          totalAmount: invoice.total_amount || 0,
          status: invoice.status,
          // Include line items if available
          parts: invoice.parts || [],
          labor: invoice.labor || [],
          // Additional invoice fields
          dueDate: invoice.due_date,
          paidDate: invoice.paid_date,
          paymentStatus: invoice.payment_status,
          notes: invoice.notes
        });

      } catch (err) {
        console.error("Error fetching invoice:", err);
        setMessage({ 
          text: `Error loading invoice: ${err.message}`, 
          type: "error" 
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [invoiceId]); // Changed dependency

  const subtotal = invoiceData
    ? invoiceData.partsTotal + invoiceData.laborTotal
    : 0;

  const handleEmailInvoice = () => {
    showCustomConfirm("Email this invoice to the customer?", async () => {
      try {
        // FIXED: Call proper invoice email endpoint (needs to be implemented in backend)
        await apiEndpoints.invoices.email?.(invoiceId);
        showMessage("Invoice emailed successfully", "success");
      } catch (err) {
        showMessage("Error emailing invoice: " + err.message, "error");
      }
    });
  };

  const handleMarkPaid = () => {
    showCustomConfirm("Mark this invoice as paid?", async () => {
      try {
        await apiEndpoints.invoices.markPaid(invoiceId);
        showMessage("Invoice marked as paid", "success");
        // Refresh invoice data
        window.location.reload();
      } catch (err) {
        showMessage("Error marking invoice as paid: " + err.message, "error");
      }
    });
  };

  // Rest of component remains similar but uses invoiceData properly
  // ... rest of existing component code ...

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Invoice display using proper invoice data */}
      {invoiceData && (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-gray-300">#{invoiceData.invoiceNumber}</p>
              <p className="text-gray-300">Date: {invoiceData.date}</p>
              {invoiceData.dueDate && (
                <p className="text-gray-300">Due: {invoiceData.dueDate}</p>
              )}
            </div>
            
            {/* Payment status indicator */}
            <div className={`px-4 py-2 rounded-lg ${
              invoiceData.paymentStatus === 'paid' 
                ? 'bg-green-600' 
                : invoiceData.paymentStatus === 'overdue'
                ? 'bg-red-600'
                : 'bg-yellow-600'
            }`}>
              {invoiceData.paymentStatus?.toUpperCase() || 'PENDING'}
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p>{invoiceData.customer.name}</p>
              <p>{invoiceData.customer.email}</p>
              <p>{invoiceData.customer.phone}</p>
              {invoiceData.customer.address && (
                <>
                  <p>{invoiceData.customer.address}</p>
                  <p>{invoiceData.customer.city}, {invoiceData.customer.state} {invoiceData.customer.zip_code}</p>
                </>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Vehicle:</h3>
              <p>{invoiceData.vehicle.year} {invoiceData.vehicle.make} {invoiceData.vehicle.model}</p>
              <p>VIN: {invoiceData.vehicle.vin}</p>
              <p>License: {invoiceData.vehicle.license}</p>
              <p>Mileage: {invoiceData.vehicle.mileage?.toLocaleString()}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Parts */}
                {invoiceData.parts?.map((part, index) => (
                  <tr key={`part-${index}`} className="border-b border-gray-700">
                    <td className="py-2">{part.description}</td>
                    <td className="text-right py-2">{part.quantity}</td>
                    <td className="text-right py-2">${part.unit_price?.toFixed(2)}</td>
                    <td className="text-right py-2">${part.total_price?.toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Labor */}
                {invoiceData.labor?.map((labor, index) => (
                  <tr key={`labor-${index}`} className="border-b border-gray-700">
                    <td className="py-2">{labor.description}</td>
                    <td className="text-right py-2">{labor.hours}</td>
                    <td className="text-right py-2">${labor.rate?.toFixed(2)}</td>
                    <td className="text-right py-2">${labor.total_cost?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax:</span>
                <span>${invoiceData.taxAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-600 font-bold text-lg">
                <span>Total:</span>
                <span>${invoiceData.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => navigate('/invoices')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Back to Invoices
            </button>
            
            {invoiceData.paymentStatus !== 'paid' && (
              <button 
                onClick={handleMarkPaid}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
              >
                Mark as Paid
              </button>
            )}
            
            <button 
              onClick={handleEmailInvoice}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
            >
              Email Invoice
            </button>
            
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
            >
              Print Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
