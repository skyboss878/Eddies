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

// src/utils/vehicleHelpers.js - MAKE SURE TO CREATE THIS FILE
export const vehicleHelpers = {
  formatVehicleName: (vehicle) => {
    if (!vehicle) return 'Unknown Vehicle';
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.color ? ` (${vehicle.color})` : ''}`;
  },

  formatMileage: (mileage) => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
  },

  getVehicleAge: (year) => {
    return new Date().getFullYear() - year;
  },

  isValidVIN: (vin) => {
    if (!vin || vin.length !== 17) return false;
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinPattern.test(vin.toUpperCase());
  }
};
