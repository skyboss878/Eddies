// src/components/CustomerAuthorization.jsx
import React, { useRef, useState } from "react";

/**
 * Props:
 * - onChange(logArray)
 * - initialLog: [{ type: 'initial'|'additional', method: 'written'|'oral'|'electronic', name, by, datetimeISO, note, signatureDataUrl }]
 */
export default function CustomerAuthorization({ onChange, initialLog = [] }) {
  const [log, setLog] = useState(initialLog);
  const [form, setForm] = useState({
    type: "initial",
    method: "written",
    name: "",
    by: "",
    note: ""
  });

  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const addLog = (entry) => {
    const next = [...log, entry];
    setLog(next);
    onChange && onChange(next);
  };

  const startDraw = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.moveTo((e.clientX || e.touches?.[0].clientX) - rect.left, (e.clientY || e.touches?.[0].clientY) - rect.top);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo((e.clientX || e.touches?.[0].clientX) - rect.left, (e.clientY || e.touches?.[0].clientY) - rect.top);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const clearSig = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSave = () => {
    const signatureDataUrl = canvasRef.current.toDataURL("image/png");
    addLog({
      ...form,
      datetimeISO: new Date().toISOString(),
      signatureDataUrl
    });
    // reset only signature and note
    setForm((f) => ({ ...f, note: "" }));
    clearSig();
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-gray-800 mb-3">Customer Authorization</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-gray-700">Authorization Type</label>
          <select
            className="w-full border rounded p-2"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="initial">Initial Estimate Authorization</option>
            <option value="additional">Additional Repairs Authorization</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Method</label>
          <select
            className="w-full border rounded p-2"
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
          >
            <option value="written">Written / E-sign</option>
            <option value="electronic">Electronic (email / text)</option>
            <option value="oral">Oral (phone / in-person)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Customer Name</label>
          <input
            className="w-full border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Authorized By (staff)</label>
          <input
            className="w-full border rounded p-2"
            value={form.by}
            onChange={(e) => setForm({ ...form, by: e.target.value })}
            placeholder="Eddie / Service Advisor"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1 text-gray-700">Notes (scope, amount, etc.)</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
            placeholder="Approved up to $450 for additional brake parts if needed."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-2 text-gray-700">Signature</label>
          <div className="border rounded-md p-2 bg-gray-50">
            <canvas
              ref={canvasRef}
              width={560}
              height={160}
              className="bg-white w-full rounded border"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={clearSig} className="px-3 py-1 rounded border">Clear</button>
              <button type="button" onClick={handleSave} className="px-3 py-1 rounded bg-blue-600 text-white">Save Authorization</button>
            </div>
          </div>
        </div>
      </div>

      {log.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 mb-2">Authorization Log</h4>
          <div className="space-y-2">
            {log.map((a, idx) => (
              <div key={idx} className="p-2 border rounded text-sm bg-gray-50">
                <div className="flex justify-between">
                  <div className="font-semibold">
                    {a.type === "initial" ? "Initial" : "Additional"} — {a.method.toUpperCase()}
                  </div>
                  <div className="text-gray-600">{new Date(a.datetimeISO).toLocaleString()}</div>
                </div>
                <div className="text-gray-700">
                  By: {a.name} (staff: {a.by}) {a.note ? `— ${a.note}` : ""}
                </div>
                {a.signatureDataUrl && (
                  <img src={a.signatureDataUrl} alt="signature" className="mt-1 h-12 object-contain" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
