// src/pages/CreateEditEstimate.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSettings } from "../contexts";
import DocumentTemplplateRenderer from "../components";
import CustomerAuthorization from "../components";
import { computeTotals } from "../utils";
import { showMessage } from "../utils";

export default function CreateEditEstimate() {
  const { id } = useParams(); // if editing
  const isEdit = Boolean(id);
  const { settings } = useSettings();

  const [estimate, setEstimate] = useState({
    number: "",
    date: new Date().toLocaleDateString(),
    customer: { name: "", phone: "" },
    vehicle: { year: "", make: "", model: "", vin: "", mileage: "" },
    parts: [],
    labor: [],
    authorizationLog: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetch(`/api/auth/estimates/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEstimate(data);
        }
      } catch (e) {
      }
    })();
  }, [id, isEdit]);

  const totals = computeTotals({ parts: estimate.parts, labor: estimate.labor }, settings);

  const addPart = () => setEstimate((e) => ({ ...e, parts: [...e.parts, { name: "", partNumber: "", quantity: 1, cost: 0 }] }));
  const addLabor = () => setEstimate((e) => ({ ...e, labor: [...e.labor, { description: "", hours: 0, rate: settings.laborRate }] }));

  const save = async () => {
    setSaving(true);
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/auth/estimates/${id}` : "/api/auth/estimates";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...estimate, totals })
      });
      if (!res.ok) throw new Error("Failed to save estimate");
      showMessage("Estimate saved", "success");
    } catch (e) {
      showMessage(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <DocumentTemplplateRenderer
        settings={settings}
        title="ESTIMATE"
        docMeta={{ number: estimate.number, date: estimate.date }}
        rightHeaderExtra={
          <div className="text-xs mt-2">
            {settings.licenseNumber ? <div>CA ARD License: {settings.licenseNumber}</div> : null}
          </div>
        }
      >
        {/* Customer & Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">CUSTOMER</h3>
            <div className="space-y-2">
              <input className="w-full border rounded p-2" placeholder="Name"
                     value={estimate.customer.name}
                     onChange={(e) => setEstimate({ ...estimate, customer: { ...estimate.customer, name: e.target.value } })} />
              <input className="w-full border rounded p-2" placeholder="Phone"
                     value={estimate.customer.phone}
                     onChange={(e) => setEstimate({ ...estimate, customer: { ...estimate.customer, phone: e.target.value } })} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">VEHICLE</h3>
            <div className="grid grid-cols-2 gap-2">
              <input className="border rounded p-2" placeholder="Year"
                     value={estimate.vehicle.year}
                     onChange={(e) => setEstimate({ ...estimate, vehicle: { ...estimate.vehicle, year: e.target.value } })} />
              <input className="border rounded p-2" placeholder="Make"
                     value={estimate.vehicle.make}
                     onChange={(e) => setEstimate({ ...estimate, vehicle: { ...estimate.vehicle, make: e.target.value } })} />
              <input className="border rounded p-2" placeholder="Model"
                     value={estimate.vehicle.model}
                     onChange={(e) => setEstimate({ ...estimate, vehicle: { ...estimate.vehicle, model: e.target.value } })} />
              <input className="border rounded p-2" placeholder="VIN"
                     value={estimate.vehicle.vin}
                     onChange={(e) => setEstimate({ ...estimate, vehicle: { ...estimate.vehicle, vin: e.target.value } })} />
              <input className="border rounded p-2 col-span-2" placeholder="Mileage"
                     value={estimate.vehicle.mileage}
                     onChange={(e) => setEstimate({ ...estimate, vehicle: { ...estimate.vehicle, mileage: e.target.value } })} />
            </div>
          </div>
        </div>

        {/* Parts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">PARTS</h3>
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addPart}>Add Part</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Part #</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                {estimate.parts.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">
                      <input className="w-full border rounded p-1" value={p.name}
                             onChange={(e) => {
                               const parts = [...estimate.parts];
                               parts[i].name = e.target.value;
                               setEstimate({ ...estimate, parts });
                             }} />
                    </td>
                    <td className="p-2">
                      <input className="w-full border rounded p-1" value={p.partNumber}
                             onChange={(e) => {
                               const parts = [...estimate.parts];
                               parts[i].partNumber = e.target.value;
                               setEstimate({ ...estimate, parts });
                             }} />
                    </td>
                    <td className="p-2 text-right">
                      <input type="number" className="w-24 border rounded p-1 text-right" value={p.quantity}
                             onChange={(e) => {
                               const parts = [...estimate.parts];
                               parts[i].quantity = Number(e.target.value);
                               setEstimate({ ...estimate, parts });
                             }} />
                    </td>
                    <td className="p-2 text-right">
                      <input type="number" step="0.01" className="w-24 border rounded p-1 text-right" value={p.cost}
                             onChange={(e) => {
                               const parts = [...estimate.parts];
                               parts[i].cost = Number(e.target.value);
                               setEstimate({ ...estimate, parts });
                             }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Labor */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">LABOR</h3>
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={addLabor}>Add Labor</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Hours</th>
                  <th className="text-right p-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {estimate.labor.map((l, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">
                      <input className="w-full border rounded p-1" value={l.description}
                             onChange={(e) => {
                               const labor = [...estimate.labor];
                               labor[i].description = e.target.value;
                               setEstimate({ ...estimate, labor });
                             }} />
                    </td>
                    <td className="p-2 text-right">
                      <input type="number" step="0.1" className="w-24 border rounded p-1 text-right" value={l.hours}
                             onChange={(e) => {
                               const labor = [...estimate.labor];
                               labor[i].hours = Number(e.target.value);
                               setEstimate({ ...estimate, labor });
                             }} />
                    </td>
                    <td className="p-2 text-right">
                      <input type="number" step="1" className="w-24 border rounded p-1 text-right" value={l.rate ?? settings.laborRate}
                             onChange={(e) => {
                               const labor = [...estimate.labor];
                               labor[i].rate = Number(e.target.value);
                               setEstimate({ ...estimate, labor });
                             }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 text-sm space-y-2">
            <div className="flex justify-between"><span>Parts Subtotal:</span><span>${totals.partsSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-600"><span>Parts Markup ({(settings.partsMarkup*100).toFixed(1)}%):</span><span>+${totals.partsMarkup.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Parts Total:</span><span>${totals.partsTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Labor Subtotal:</span><span>${totals.laborSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-2"><span>Subtotal:</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-blue-600"><span>Shop Supplies ({(settings.shopSuppliesRate*100).toFixed(1)}%):</span><span>+${totals.shopSupplies.toFixed(2)}</span></div>
            <div className="flex justify-between text-red-600"><span>Tax ({(settings.taxRate*100).toFixed(2)}%):</span><span>+${totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-bold border-t-2 pt-2"><span>TOTAL:</span><span>${totals.total.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Authorization (CA compliance) */}
        <div className="mt-6">
          <CustomerAuthorization
            initialLog={estimate.authorizationLog}
            onChange={(log) => setEstimate({ ...estimate, authorizationLog: log })}
          />
        </div>
      </DocumentTemplplateRenderer>

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded border" onClick={() => window.history.back()}>Cancel</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Estimate"}
        </button>
      </div>
    </div>
  );
}
