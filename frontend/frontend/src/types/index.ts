export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  last_service?: string;
  status: 'active' | 'inactive';
  mileage?: number;
}

export interface ServiceJob {
  id: string;
  vehicle_id: string;
  customer_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_technician?: string;
  estimated_hours?: number;
  actual_hours?: number;
  parts_cost?: number;
  labor_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface DTCCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  possible_causes: string[];
  freeze_frame?: Record<string,

  # Continue Types from where it was cut off
cat >> src/types/index.ts << 'EOF'
 any>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  vehicles: Vehicle[];
  service_history: ServiceJob[];
  created_at: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: 'junior' | 'senior' | 'master';
  certifications: string[];
  hourly_rate: number;
  active_jobs: string[];
}

export interface Part {
  id: string;
  name: string;
  part_number: string;
  manufacturer: string;
  price: number;
  cost: number;
  quantity_in_stock: number;
  minimum_stock: number;
  location: string;
}
