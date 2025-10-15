import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";

export default function EstimateDetail() {
  const { id } = useParams();
  const { estimates } = useData();
  const estimate = estimates.find(e => e.id === parseInt(id));

  if (!estimate) {
    return <div className="p-6">Estimate not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estimate #{estimate.id}</h1>
      <p>Total: ${estimate.total}</p>
      {/* Add more estimate details as needed */}
    </div>
  );
}
