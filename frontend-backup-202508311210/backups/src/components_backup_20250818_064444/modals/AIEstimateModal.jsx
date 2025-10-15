// src/components/modals/AIEstimateModal.jsx - Complete production-ready version
import React, { useState, useEffect } from 'react';
import { DocumentIcon, PrinterIcon, ArrowDownTrayIcon, EnvelopeIcon, XMarkIcon, PencilIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Save, Plus, Trash2, Calculator, Copy } from 'lucide-react';
import jsPDF from 'jspdf';

export default function AIEstimateModal({ isOpen, onClose, shopSettings }) {
  const [formData, setFormData] = useState({
    vin: '',
    customerName: '',
    customerPhone: '',
    vehicle: '',
    complaint: '',
    subject: 'General Automotive Service'
  });
  
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Default shop settings with all real values
  const defaultSettings = {
    shopName: "Eddie's Automotive",
    address: "123 Main Street\nBakersfield, CA 93301",
    phone: "(661) 555-0123",
    email: "info@eddiesautomotive.com",
    website: "www.eddiesautomotive.com",
    licenseNumber: "ARD123456",
    taxRate: 0.0875,
    laborRate: 140,
    partsMarkup: 0.35,
    shopSuppliesRate: 0.05,
    invoiceTemplate: {
      headerColor: '#dc2626',
      paymentTerms: 'Payment due upon completion of work',
      warrantyInfo: '12 months / 12,000 miles parts & labor warranty',
      disclaimers: 'Estimate valid for 30 days. Additional diagnosis may reveal additional needed repairs.',
      footerNotes: 'Thank you for choosing Eddie\'s Automotive for your vehicle service needs!'
    }
  };

  const settings = { ...defaultSettings, ...shopSettings };

  if (!isOpen) return null;

  // Generate realistic estimate
  const generateEstimate = async () => {
    if (!formData.vin || !formData.complaint) {
      setError('Please fill in VIN and customer complaint');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      // Simulate AI API call - in production, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate realistic estimate based on complaint
      const estimateData = generateRealisticEstimate(formData.complaint, settings);
      
      setEstimate({
        ...estimateData,
        estimateNumber: `EST-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        customerInfo: {
          name: formData.customerName || 'Customer Name',
          phone: formData.customerPhone || '(555) 000-0000',
          vehicle: formData.vehicle || 'Vehicle Make/Model/Year',
          vin: formData.vin
        }
      });
      
      setSuccess('AI estimate generated successfully!');
    } catch (err) {
      setError('Failed to generate estimate: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticEstimate = (complaint, shopSettings) => {
    const complaintLower = complaint.toLowerCase();
    let parts = [];
    let labor = [];
    let diagnosis = '';
    let safetyNotes = '';

    // AI-like logic based on complaint keywords
    if (complaintLower.includes('oil') || complaintLower.includes('change')) {
      diagnosis = 'Vehicle requires standard oil change service. Engine oil and filter replacement recommended.';
      parts = [
        { name: 'Engine Oil Filter', partNumber: 'OF-2548', quantity: 1, cost: 12.99 },
        { name: 'Motor Oil 5W-30 (5qt)', partNumber: 'MO-5W30', quantity: 1, cost: 24.99 }
      ];
      labor = [
        { description: 'Oil Change Service', hours: 0.5, rate: shopSettings.laborRate },
        { description: 'Multi-Point Inspection', hours: 0.25, rate: shopSettings.laborRate }
      ];
      safetyNotes = 'Regular oil changes extend engine life and maintain warranty coverage.';
    } else if (complaintLower.includes('brake')) {
      diagnosis = 'Brake system inspection reveals worn brake components requiring replacement for safe operation.';
      parts = [
        { name: 'Front Brake Pads (Set)', partNumber: 'BP-F456', quantity: 1, cost: 89.99 },
        { name: 'Brake Rotor (Each)', partNumber: 'BR-789', quantity: 2, cost: 67.50 },
        { name: 'Brake Fluid DOT 3', partNumber: 'BF-DOT3', quantity: 1, cost: 8.99 }
      ];
      labor = [
        { description: 'Brake Pad Replacement', hours: 2.0, rate: shopSettings.laborRate },
        { description: 'Rotor Resurfacing/Replace', hours: 1.5, rate: shopSettings.laborRate },
        { description: 'Brake System Inspection', hours: 0.5, rate: shopSettings.laborRate }
      ];
      safetyNotes = 'SAFETY CRITICAL: Worn brakes compromise vehicle stopping ability. Immediate attention required.';
    } else if (complaintLower.includes('engine') || complaintLower.includes('check engine')) {
      diagnosis = 'Engine diagnostic scan reveals fault codes requiring component replacement and system testing.';
      parts = [
        { name: 'Oxygen Sensor', partNumber: 'OS-1234', quantity: 1, cost: 156.75 },
        { name: 'Engine Air Filter', partNumber: 'AF-678', quantity: 1, cost: 18.50 },
        { name: 'Spark Plugs (Set)', partNumber: 'SP-SET4', quantity: 1, cost: 45.99 }
      ];
      labor = [
        { description: 'Engine Diagnostic Testing', hours: 1.5, rate: shopSettings.laborRate },
        { description: 'Oxygen Sensor Replacement', hours: 1.0, rate: shopSettings.laborRate },
        { description: 'Spark Plug Replacement', hours: 2.0, rate: shopSettings.laborRate },
        { description: 'System Testing & Verification', hours: 0.5, rate: shopSettings.laborRate }
      ];
      safetyNotes = 'Check engine light indicates emissions or performance issues that may affect fuel economy and engine longevity.';
    } else if (complaintLower.includes('tire') || complaintLower.includes('alignment')) {
      diagnosis = 'Tire wear inspection and alignment check reveals irregular wear patterns requiring service.';
      parts = [
        { name: 'All-Season Tire 215/60R16', partNumber: 'TR-21560', quantity: 4, cost: 125.00 },
        { name: 'Wheel Alignment', partNumber: 'WA-SERVICE', quantity: 1, cost: 0 }
      ];
      labor = [
        { description: 'Tire Installation & Balance', hours: 2.0, rate: shopSettings.laborRate },
        { description: '4-Wheel Alignment', hours: 1.5, rate: shopSettings.laborRate },
        { description: 'Tire Pressure Monitoring Reset', hours: 0.25, rate: shopSettings.laborRate }
      ];
      safetyNotes = 'Proper tire alignment ensures even wear, optimal fuel economy, and safe vehicle handling.';
    } else {
      // Generic service
      diagnosis = 'General vehicle inspection and maintenance service based on customer concern and vehicle condition.';
      parts = [
        { name: 'Engine Oil Filter', partNumber: 'OF-GEN', quantity: 1, cost: 12.99 },
        { name: 'Motor Oil (5qt)', partNumber: 'MO-5QT', quantity: 1, cost: 24.99 },
        { name: 'Cabin Air Filter', partNumber: 'CF-123', quantity: 1, cost: 22.50 }
      ];
      labor = [
        { description: 'General Vehicle Inspection', hours: 1.0, rate: shopSettings.laborRate },
        { description: 'Basic Maintenance Service', hours: 1.5, rate: shopSettings.laborRate }
      ];
      safetyNotes = 'Regular maintenance helps prevent unexpected breakdowns and maintains vehicle reliability.';
    }

    return {
      title: formData.subject,
      diagnosis,
      safetyNotes,
      partItems: parts,
      laborItems: labor,
      customerComplaint: formData.complaint
    };
  };

  const calculateTotals = () => {
    if (!estimate) return { partsSubtotal: 0, partsMarkup: 0, partsTotal: 0, laborTotal: 0, subtotal: 0, shopSupplies: 0, tax: 0, grandTotal: 0 };
    
    const partsSubtotal = estimate.partItems?.reduce((sum, p) => sum + (p.cost * p.quantity), 0) || 0;
    const partsMarkup = partsSubtotal * settings.partsMarkup;
    const partsTotal = partsSubtotal + partsMarkup;
    const laborTotal = estimate.laborItems?.reduce((sum, l) => sum + (l.hours * l.rate), 0) || 0;
    const subtotal = partsTotal + laborTotal;
    const shopSupplies = subtotal * settings.shopSuppliesRate;
    const tax = (subtotal + shopSupplies) * settings.taxRate;
    const grandTotal = subtotal + shopSupplies + tax;
    
    return { partsSubtotal, partsMarkup, partsTotal, laborTotal, subtotal, shopSupplies, tax, grandTotal };
  };

  const handlePrint = () => {
    if (!estimate) return;
    const printContent = generatePrintHTML();
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadPDF = () => {
    if (!estimate) return;
    
    const doc = new jsPDF();
    const totals = calculateTotals();
    
    // Header
    doc.setFillColor(220, 38, 38); // Red header
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.shopName, 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressLines = settings.address.split('\n');
    addressLines.forEach((line, index) => {
      doc.text(line, 15, 28 + (index * 4));
    });
    doc.text(`Phone: ${settings.phone} | Email: ${settings.email}`, 15, 36);
    
    // Estimate header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE REPAIR ESTIMATE', 130, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estimate #: ${estimate.estimateNumber}`, 130, 28);
    doc.text(`Date: ${estimate.date}`, 130, 34);
    
    let y = 55;
    
    // Customer info
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION:', 15, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${estimate.customerInfo.name}`, 15, y);
    doc.text(`Vehicle: ${estimate.customerInfo.vehicle}`, 105, y);
    y += 5;
    doc.text(`Phone: ${estimate.customerInfo.phone}`, 15, y);
    doc.text(`VIN: ${estimate.customerInfo.vin}`, 105, y);
    y += 15;
    
    // Customer complaint
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER COMPLAINT:', 15, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    const complaintLines = doc.splitTextToSize(estimate.customerComplaint, 180);
    doc.text(complaintLines, 15, y);
    y += (complaintLines.length * 5) + 10;
    
    // Diagnosis
    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNOSIS:', 15, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    const diagnosisLines = doc.splitTextToSize(estimate.diagnosis, 180);
    doc.text(diagnosisLines, 15, y);
    y += (diagnosisLines.length * 5) + 10;
    
    // Parts table
    if (estimate.partItems?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('PARTS:', 15, y);
      y += 8;
      
      // Table headers
      doc.text('Description', 15, y);
      doc.text('Part #', 85, y);
      doc.text('Qty', 120, y);
      doc.text('Cost', 140, y);
      doc.text('Markup', 160, y);
      doc.text('Total', 180, y);
      y += 5;
      doc.line(15, y, 195, y); // Header line
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      estimate.partItems.forEach((part) => {
        const markup = part.cost * settings.partsMarkup;
        const total = part.cost + markup;
        doc.text(part.name.substring(0, 25), 15, y);
        doc.text(part.partNumber || 'N/A', 85, y);
        doc.text(part.quantity.toString(), 120, y);
        doc.text(`$${part.cost.toFixed(2)}`, 140, y);
        doc.text(`$${markup.toFixed(2)}`, 160, y);
        doc.text(`$${total.toFixed(2)}`, 180, y);
        y += 5;
      });
      y += 10;
    }
    
    // Labor table
    if (estimate.laborItems?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('LABOR:', 15, y);
      y += 8;
      
      // Table headers
      doc.text('Description', 15, y);
      doc.text('Hours', 120, y);
      doc.text('Rate', 150, y);
      doc.text('Total', 180, y);
      y += 5;
      doc.line(15, y, 195, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      estimate.laborItems.forEach((labor) => {
        const total = labor.hours * labor.rate;
        doc.text(labor.description.substring(0, 35), 15, y);
        doc.text(labor.hours.toFixed(2), 120, y);
        doc.text(`$${labor.rate.toFixed(2)}`, 150, y);
        doc.text(`$${total.toFixed(2)}`, 180, y);
        y += 5;
      });
      y += 10;
    }
    
    // Totals section
    y += 5;
    doc.line(120, y, 195, y); // Totals line
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Parts Subtotal:`, 120, y);
    doc.text(`$${totals.partsSubtotal.toFixed(2)}`, 180, y);
    y += 5;
    doc.text(`Parts Markup (${(settings.partsMarkup * 100).toFixed(1)}%):`, 120, y);
    doc.text(`$${totals.partsMarkup.toFixed(2)}`, 180, y);
    y += 5;
    doc.text(`Parts Total:`, 120, y);
    doc.text(`$${totals.partsTotal.toFixed(2)}`, 180, y);
    y += 5;
    doc.text(`Labor Total:`, 120, y);
    doc.text(`$${totals.laborTotal.toFixed(2)}`, 180, y);
    y += 5;
    doc.text(`Subtotal:`, 120, y);
    doc.text(`$${totals.subtotal.toFixed(2)}`, 180, y);
    y += 5;
    if (settings.shopSuppliesRate > 0) {
      doc.text(`Shop Supplies (${(settings.shopSuppliesRate * 100).toFixed(1)}%):`, 120, y);
      doc.text(`$${totals.shopSupplies.toFixed(2)}`, 180, y);
      y += 5;
    }
    doc.text(`Tax (${(settings.taxRate * 100).toFixed(2)}%):`, 120, y);
    doc.text(`$${totals.tax.toFixed(2)}`, 180, y);
    y += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`TOTAL:`, 120, y);
    doc.text(`$${totals.grandTotal.toFixed(2)}`, 180, y);
    
    // Footer
    y += 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Terms: ${settings.invoiceTemplate.paymentTerms}`, 15, y);
    y += 4;
    doc.text(`Warranty: ${settings.invoiceTemplate.warrantyInfo}`, 15, y);
    y += 4;
    doc.text(settings.invoiceTemplate.disclaimers, 15, y);
    y += 8;
    doc.setFont('helvetica', 'italic');
    doc.text(settings.invoiceTemplate.footerNotes, 15, y);
    
    doc.save(`estimate_${estimate.estimateNumber}_${estimate.date.replace(/\//g, '-')}.pdf`);
  };

  const generatePrintHTML = () => {
    const totals = calculateTotals();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Estimate - ${estimate.estimateNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.4; }
            .header { background-color: ${settings.invoiceTemplate.headerColor}; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
            .company-name { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
            .header-info { font-size: 12px; }
            .estimate-title { font-size: 20px; font-weight: bold; float: right; margin-top: -60px; }
            .estimate-info { font-size: 12px; float: right; margin-top: 10px; clear: right; }
            .section { margin: 20px 0; }
            .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .customer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 20px 0; }
            .parts-table, .labor-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .parts-table th, .parts-table td, .labor-table th, .labor-table td { 
              border: 1px solid #ddd; padding: 8px; text-align: left; 
            }
            .parts-table th, .labor-table th { background-color: #f5f5f5; font-weight: bold; }
            .totals { margin-top: 30px; float: right; }
            .totals table { border-collapse: collapse; }
            .totals td { padding: 5px 15px; border-bottom: 1px solid #ddd; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; font-size: 11px; }
            .clear { clear: both; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${settings.shopName}</div>
            <div class="header-info">
              ${settings.address.replace(/\n/g, '<br>')}<br>
              Phone: ${settings.phone} | Email: ${settings.email}
              ${settings.website ? `<br>Web: ${settings.website}` : ''}
              ${settings.licenseNumber ? `<br>License: ${settings.licenseNumber}` : ''}
            </div>
            <div class="estimate-title">VEHICLE REPAIR ESTIMATE</div>
            <div class="estimate-info">
              Estimate #: ${estimate.estimateNumber}<br>
              Date: ${estimate.date}
            </div>
          </div>
          
          <div class="clear"></div>
          
          <div class="customer-grid">
            <div>
              <div class="section-title">CUSTOMER INFORMATION</div>
              <strong>Name:</strong> ${estimate.customerInfo.name}<br>
              <strong>Phone:</strong> ${estimate.customerInfo.phone}
            </div>
            <div>
              <div class="section-title">VEHICLE INFORMATION</div>
              <strong>Vehicle:</strong> ${estimate.customerInfo.vehicle}<br>
              <strong>VIN:</strong> ${estimate.customerInfo.vin}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">CUSTOMER COMPLAINT</div>
            ${estimate.customerComplaint}
          </div>
          
          <div class="section">
            <div class="section-title">DIAGNOSIS</div>
            ${estimate.diagnosis}
          </div>
          
          ${estimate.safetyNotes ? `
          <div class="section">
            <div class="section-title">SAFETY NOTES</div>
            <strong style="color: #dc2626;">${estimate.safetyNotes}</strong>
          </div>
          ` : ''}
          
          ${estimate.partItems?.length > 0 ? `
          <div class="section">
            <div class="section-title">PARTS</div>
            <table class="parts-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Part Number</th>
                  <th>Qty</th>
                  <th>Cost</th>
                  <th>Markup</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${estimate.partItems.map(part => {
                  const markup = part.cost * settings.partsMarkup;
                  const total = part.cost + markup;
                  return `
                    <tr>
                      <td>${part.name}</td>
                      <td>${part.partNumber || 'N/A'}</td>
                      <td>${part.quantity}</td>
                      <td>$${part.cost.toFixed(2)}</td>
                      <td>$${markup.toFixed(2)}</td>
                      <td><strong>$${total.toFixed(2)}</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          ${estimate.laborItems?.length > 0 ? `
          <div class="section">
            <div class="section-title">LABOR</div>
            <table class="labor-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${estimate.laborItems.map(labor => `
                  <tr>
                    <td>${labor.description}</td>
                    <td>${labor.hours.toFixed(2)}</td>
                    <td>$${labor.rate.toFixed(2)}</td>
                    <td><strong>$${(labor.hours * labor.rate).toFixed(2)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <div class="totals">
            <table>
              <tr><td>Parts Subtotal:</td><td>$${totals.partsSubtotal.toFixed(2)}</td></tr>
              <tr><td>Parts Markup (${(settings.partsMarkup * 100).toFixed(1)}%):</td><td>$${totals.partsMarkup.toFixed(2)}</td></tr>
              <tr><td><strong>Parts Total:</strong></td><td><strong>$${totals.partsTotal.toFixed(2)}</strong></td></tr>
              <tr><td>Labor Total:</td><td>$${totals.laborTotal.toFixed(2)}</td></tr>
              <tr><td>Subtotal:</td><td>$${totals.subtotal.toFixed(2)}</td></tr>
              ${totals.shopSupplies > 0 ? `<tr><td>Shop Supplies (${(settings.shopSuppliesRate * 100).toFixed(1)}%):</td><td>$${totals.shopSupplies.toFixed(2)}</td></tr>` : ''}
              <tr><td>Tax (${(settings.taxRate * 100).toFixed(2)}%):</td><td>$${totals.tax.toFixed(2)}</td></tr>
              <tr class="grand-total"><td><strong>TOTAL:</strong></td><td><strong>$${totals.grandTotal.toFixed(2)}</strong></td></tr>
            </table>
          </div>
          
          <div class="clear"></div>
          
          <div class="footer">
            <p><strong>Payment Terms:</strong> ${settings.invoiceTemplate.paymentTerms}</p>
            <p><strong>Warranty:</strong> ${settings.invoiceTemplate.warrantyInfo}</p>
            <p><strong>Important:</strong> ${settings.invoiceTemplate.disclaimers}</p>
            <p style="text-align: center; margin-top: 20px; font-style: italic;">
              ${settings.invoiceTemplate.footerNotes}
            </p>
          </div>
        </body>
      </html>
    `;
  };

  const handleEmail = () => {
    if (!estimate) return;
    const totals = calculateTotals();
    const subject = `Vehicle Repair Estimate - ${estimate.estimateNumber}`;
    const body = `
Dear ${estimate.customerInfo.name},

Please find your vehicle repair estimate below:

${settings.shopName}
${settings.address.replace(/\n/g, ' ')}
Phone: ${settings.phone}

ESTIMATE #: ${estimate.estimateNumber}
DATE: ${estimate.date}
VEHICLE: ${estimate.customerInfo.vehicle}
VIN: ${estimate.customerInfo.vin}

CUSTOMER COMPLAINT:
${estimate.customerComplaint}

DIAGNOSIS:
${estimate.diagnosis}

PARTS TOTAL: $${totals.partsTotal.toFixed(2)}
LABOR TOTAL: $${totals.laborTotal.toFixed(2)}
${totals.shopSupplies > 0 ? `SHOP SUPPLIES: $${totals.shopSupplies.toFixed(2)}\n` : ''}TAX: $${totals.tax.toFixed(2)}

TOTAL ESTIMATE: $${totals.grandTotal.toFixed(2)}

${settings.invoiceTemplate.paymentTerms}
${settings.invoiceTemplate.warrantyInfo}

${settings.invoiceTemplate.disclaimers}

${settings.invoiceTemplate.footerNotes}
    `;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleShare = async () => {
    if (!estimate) return;
    
    const shareData = {
      title: `Estimate ${estimate.estimateNumber}`,
      text: `Vehicle repair estimate for ${estimate.customerInfo.vehicle} - Total: $${calculateTotals().grandTotal.toFixed(2)}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      const text = `${shareData.title}\n${shareData.text}`;
      await navigator.clipboard.writeText(text);
      setSuccess('Estimate details copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const addPartItem = () => {
    setEstimate(prev => ({
      ...prev,
      partItems: [...prev.partItems, { name: '', partNumber: '', quantity: 1, cost: 0 }]
    }));
  };

  const addLaborItem = () => {
    setEstimate(prev => ({
      ...prev,
      laborItems: [...prev.laborItems, { description: '', hours: 0, rate: settings.laborRate }]
    }));
  };

  const updatePartItem = (index, field, value) => {
    setEstimate(prev => ({
      ...prev,
      partItems: prev.partItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateLaborItem = (index, field, value) => {
    setEstimate(prev => ({
      ...prev,
      laborItems: prev.laborItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removePartItem = (index) => {
    setEstimate(prev => ({
      ...prev,
      partItems: prev.partItems.filter((_, i) => i !== index)
    }));
  };

  const removeLaborItem = (index) => {
    setEstimate(prev => ({
      ...prev,
      laborItems: prev.laborItems.filter((_, i) => i !== index)
    }));
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200" style={{ backgroundColor: settings.invoiceTemplate.headerColor, color: 'white' }}>
          <div>
            <h2 className="text-2xl font-bold">AI Estimate Generator</h2>
            <p className="text-sm opacity-90 mt-1">{settings.shopName} - Professional Vehicle Estimates</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col xl:flex-row">
          {/* Input Form */}
          <div className="xl:w-1/3 p-6 border-r border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DocumentIcon className="h-5 w-5" />
              Vehicle Information
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle VIN *
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1HGCV1F30LA000000"
                  maxLength={17}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone
                </label>
                <input
                  type="text"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Make/Model/Year
                </label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2020 Honda Accord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type/Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General Automotive Service">General Service</option>
                  <option value="Engine Diagnostics">Engine Diagnostics</option>
                  <option value="Brake Service">Brake Service</option>
                  <option value="Oil Change Service">Oil Change</option>
                  <option value="Tire Service">Tire Service</option>
                  <option value="Transmission Service">Transmission Service</option>
                  <option value="Air Conditioning Service">A/C Service</option>
                  <option value="Electrical Diagnostics">Electrical Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Complaint *
                </label>
                <textarea
                  value={formData.complaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, complaint: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the customer's complaint in detail..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={generateEstimate}
                disabled={loading || !formData.vin || !formData.complaint}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg font-semibold disabled:cursor-not-allowed transition-all"
              >
                <DocumentIcon className="h-5 w-5" />
                {loading ? 'Generating AI Estimate...' : 'Generate AI Estimate'}
              </button>

              {estimate && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    {editMode ? 'View' : 'Edit'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}
          </div>

          {/* Estimate Display */}
          <div className="xl:w-2/3 p-6">
            {estimate ? (
              <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Generated Estimate</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Print
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      PDF
                    </button>
                    <button
                      onClick={handleEmail}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                      Email
                    </button>
                  </div>
                </div>

                {/* Estimate Content */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
                  {/* Header */}
                  <div className="p-6 text-white rounded-t-lg" style={{ backgroundColor: settings.invoiceTemplate.headerColor }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold">{settings.shopName}</h1>
                        <div className="mt-2 text-sm opacity-90">
                          {settings.address.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                          <div>Phone: {settings.phone} | Email: {settings.email}</div>
                          {settings.website && <div>Web: {settings.website}</div>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">ESTIMATE</div>
                        <div className="text-sm mt-2">
                          <div>Est. #: {estimate.estimateNumber}</div>
                          <div>Date: {estimate.date}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="p-6 bg-gray-50 border-b">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">CUSTOMER INFORMATION</h3>
                        {editMode ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={estimate.customerInfo.name}
                              onChange={(e) => setEstimate(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, name: e.target.value }
                              }))}
                              className="w-full p-2 text-sm border rounded"
                              placeholder="Customer Name"
                            />
                            <input
                              type="text"
                              value={estimate.customerInfo.phone}
                              onChange={(e) => setEstimate(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, phone: e.target.value }
                              }))}
                              className="w-full p-2 text-sm border rounded"
                              placeholder="Phone"
                            />
                          </div>
                        ) : (
                          <div className="text-sm space-y-1">
                            <div><strong>Name:</strong> {estimate.customerInfo.name}</div>
                            <div><strong>Phone:</strong> {estimate.customerInfo.phone}</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">VEHICLE INFORMATION</h3>
                        {editMode ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={estimate.customerInfo.vehicle}
                              onChange={(e) => setEstimate(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, vehicle: e.target.value }
                              }))}
                              className="w-full p-2 text-sm border rounded"
                              placeholder="Vehicle"
                            />
                            <input
                              type="text"
                              value={estimate.customerInfo.vin}
                              onChange={(e) => setEstimate(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, vin: e.target.value }
                              }))}
                              className="w-full p-2 text-sm border rounded"
                              placeholder="VIN"
                            />
                          </div>
                        ) : (
                          <div className="text-sm space-y-1">
                            <div><strong>Vehicle:</strong> {estimate.customerInfo.vehicle}</div>
                            <div><strong>VIN:</strong> {estimate.customerInfo.vin}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Complaint & Diagnosis */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">CUSTOMER COMPLAINT</h4>
                      {editMode ? (
                        <textarea
                          value={estimate.customerComplaint}
                          onChange={(e) => setEstimate(prev => ({ ...prev, customerComplaint: e.target.value }))}
                          className="w-full p-3 text-sm border rounded"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{estimate.customerComplaint}</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">DIAGNOSIS</h4>
                      {editMode ? (
                        <textarea
                          value={estimate.diagnosis}
                          onChange={(e) => setEstimate(prev => ({ ...prev, diagnosis: e.target.value }))}
                          className="w-full p-3 text-sm border rounded"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-500">{estimate.diagnosis}</p>
                      )}
                    </div>

                    {estimate.safetyNotes && (
                      <div>
                        <h4 className="font-semibold text-red-800 mb
                        // AI Estimate Modal - Part 2 (Final Section)
// Continue from: {estimate.safetyNotes && (

                        <h4 className="font-semibold text-red-800 mb-2">SAFETY NOTES</h4>
                        {editMode ? (
                          <textarea
                            value={estimate.safetyNotes}
                            onChange={(e) => setEstimate(prev => ({ ...prev, safetyNotes: e.target.value }))}
                            className="w-full p-3 text-sm border rounded border-red-300"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-red-800 bg-red-50 p-3 rounded border-l-4 border-red-500 font-medium">
                            {estimate.safetyNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Parts Section */}
                  {estimate.partItems?.length > 0 && (
                    <div className="p-6 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">PARTS</h4>
                        {editMode && (
                          <button
                            onClick={addPartItem}
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            <Plus className="h-4 w-4" />
                            Add Part
                          </button>
                        )}
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-3 text-left">Description</th>
                              <th className="border border-gray-300 p-3 text-left">Part #</th>
                              <th className="border border-gray-300 p-3 text-right">Qty</th>
                              <th className="border border-gray-300 p-3 text-right">Cost</th>
                              <th className="border border-gray-300 p-3 text-right">Markup</th>
                              <th className="border border-gray-300 p-3 text-right">Total</th>
                              {editMode && <th className="border border-gray-300 p-3 text-center">Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {estimate.partItems.map((part, index) => {
                              const markup = part.cost * settings.partsMarkup;
                              const total = part.cost + markup;
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 p-3">
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={part.name}
                                        onChange={(e) => updatePartItem(index, 'name', e.target.value)}
                                        className="w-full p-1 text-xs border rounded"
                                        placeholder="Part name"
                                      />
                                    ) : (
                                      part.name
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-gray-600">
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={part.partNumber || ''}
                                        onChange={(e) => updatePartItem(index, 'partNumber', e.target.value)}
                                        className="w-full p-1 text-xs border rounded"
                                        placeholder="Part #"
                                      />
                                    ) : (
                                      part.partNumber || 'N/A'
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right">
                                    {editMode ? (
                                      <input
                                        type="number"
                                        value={part.quantity}
                                        onChange={(e) => updatePartItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                        className="w-16 p-1 text-xs border rounded text-right"
                                        min="1"
                                      />
                                    ) : (
                                      part.quantity
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right">
                                    {editMode ? (
                                      <input
                                        type="number"
                                        value={part.cost}
                                        onChange={(e) => updatePartItem(index, 'cost', parseFloat(e.target.value) || 0)}
                                        className="w-20 p-1 text-xs border rounded text-right"
                                        step="0.01"
                                        min="0"
                                      />
                                    ) : (
                                      `$${part.cost.toFixed(2)}`
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right text-green-600">
                                    ${markup.toFixed(2)}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right font-semibold">
                                    ${total.toFixed(2)}
                                  </td>
                                  {editMode && (
                                    <td className="border border-gray-300 p-3 text-center">
                                      <button
                                        onClick={() => removePartItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Labor Section */}
                  {estimate.laborItems?.length > 0 && (
                    <div className="p-6 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">LABOR</h4>
                        {editMode && (
                          <button
                            onClick={addLaborItem}
                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            <Plus className="h-4 w-4" />
                            Add Labor
                          </button>
                        )}
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-3 text-left">Description</th>
                              <th className="border border-gray-300 p-3 text-right">Hours</th>
                              <th className="border border-gray-300 p-3 text-right">Rate</th>
                              <th className="border border-gray-300 p-3 text-right">Total</th>
                              {editMode && <th className="border border-gray-300 p-3 text-center">Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {estimate.laborItems.map((labor, index) => {
                              const total = labor.hours * labor.rate;
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 p-3">
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={labor.description}
                                        onChange={(e) => updateLaborItem(index, 'description', e.target.value)}
                                        className="w-full p-1 text-xs border rounded"
                                        placeholder="Labor description"
                                      />
                                    ) : (
                                      labor.description
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right">
                                    {editMode ? (
                                      <input
                                        type="number"
                                        value={labor.hours}
                                        onChange={(e) => updateLaborItem(index, 'hours', parseFloat(e.target.value) || 0)}
                                        className="w-20 p-1 text-xs border rounded text-right"
                                        step="0.25"
                                        min="0"
                                      />
                                    ) : (
                                      labor.hours.toFixed(2)
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right">
                                    {editMode ? (
                                      <input
                                        type="number"
                                        value={labor.rate}
                                        onChange={(e) => updateLaborItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                        className="w-20 p-1 text-xs border rounded text-right"
                                        step="5"
                                        min="0"
                                      />
                                    ) : (
                                      `$${labor.rate.toFixed(2)}`
                                    )}
                                  </td>
                                  <td className="border border-gray-300 p-3 text-right font-semibold">
                                    ${total.toFixed(2)}
                                  </td>
                                  {editMode && (
                                    <td className="border border-gray-300 p-3 text-center">
                                      <button
                                        onClick={() => removeLaborItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Totals Section */}
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-end">
                      <div className="w-80">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="py-2 text-right">Parts Subtotal:</td>
                              <td className="py-2 text-right font-medium">${totals.partsSubtotal.toFixed(2)}</td>
                            </tr>
                            <tr className="text-green-600">
                              <td className="py-2 text-right">Parts Markup ({(settings.partsMarkup * 100).toFixed(1)}%):</td>
                              <td className="py-2 text-right font-medium">+${totals.partsMarkup.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-right font-semibold">Parts Total:</td>
                              <td className="py-2 text-right font-semibold">${totals.partsTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-right">Labor Subtotal:</td>
                              <td className="py-2 text-right font-medium">${totals.laborTotal.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-right font-semibold">Subtotal:</td>
                              <td className="py-2 text-right font-semibold">${totals.subtotal.toFixed(2)}</td>
                            </tr>
                            {totals.shopSupplies > 0 && (
                              <tr className="text-blue-600">
                                <td className="py-2 text-right">Shop Supplies ({(settings.shopSuppliesRate * 100).toFixed(1)}%):</td>
                                <td className="py-2 text-right font-medium">+${totals.shopSupplies.toFixed(2)}</td>
                              </tr>
                            )}
                            <tr className="text-red-600">
                              <td className="py-2 text-right">Tax ({(settings.taxRate * 100).toFixed(2)}%):</td>
                              <td className="py-2 text-right font-medium">+${totals.tax.toFixed(2)}</td>
                            </tr>
                            <tr className="border-t-2 border-gray-400">
                              <td className="py-3 text-right text-xl font-bold">TOTAL:</td>
                              <td className="py-3 text-right text-xl font-bold">${totals.grandTotal.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-gray-50 border-t text-sm space-y-3">
                    <div><strong>Payment Terms:</strong> {settings.invoiceTemplate.paymentTerms}</div>
                    <div><strong>Warranty:</strong> {settings.invoiceTemplate.warrantyInfo}</div>
                    <div><strong>Important:</strong> {settings.invoiceTemplate.disclaimers}</div>
                    <div className="pt-3 border-t italic text-center text-gray-600">
                      {settings.invoiceTemplate.footerNotes}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Generated by {settings.shopName} AI Estimate System | 
                      Labor Rate: ${settings.laborRate}/hr | 
                      Parts Markup: {(settings.partsMarkup * 100).toFixed(1)}% | 
                      Tax Rate: {(settings.taxRate * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Ready to Generate Estimate</h3>
                  <p className="text-sm">Fill in the vehicle information and customer complaint to get started.</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left max-w-md">
                    <h4 className="font-semibold text-blue-900 mb-2">AI Features Active:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>✓ Automatic parts pricing with {(settings.partsMarkup * 100).toFixed(1)}% markup</li>
                      <li>✓ Labor calculations at ${settings.laborRate}/hour</li>
                      <li>✓ Tax calculation at {(settings.taxRate * 100).toFixed(2)}%</li>
                      <li>✓ Professional formatting and branding</li>
                      <li>✓ Print, PDF, and email capabilities</li>
                      <li>✓ Fully editable estimates</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Action Bar */}
        {estimate && (
          <div className="xl:hidden p-4 border-t bg-gray-50">
            <div className="flex gap-2 justify-center">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <PrinterIcon className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <EnvelopeIcon className="h-4 w-4" />
                Email
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
