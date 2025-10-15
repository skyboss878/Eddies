import { apiClient } from './apiClient';

export const diagnosticsService = {
  async getVehicles() {
    const response = await apiClient.get('/auth/vehicles');
    return response.data;
  },

  async getDiagnosticHistory(vehicleId: string) {
    const response = await apiClient.get(`/auth/vehicles/${vehicleId}/diagnostics`);
    return response.data;
  },

  async performFullScan(vehicleId: string) {
    const response = await apiClient.post(`/auth/vehicles/${vehicleId}/scan`);
    return response.data;
  }
};
