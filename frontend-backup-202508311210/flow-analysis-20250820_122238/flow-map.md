# User Flow Map

## Authentication Flow
1. Landing Page (/) → Login/Register
2. Login (/login) → Dashboard (/dashboard)
3. Register (/register) → Dashboard (/dashboard)

## Main Application Flow
Dashboard (/app/dashboard) serves as the central hub with navigation to:

### Vehicle Management Flow
- Vehicle List (/app/vehicles)
  - Add Vehicle (/app/vehicles/add)
  - Vehicle Detail (/app/vehicles/:id)
  - Edit Vehicle (/app/vehicles/:id/edit)

### Job Management Flow
- Jobs List (/app/jobs)
  - Create Job (/app/jobs/create)
  - Job Detail (/app/jobs/:id)
  - Edit Job (/app/jobs/:id/edit)

### Customer Management Flow
- Customer List (/app/customers)
  - Add Customer (/app/customers/add)
  - Customer Detail (/app/customers/:id)
  - Edit Customer (/app/customers/:id/edit)

### Estimate Management Flow
- AI Estimates (/app/estimates)
  - Create Estimate (/app/estimates/create)
  - Estimate Detail (/app/estimates/:id)
  - Edit Estimate (/app/estimates/:id/edit)

### Additional Modules
- Invoice Management (/app/invoices)
- Appointment Calendar (/app/appointments)
- Parts & Labor Management (/app/parts-labor)
- Reports & Analytics (/app/reports)
- Settings (/app/settings)

## Protected Route Structure
All /app/* routes require authentication and use the Layout component.
