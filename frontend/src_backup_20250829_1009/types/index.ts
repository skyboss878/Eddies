export interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  vin: string;
  owner_name: string;
  status: string;
  last_service?: string;
}

export interface DashboardStats {
  activeJobs: number;
  activeJobsChange: number;
  todayRevenue: number;
  revenueChange: number;
  customerSatisfaction: number;
  satisfactionChange: number;
  vehiclesServiced: number;
  vehiclesChange: number;
  goalProgress: number;
  techEfficiency: number;
  todayAppointments: Appointment[];
}

export interface Appointment {
  customer: string;
  service: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}
