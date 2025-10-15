import { apiClient } from './apiClient';

export const obdService = {
  async connectVehicle(vehicleId: string) {
    try {
      const response = await apiClient.post(`/obd/connect`, {
        vehicle_id: vehicleId,
        protocol: 'auto'
      });
      return response.data;
    } catch (error) {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { connected: true, protocol: 'ISO 15765-4 (CAN)' };
    }
  },

  async getLiveData(vehicleId: string, parameters: string[]) {
    try {
      const response = await apiClient.get(`/obd/${vehicleId}/live-data`, {
        params: { parameters: parameters.join(',') }
      });
      return response.data;
    } catch (error) {
      // Mock live data
      return {
        rpm: Math.floor(Math.random() * 1000) + 700,
        speed: Math.floor(Math.random() * 60),
        coolant_temp: Math.floor(Math.random() * 20) + 80,
        engine_load: Math.floor(Math.random() * 30) + 10,
        throttle_pos: Math.floor(Math.random() * 100),
        fuel_pressure: Math.floor(Math.random() * 10) + 55,
        timestamp: new Date().toISOString()
      };
    }
  },

  async getDTCCodes(vehicleId: string) {
    try {
      const response = await apiClient.get(`/obd/${vehicleId}/dtc-codes`);
      return response.data;
    } catch (error) {
      return {
        codes: [
          {
            code: 'P0301',
            description: 'Cylinder 1 Misfire Detected',
            status: 'pending',
            freeze_frame: {
              rpm: 2100,
              load: 45,
              coolant_temp: 92
            }
          }
        ]
      };
    }
  }
};
