// src/pages/Reports.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataOperations } from '../hooks/useDataOperations';
import { Printer, FileJson, FileSpreadsheet } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// ✨ Chart.js registration
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// --- Export helpers ---
const exportAsJson = (data, fileName) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
};

const exportAsCsv = (data, fileName) => {
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).join(',');
  const csvContent = `${headers}\n${values}`;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
};

// --- Chart component ---
const ReportChart = ({ data }) => {
  if (!data) return null;

  const chartData = {
    labels: ['Labor', 'Parts', 'Fees & Supplies', 'Tax'],
    datasets: [{
      label: 'Revenue Breakdown',
      data: [
        data.totalLaborCost,
        data.totalPartsCost,
        (data.totalHazardousFees || 0) + (data.totalShopSupplies || 0),
        data.totalTaxCollected
      ],
      backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#ef4444'],
      borderColor: ['#1e40af', '#059669', '#c2410c', '#b91c1c'],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Revenue Breakdown' },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

function Reports() {
  const navigate = useNavigate();
  const { reportOps, utils } = useDataOperations();

  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  });
  const [reportData, setReportData] = useState(null);

  const currency = (num) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(num || 0);

  const handlePresetClick = (preset) => {
    const end = new Date();
    let start = new Date();

    if (preset === 'yesterday') {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (preset === '7days') {
      start.setDate(start.getDate() - 6);
    } else if (preset === 'this_month') {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
    }

    const newRange = {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
    setDateRange(newRange);
    setReportType(newRange.start === newRange.end ? 'daily' : 'period');
  };

  const handleGenerateReport = async () => {
    let result;
    if (reportType === "daily") {
      result = await reportOps.getDailySummary(dateRange.start);
    } else {
      result = await reportOps.getPeriodSummary(dateRange);
    }
    if (result.success) {
      setReportData(result.data);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (type) => {
    const filename = `report_${reportType}_${dateRange.start}_${dateRange.end}`;
    if (type === 'json') {
      exportAsJson(reportData, filename);
    } else if (type === 'csv') {
      exportAsCsv(reportData, filename);
    }
  };

  const isLoading =
    utils.isLoading('getDailySummary') || utils.isLoading('getPeriodSummary');

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-lg">
        {/* Report Options UI */}
        <div className="print:hidden">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Reports Dashboard</h1>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-gray-700">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handlePresetClick('today')} className="px-3 py-1 text-sm bg-gray-200 rounded">Today</button>
                <button onClick={() => handlePresetClick('yesterday')} className="px-3 py-1 text-sm bg-gray-200 rounded">Yesterday</button>
                <button onClick={() => handlePresetClick('7days')} className="px-3 py-1 text-sm bg-gray-200 rounded">Last 7 Days</button>
                <button onClick={() => handlePresetClick('this_month')} className="px-3 py-1 text-sm bg-gray-200 rounded">This Month</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="mt-4 w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
            >
              {isLoading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* --- Report Output --- */}
        {isLoading && <div className="text-center py-10">Loading Report...</div>}

        {!isLoading && reportData && (
          <div id="print-area">
            {/* Chart */}
            <div className="mb-8">
              <ReportChart data={reportData} />
            </div>

            {/* Summary */}
            <div className="p-6 bg-gray-50 rounded border shadow-inner">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Report Summary</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Total Labor:</strong> {currency(reportData.totalLaborCost)}</li>
                <li><strong>Total Parts:</strong> {currency(reportData.totalPartsCost)}</li>
                <li><strong>Hazardous Fees:</strong> {currency(reportData.totalHazardousFees)}</li>
                <li><strong>Shop Supplies:</strong> {currency(reportData.totalShopSupplies)}</li>
                <li><strong>Tax Collected:</strong> {currency(reportData.totalTaxCollected)}</li>
                <li><strong>Total Revenue:</strong> {currency(reportData.totalRevenue)}</li>
              </ul>

              {/* Buttons */}
              <div className="mt-8 flex gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Printer size={18} /> Print
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  <FileJson size={18} /> Download JSON
                </button>
                <button
                  onClick={() => handleDownload('csv')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  <FileSpreadsheet size={18} /> Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !reportData && (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">Your Reports Will Appear Here</h3>
            <p className="text-gray-500 mt-2">Select your desired options and click "Generate Report".</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Reports;
