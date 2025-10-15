// src/components/DocumentTemplateRenderer.jsx
import React from "react";
import ComplianceNoticeCA from "./ComplianceNoticeCA";

/**
 * Generic header/footer wrapper driven by Settings.invoiceTemplate
 * Use inside EstimateDetail / Invoice detail components.
 */
export default function DocumentTemplateRenderer({
  settings,
  title = "ESTIMATE",
  docMeta = {}, // { number, date }
  rightHeaderExtra = null,
  children,
  footerExtra = null
}) {
  const it = settings.invoiceTemplate || {};
  const businessHours = settings.businessHours || {};

  const formatBusinessHours = () => {
    const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    const names = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return days.map((d, i) => {
      const h = businessHours[d];
      if (!h || h.closed) return `${names[i]}: Closed`;
      return `${names[i]}: ${h.open} - ${h.close}`;
    }).join(" • ");
  };

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <div
        className="p-6 border-b flex items-start justify-between"
        style={{ backgroundColor: it.headerColor || "#1f2937", color: "white" }}
      >
        <div className="space-y-1">
          {it.showLogo && settings.logoUrl && (
            <img src={settings.logoUrl} alt="logo" className="h-10 object-contain" />
          )}
          <div className="text-2xl font-bold">{settings.shopName || "Your Shop"}</div>
          <div className="text-sm opacity-90">
            <div>{settings.address}</div>
            <div>
              {settings.phone ? `Phone: ${settings.phone}` : null}
              {settings.email ? ` • Email: ${settings.email}` : null}
              {settings.website ? ` • Web: ${settings.website}` : null}
              {settings.licenseNumber ? ` • License: ${settings.licenseNumber}` : null}
            </div>
          </div>
          {it.showBusinessHours && (
            <div className="text-xs opacity-90 mt-2"><strong>Hours:</strong> {formatBusinessHours()}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tracking-wide">{title}</div>
          <div className="text-sm mt-2 space-y-0.5">
            {docMeta.number && <div>No.: {docMeta.number}</div>}
            {docMeta.date && <div>Date: {docMeta.date}</div>}
          </div>
          {rightHeaderExtra}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">{children}</div>

      {/* Footer (compliance + terms) */}
      <div className="p-6 bg-gray-50 border-t text-sm space-y-3">
        <ComplianceNoticeCA />
        {it.paymentTerms && <div><strong>Payment Terms:</strong> {it.paymentTerms}</div>}
        {it.warrantyInfo && <div><strong>Warranty:</strong> {it.warrantyInfo}</div>}
        {it.disclaimers && <div><strong>Important:</strong> {it.disclaimers}</div>}
        {it.showTaxID && it.taxID && <div><strong>Tax ID:</strong> {it.taxID}</div>}
        {footerExtra}
        {it.footerNotes && <div className="pt-2 border-t italic text-center">{it.footerNotes}</div>}
      </div>
    </div>
  );
}
