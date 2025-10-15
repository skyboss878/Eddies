// src/pages/DataMigration.jsx
import React, { useState, useMemo } from 'react';
import { useDataOperations } from "../hooks";
import { UploadCloud, ArrowRight, CheckCircle, AlertTriangle, Loader2, FileText, Settings, Database } from 'lucide-react';

const SYSTEM_FIELDS = {
  // Customer Fields
  name: "Customer Name",
  phone: "Customer Phone",
  email: "Customer Email",
  address: "Street Address",
  city: "City",
  state: "State",
  zip: "Zip Code",
  
  // Vehicle Fields
  year: "Vehicle Year",
  make: "Vehicle Make",
  model: "Vehicle Model",
  vin: "Vehicle VIN",
  licensePlate: "License Plate",
  mileage: "Mileage",
  
  // Mitchell 1 / Job Fields
  work_order: "Work Order Number",
  service_date: "Service Date",
  completion_date: "Completion Date",
  labor_operation: "Labor Operation Code",
  labor_description: "Labor Description",
  book_time: "Book Time (Hours)",
  actual_time: "Actual Time (Hours)",
  labor_total: "Labor Total",
  parts_total: "Parts Total",
  tax_amount: "Tax Amount",
  shop_supplies: "Shop Supplies",
  trouble_codes: "Diagnostic Trouble Codes",
  symptoms: "Customer Concerns/Symptoms",
  cause: "Problem Cause",
  correction: "Repair Action",
  technician: "Technician Name",
  service_advisor: "Service Advisor"
};

const FIELD_CATEGORIES = {
  customer: ["name", "phone", "email", "address", "city", "state", "zip"],
  vehicle: ["year", "make", "model", "vin", "licensePlate", "mileage"],
  job: ["work_order", "service_date", "completion_date", "labor_operation", "labor_description", 
        "book_time", "actual_time", "labor_total", "parts_total", "tax_amount", "shop_supplies", 
        "trouble_codes", "symptoms", "cause", "correction", "technician", "service_advisor"]
};

const FormatDetectionBanner = ({ detectedFormat }) => {
  if (!detectedFormat) return null;
  
  const getFormatInfo = (format) => {
    switch (format) {
      case "Mitchell 1":
        return {
          icon: <Settings className="h-5 w-5" />,
          color: "bg-blue-50 border-blue-200 text-blue-800",
          message: "Mitchell 1 format detected! We'll import customers, vehicles, and work orders."
        };
      case "Generic Customer/Vehicle":
        return {
          icon: <Database className="h-5 w-5" />,
          color: "bg-green-50 border-green-200 text-green-800",
          message: "Customer/Vehicle data detected. We'll import customer and vehicle information."
        };
      default:
        return {
          icon: <FileText className="h-5 w-5" />,
          color: "bg-yellow-50 border-yellow-200 text-yellow-800",
          message: "Unknown format detected. Please verify the column mapping below."
        };
    }
  };
  
  const formatInfo = getFormatInfo(detectedFormat);
  
  return (
    <div className={`mb-6 p-4 rounded-lg border ${formatInfo.color}`}>
      <div className="flex items-center gap-2">
        {formatInfo.icon}
        <span className="font-medium">Format Detection: {detectedFormat}</span>
      </div>
      <p className="mt-1 text-sm">{formatInfo.message}</p>
    </div>
  );
};

