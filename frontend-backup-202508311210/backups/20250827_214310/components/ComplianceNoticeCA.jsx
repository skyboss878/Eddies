// src/components/ComplianceNoticeCA.jsx
import React from "react";

/**
 * California Auto Repair Estimate Disclosures
 * Include this on Estimates and Invoices to stay compliant.
 */
export default function ComplianceNoticeCA({ className = "" }) {
  return (
    <div className={`text-xs leading-relaxed bg-yellow-50 border border-yellow-200 rounded-md p-3 ${className}`}>
      <p className="font-semibold text-yellow-800">California Auto Repair Disclosure</p>
      <ul className="list-disc ml-5 mt-2 text-yellow-900 space-y-1">
        <li>You are entitled to a written estimate before work begins. All repairs must be authorized by you.</li>
        <li>Additional repairs discovered during service require your separate authorization before proceeding.</li>
        <li>The final invoice will list all parts and labor performed. Shop license number is shown on this document.</li>
        <li>You may request the return of replaced parts at the time you authorize the repairs.</li>
        <li>Some diagnoses may require disassembly (“tear down”); such charges will be disclosed and authorized if needed.</li>
        <li>Smog-related estimates will include required notices and you may choose another station for any repairs.</li>
      </ul>
      <p className="mt-2 text-yellow-900">
        Questions? Contact the California Bureau of Automotive Repair (BAR).
      </p>
    </div>
  );
}
