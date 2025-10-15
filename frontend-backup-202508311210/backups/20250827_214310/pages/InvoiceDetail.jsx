import React, { useState } from 'react';
import { Download, Mail, Printer, Edit, Car, Wrench, User, Building2, Phone, MapPin, CreditCard, AlertCircle, Check, Calendar, DollarSign, FileText, Shield } from 'lucide-react';

const AutomotiveInvoice = () => {
  const [invoiceData] = useState({
    // Invoice Header
    invoiceNumber: 'AUTO-2024-0847',
    workOrderNumber: 'WO-2024-0847',
    status: 'completed',
    dateCreated: '2024-08-20',
    dateCompleted: '2024-08-21',
    
    // Shop Information
    shop: {
      name: 'Premier Auto Repair',
      licenseNumber: 'ARD-12345-CA',
      address: '789 Mechanic Lane',
      city: 'Los Angeles, CA 90015',
      phone: '(555) AUTO-FIX',
      email: 'service@premierauto.com',
      certifications: ['ASE Certified', 'AAA Approved', 'NAPA AutoCare']
    },
    
    // Customer Information
    customer: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      address: '456 Customer St, Beverly Hills, CA 90210'
    },
    
    // Vehicle Information
    vehicle: {
      year: '2019',
      make: 'Honda',
      model: 'Civic',
      vin: '1HGBH41JXMN109186',
      licensePlate: '8ABC123',
      mileageIn: 45382,
      mileageOut: 45385,
      color: 'Silver'
    },
    
    // Labor Items
    labor: [
      {
        id: 1,
        description: 'Brake Pad Replacement - Front',
        laborHours: 1.5,
        hourlyRate: 125.00,
        amount: 187.50,
        technicianId: 'TECH-001'
      },
      {
        id: 2,
        description: 'Oil Change Service',
        laborHours: 0.5,
        hourlyRate: 125.00,
        amount: 62.50,
        technicianId: 'TECH-002'
      },
      {
        id: 3,
        description: 'Multi-Point Inspection',
        laborHours: 0.5,
        hourlyRate: 125.00,
        amount: 62.50,
        technicianId: 'TECH-001'
      }
    ],
    
    // Parts
    parts: [
      {
        id: 1,
        partNumber: 'BP-HON-CV19-F',
        description: 'Brake Pads - Front Set (Honda Civic 2019)',
        quantity: 1,
        unitPrice: 89.99,
        amount: 89.99,
        warranty: '12 months/12,000 miles'
      },
      {
        id: 2,
        partNumber: 'OF-5W30-5Q',
        description: 'Synthetic Motor Oil 5W-30 (5 Quarts)',
        quantity: 1,
        unitPrice: 34.99,
        amount: 34.99,
        warranty: 'N/A'
      },
      {
        id: 3,
        partNumber: 'OF-HON-CV19',
        description: 'Oil Filter - Honda Civic 2019',
        quantity: 1,
        unitPrice: 12.99,
        amount: 12.99,
        warranty: 'N/A'
      }
    ],
    
    // Additional Fees
    additionalFees: [
      {
        id: 1,
        description: 'Environmental Fee',
        amount: 5.00,
        required: true
      },
      {
        id: 2,
        description: 'Shop Supplies',
        amount: 15.00,
        required: false
      }
    ],
    
    // Authorization & Signatures
    authorization: {
      customerSignature: true,
      customerInitials: 'SJ',
      dateAuthorized: '2024-08-20',
      estimateApproved: true,
      workCompleted: true
    },
    
    // Payment Information
    payment: {
      method: 'Credit Card',
      cardLast4: '4567',
      transactionId: 'TXN-847291',
      paidDate: '2024-08-21'
    }
  });

  const laborSubtotal = invoiceData.labor.reduce((sum, item) => sum + item.amount, 0);
  const partsSubtotal = invoiceData.parts.reduce((sum, item) => sum + item.amount, 0);
  const additionalFeesTotal = invoiceData.additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
  const subtotal = laborSubtotal + partsSubtotal + additionalFeesTotal;
  const taxRate = 0.0875; // 8.75% CA tax rate
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Invoice</h1>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">#{invoiceData.invoiceNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoiceData.status)}`}>
                  {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Key Information Bar */}
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date Completed</p>
                <p className="font-semibold">{invoiceData.dateCompleted}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Work Order</p>
                <p className="font-semibold">{invoiceData.workOrderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{invoiceData.vehicle.year} {invoiceData.vehicle.make} {invoiceData.vehicle.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-lg">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Shop & Customer Info */}
        <div className="space-y-6">
          {/* Shop Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Service Provider</h2>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{invoiceData.shop.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>License: {invoiceData.shop.licenseNumber}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  <p>{invoiceData.shop.address}</p>
                  <p>{invoiceData.shop.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{invoiceData.shop.phone}</span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {invoiceData.shop.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Customer Information</h2>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{invoiceData.customer.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{invoiceData.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{invoiceData.customer.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{invoiceData.customer.address}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Vehicle Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Year</p>
                <p className="font-semibold">{invoiceData.vehicle.year}</p>
              </div>
              <div>
                <p className="text-gray-600">Make</p>
                <p className="font-semibold">{invoiceData.vehicle.make}</p>
              </div>
              <div>
                <p className="text-gray-600">Model</p>
                <p className="font-semibold">{invoiceData.vehicle.model}</p>
              </div>
              <div>
                <p className="text-gray-600">Color</p>
                <p className="font-semibold">{invoiceData.vehicle.color}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">VIN</p>
                <p className="font-semibold font-mono">{invoiceData.vehicle.vin}</p>
              </div>
              <div>
                <p className="text-gray-600">License Plate</p>
                <p className="font-semibold">{invoiceData.vehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-gray-600">Mileage</p>
                <p className="font-semibold">{invoiceData.vehicle.mileageIn.toLocaleString()} mi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Services & Parts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Labor Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Labor Services</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Service Description</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Hours</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Rate</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.labor.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-gray-500">Tech: {item.technicianId}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm">{item.laborHours}</td>
                      <td className="py-3 text-right text-sm">${item.hourlyRate.toFixed(2)}</td>
                      <td className="py-3 text-right text-sm font-semibold">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan="3" className="py-2 text-right font-semibold">Labor Subtotal:</td>
                    <td className="py-2 text-right font-semibold">${laborSubtotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Parts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Parts & Materials</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Part Description</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Qty</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Price</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.parts.map((part) => (
                    <tr key={part.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm">
                        <div>
                          <p className="font-medium">{part.description}</p>
                          <p className="text-gray-500">P/N: {part.partNumber}</p>
                          <p className="text-green-600 text-xs">Warranty: {part.warranty}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm">{part.quantity}</td>
                      <td className="py-3 text-right text-sm">${part.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right text-sm font-semibold">${part.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan="3" className="py-2 text-right font-semibold">Parts Subtotal:</td>
                    <td className="py-2 text-right font-semibold">${partsSubtotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Labor Subtotal:</span>
                <span>${laborSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Parts Subtotal:</span>
                <span>${partsSubtotal.toFixed(2)}</span>
              </div>
              {invoiceData.additionalFees.map((fee) => (
                <div key={fee.id} className="flex justify-between">
                  <span>{fee.description}:</span>
                  <span>${fee.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.75%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Paid via {invoiceData.payment.method} ending in {invoiceData.payment.cardLast4}</span>
              </div>
              <p className="text-sm text-gray-600">Transaction ID: {invoiceData.payment.transactionId}</p>
              <p className="text-sm text-gray-600">Paid on: {invoiceData.payment.paidDate}</p>
            </div>
          </div>

          {/* Authorization & Compliance */}
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Customer Authorization & Compliance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Customer authorized work on {invoiceData.authorization.dateAuthorized}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Estimate approved and work completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Customer initials: {invoiceData.authorization.customerInitials}</span>
                  </div>
                  <p className="text-yellow-700 font-medium mt-3">
                    This invoice complies with automotive bureau regulations for parts warranty disclosure, 
                    labor rate transparency, and customer authorization requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomotiveInvoice;