const ColumnMappingSection = ({ category, fields, analysis, mapping, onMappingChange }) => {
  const categoryFields = FIELD_CATEGORIES[category];
  const availableColumns = analysis.columns.filter(col => 
    categoryFields.some(field => mapping[col] === field)
  );
  
  if (availableColumns.length === 0 && category === 'job') {
    return null; // Don't show job section if no job-related columns are mapped
  }
  
  const getCategoryTitle = (cat) => {
    switch (cat) {
      case 'customer': return 'Customer Information';
      case 'vehicle': return 'Vehicle Information';
      case 'job': return 'Work Order / Job Information';
      default: return cat;
    }
  };
  
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'customer': return <Database className="h-4 w-4" />;
      case 'vehicle': return <Settings className="h-4 w-4" />;
      case 'job': return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {getCategoryIcon(category)}
        <h3 className="font-medium text-gray-800">{getCategoryTitle(category)}</h3>
      </div>
      <div className="space-y-2 pl-6 border-l-2 border-gray-100">
        {analysis.columns.map(col => {
          const mappedField = mapping[col];
          if (!categoryFields.includes(mappedField) && mappedField) return null;
          
          return (
            <div key={col} className="grid grid-cols-3 items-center gap-4">
              <span className="text-right text-gray-700 text-sm">{col}</span>
              <ArrowRight className="mx-auto text-gray-400 h-4 w-4" />
              <select 
                value={mapping[col] || ""} 
                onChange={e => onMappingChange(col, e.target.value)}
                className="p-2 border rounded-md bg-gray-50 w-full text-sm"
              >
                <option value="">-- Ignore this column --</option>
                {categoryFields.map(field => (
                  <option key={field} value={field}>{SYSTEM_FIELDS[field]}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DataPreview = ({ analysis, mapping }) => {
  const previewData = useMemo(() => {
    if (!analysis?.sample_data) return [];
    return analysis.sample_data.map(row => {
      const newRow = {};
      for (const fileCol in row) {
        const systemField = mapping[fileCol];
        if (systemField) {
          newRow[systemField] = row[fileCol];
        }
      }
      return newRow;
    });
  }, [analysis, mapping]);

  const headers = Object.keys(previewData[0] || {});

  if (headers.length === 0) {
    return <p className="text-center text-yellow-600 mt-4">Map at least one column to see a preview.</p>;
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-2">Data Preview</h3>
      <p className="text-sm text-gray-500 mb-4">Here's a sample of how your data will be imported. Does this look correct?</p>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th key={header} className="p-2 text-left font-medium text-gray-600">
                  {SYSTEM_FIELDS[header] || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {previewData.map((row, index) => (
              <tr key={index} className="border-t">
                {headers.map(header => (
                  <td key={header} className="p-2 text-gray-700 truncate max-w-xs">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ImportResults = ({ results }) => {
  const hasJobs = (results.results?.jobs || 0) > 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Customers</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{results.results?.customers || 0}</div>
          <div className="text-sm text-blue-600">Added</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Vehicles</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{results.results?.vehicles || 0}</div>
          <div className="text-sm text-green-600">Added</div>
        </div>
        
        {hasJobs && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Work Orders</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{results.results?.jobs || 0}</div>
            <div className="text-sm text-purple-600">Added</div>
          </div>
        )}
      </div>
      
      {results.results?.errors?.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
            <AlertTriangle size={16} /> Errors ({results.results.errors.length}):
          </h4>
          <ul className="list-disc list-inside text-sm text-red-600 max-h-32 overflow-y-auto space-y-1">
            {results.results.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {results.results?.warnings?.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-700 flex items-center gap-2 mb-2">
            <AlertTriangle size={16} /> Warnings ({results.results.warnings.length}):
          </h4>
          <ul className="list-disc list-inside text-sm text-yellow-600 max-h-32 overflow-y-auto space-y-1">
            {results.results.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function DataMigration() {
  const { migrationOps, utils } = useDataOperations();
  const [step, setStep] = useState(1);
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [mapping, setMapping] = useState({});

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return utils.showMessage("Please select a file.", "error");
    const formData = new FormData();
    formData.append('file', file);
    const result = await migrationOps.analyze(formData);
    if (result.success) {
      setAnalysis(result.data);
      setMapping(result.data.suggested_mapping || {});
      setStep(2);
    }
  };

  const handleMappingChange = (fileColumn, systemField) => {
    setMapping(prev => ({ ...prev, [fileColumn]: systemField }));
  };

  const handleImport = async () => {
    if (!analysis) return;
    const finalMapping = {};
    Object.entries(mapping).forEach(([userCol, sysField]) => {
      if (sysField) finalMapping[userCol] = sysField;
    });
    const result = await migrationOps.importData({
      filename: analysis.filename,
      mapping: finalMapping
    });

    if (result.success) {
      setResults(result.data);
      setStep(3);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setFile(null);
    setAnalysis(null);
    setMapping({});
    setResults(null);
  };

  const isLoading = utils.isLoading('analyzeMigration') || utils.isLoading('importMigration');
  const mappedFields = Object.values(mapping).filter(Boolean).length;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-xl">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Data Migration Tool</h1>
      <p className="text-gray-600 mb-6">Import customers, vehicles, and work orders from Mitchell 1 or other systems</p>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upload Your Data Export</h2>
          <p className="text-gray-500 mb-4">
            Select a CSV, XLS, or XLSX file from Mitchell 1 or another system. 
            The tool will automatically detect the format and suggest field mappings.
          </p>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv,.xls,.xlsx"
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />
          {file && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-left">
              <p className="text-sm text-gray-600">
                <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            </div>
          )}
          <button 
            onClick={handleAnalyze} 
            disabled={isLoading || !file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 
              <><Loader2 className="animate-spin" /> Analyzing...</> : 
              "Analyze File"
            }
          </button>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && analysis && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Map Your Columns</h2>
          <p className="mb-4 text-gray-600">
            Found {analysis.columns.length} columns in your file with {analysis.row_count} rows of data.
            Match the columns from your file to the fields in our system.
          </p>
          
          <FormatDetectionBanner detectedFormat={analysis.detected_format} />
          
          <div className="mb-6">
            {['customer', 'vehicle', 'job'].map(category => (
              <ColumnMappingSection
                key={category}
                category={category}
                fields={FIELD_CATEGORIES[category]}
                analysis={analysis}
                mapping={mapping}
                onMappingChange={handleMappingChange}
              />
            ))}
          </div>

          <DataPreview analysis={analysis} mapping={mapping} />

          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mappedFields} columns mapped • {analysis.row_count} rows to import
            </div>
            <button 
              onClick={handleImport} 
              disabled={isLoading || mappedFields === 0}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 
                <><Loader2 className="animate-spin" /> Importing...</> : 
                "Confirm and Start Import"
              }
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 3 && results && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600">Import Complete!</h2>
            <p className="text-gray-700 mt-2">
              {results.message || "Your data has been successfully imported into the system."}
            </p>
          </div>

          <ImportResults results={results} />

          <button 
            onClick={handleStartOver}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Start Another Import
          </button>
        </div>
      )}
    </div>
  );
}
