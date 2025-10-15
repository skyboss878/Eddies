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
