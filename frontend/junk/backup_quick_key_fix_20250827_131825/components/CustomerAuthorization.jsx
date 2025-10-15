// src/components/CustomerAuthorization.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";

/**
 * CustomerAuthorization
 *
 * Props:
 *  - initialLog: Array<{
 *      type: 'initial'|'additional',
 *      method: 'written'|'oral'|'electronic',
 *      name: string,
 *      by: string,
 *      note?: string,
 *      datetimeISO: string,
 *      signatureDataUrl?: string
 *    }>
 *  - onChange?: (log: Array) => void
 *  - disabled?: boolean                     // disable inputs and signature when true
 *  - maxEntries?: number                    // default Infinity
 *  - autosave?: boolean                     // default true; calls onChange after each save
 *  - compact?: boolean                      // default false; tighter layout
 */
export default function CustomerAuthorization({
  initialLog = [],
  onChange,
  disabled = false,
  maxEntries = Infinity,
  autosave = true,
  compact = false,
}) {
  const [log, setLog] = useState(() => Array.isArray(initialLog) ? initialLog : []);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    type: "initial",
    method: "written",
    name: "",
    by: "",
    note: "",
  });

  // Canvas / sizing
  const padRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(560);
  const [canvasHeight, setCanvasHeight] = useState(160);

  // Resize handler (keeps aspect ratio on smaller screens)
  const resize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = Math.max(320, Math.min(el.clientWidth - 16, 720)); // clamp width
    const h = Math.round(w * (160 / 560));                       // keep original aspect
    setCanvasWidth(w);
    setCanvasHeight(Math.max(120, h));
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // Keep parent in sync if initialLog changes
  useEffect(() => {
    setLog(Array.isArray(initialLog) ? initialLog : []);
  }, [initialLog]);

  // util: debounce
  const debounce = (fn, ms = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const emitChange = useMemo(
    () =>
      debounce((next) => {
        if (typeof onChange === "function") onChange(next);
      }, 200),
    [onChange]
  );

  const addLog = (entry) => {
    const next = [...log, entry];
    setLog(next);
    if (autosave) emitChange(next);
  };

  const clearPad = () => {
    try {
      padRef.current?.clear();
    } catch {}
  };

  const isPadEmpty = () => {
    try {
      return padRef.current?.isEmpty();
    } catch {
      return true;
    }
  };

  // Export PNG with reasonable compression
  const exportSignature = () => {
    try {
      // getTrimmedCanvas reduces extra whitespace; toDataURL quality applies to JPEG but we keep PNG for lossless
      const canvas = padRef.current?.getTrimmedCanvas();
      return canvas?.toDataURL("image/png");
    } catch {
      // Fallback to full canvas
      return padRef.current?.toDataURL("image/png");
    }
  };

  const handleSave = async () => {
    if (disabled) return;
    if (log.length >= maxEntries) {
      window?.alert?.("Maximum number of authorization entries reached.");
      return;
    }
    if (!form.name.trim() || !form.by.trim()) {
      window?.alert?.("Please provide Customer Name and Authorized By (staff).");
      return;
    }
    // Require signature for written/electronic, allow empty for 'oral'
    if ((form.method === "written" || form.method === "electronic") && isPadEmpty()) {
      window?.alert?.("Please capture a signature for written/electronic method.");
      return;
    }

    setSaving(true);
    try {
      const signatureDataUrl =
        form.method === "oral" ? undefined : exportSignature();

      const entry = {
        ...form,
        datetimeISO: new Date().toISOString(),
        signatureDataUrl,
      };

      addLog(entry);

      // Reset signature + optional note only
      setForm((f) => ({ ...f, note: "" }));
      clearPad();
    } finally {
      setSaving(false);
    }
  };

  // Accessibility: prevent page scroll while drawing on touch devices
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e) => {
      if (e.target?.tagName?.toLowerCase() === "canvas") {
        e.preventDefault();
      }
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  return (
    <div className={`border rounded-lg p-4 bg-white ${compact ? "space-y-3" : "space-y-4"}`}>
      <h3 className="font-semibold text-gray-800">Customer Authorization</h3>

      {/* Form */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Authorization Type</label>
          <select
            className="w-full border rounded p-2"
            value={form.type}
            disabled={disabled}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
            disabled={disabled}
            onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
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
            disabled={disabled}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700">Authorized By (staff)</label>
          <input
            className="w-full border rounded p-2"
            value={form.by}
            disabled={disabled}
            onChange={(e) => setForm((f) => ({ ...f, by: e.target.value }))}
            placeholder="Eddie / Service Advisor"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1 text-gray-700">Notes (scope, amount, etc.)</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.note}
            disabled={disabled}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            rows={compact ? 2 : 3}
            placeholder="Approved up to $450 for additional brake parts if needed."
          />
        </div>

        {/* Signature */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-2 text-gray-700">Signature</label>
          <div ref={containerRef} className="border rounded-md p-2 bg-gray-50">
            <SignatureCanvas
              ref={padRef}
              penColor="#111827"
              backgroundColor="#ffffff"
              canvasProps={{
                width: canvasWidth,
                height: canvasHeight,
                className: "bg-white w-full rounded border",
              }}
              clearOnResize={false}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={clearPad}
                disabled={disabled}
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={disabled || saving}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Authorization"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="pt-2">
          <h4 className="font-medium text-gray-800 mb-2">Authorization Log</h4>

          {/* Timeline style */}
          <ol className="relative border-s border-gray-200 space-y-4 ps-3">
            {log.map((a, idx) => (
              <li key={idx} className="ms-3">
                <span className="absolute -start-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="flex flex-col gap-1 rounded border bg-gray-50 p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <div className="font-semibold">
                      {a.type === "initial" ? "Initial" : "Additional"} — {a.method?.toUpperCase?.()}
                    </div>
                    <div className="text-gray-600">
                      {a.datetimeISO ? new Date(a.datetimeISO).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="text-gray-700">
                    By: <span className="font-medium">{a.name}</span>{" "}
                    <span className="text-gray-500">(staff: {a.by})</span>
                    {a.note ? <span> — {a.note}</span> : null}
                  </div>
                  {a.signatureDataUrl && (
                    <img
                      src={a.signatureDataUrl}
                      alt="Customer signature"
                      className="mt-1 h-12 max-w-full object-contain bg-white p-1 rounded border"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
