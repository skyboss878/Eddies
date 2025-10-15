import AIEstimateModal from '../components/ai/AIEstimateModal';
import React, { useState } from 'react';
import { aiService } from '../utils/api';

const defaultPrompt = `
You are an expert automotive technician. Given the customer's vehicle and diagnosis, generate a detailed repair estimate.

Please return the response in markdown format.

Example:

**Diagnosis:** Brake noise when stopping  
**Recommendation:** Replace brake pads and resurface rotors  
**Parts Needed:**  
- Front brake pads ($80)  
- Rotor resurface ($40 each x2)

**Estimated Labor:** 1.5 hours  
**Labor Rate:** $120/hr  
**Total Labor:** $180

**Estimated Total Cost:** $300 (Parts + Labor)
`;

export default function EstimateAI() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [inputData, setInputData] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAI = async () => {
    if (!inputData.trim()) {
      setError('Please enter vehicle or diagnosis info.');
      return;
    }

    setLoading(true);
    setError(null);
    setAIResponse('');

    try {
      const res = await aiService.generateEstimate({
        prompt: `${prompt}\n\nVehicle & Diagnosis Info:\n${inputData}`,
      });

      if (res && res.content) {
        setAIResponse(res.content);
      } else {
        setError('No response from AI service.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong with AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10">
      <h1 className="text-2xl font-bold mb-4">🔧 AI-Powered Estimate Generator</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Vehicle & Diagnosis Info</label>
        <textarea
          className="w-full border rounded p-3 h-32 bg-gray-50"
          placeholder="e.g. 2012 Toyota Camry, grinding noise when braking..."
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Customize Prompt (Optional)</label>
        <textarea
          className="w-full border rounded p-3 h-40 font-mono text-sm bg-gray-100"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={runAI}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {loading ? 'Generating...' : 'Generate Estimate'}
        </button>
        <button
          onClick={() => {
            setAIResponse('');
            setError(null);
          }}
          className="text-sm text-gray-600 underline"
        >
          Clear Output
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          ❌ {error}
        </div>
      )}

      {aiResponse && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">🧠 AI Estimate Output</h2>
          <textarea
            className="w-full border rounded p-4 font-mono text-sm bg-gray-100"
            rows={15}
            value={aiResponse}
            onChange={(e) => setAIResponse(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
