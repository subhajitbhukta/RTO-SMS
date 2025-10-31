export const initialClients = [
  { id: 1, name: 'John Doe', email: 'john@email.com', phone: '+1234567890', vehicles: 2 },
  { id: 2, name: 'Sarah Smith', email: 'sarah@email.com', phone: '+1234567891', vehicles: 1 },
  { id: 3, name: 'Mike Johnson', email: 'mike@email.com', phone: '+1234567892', vehicles: 3 }
];

export const initialVehicles = [
  { id: 1, clientId: 1, model: 'Toyota Camry', plate: 'ABC123', year: 2020 },
  { id: 2, clientId: 1, model: 'Honda CR-V', plate: 'XYZ789', year: 2021 },
  { id: 3, clientId: 2, model: 'Tesla Model 3', plate: 'TES001', year: 2022 },
  { id: 4, clientId: 3, model: 'BMW X5', plate: 'BMW555', year: 2019 },
  { id: 5, clientId: 3, model: 'Maruti Swift', plate: 'IND789', year: 2023 },
  { id: 6, clientId: 3, model: 'Tata Nexon EV', plate: 'ECO222', year: 2024 }
];

export const initialServices = [
  { id: 1, vehicleId: 1, type: 'PUC Renewal', date: '2025-09-15', nextDue: '2026-03-15', status: 'completed', cost: 150, documents: ['puc-certificate.pdf'] },
  { id: 2, vehicleId: 2, type: 'Insurance Renewal', date: '2025-10-01', nextDue: '2026-10-01', status: 'upcoming', cost: 12000, documents: ['policy2025.pdf'] },
  { id: 3, vehicleId: 3, type: 'Ownership Transfer', date: '2025-08-12', nextDue: '2025-10-12', status: 'completed', cost: 800, documents: ['form29.pdf', 'form30.pdf'] },
{ id: 4, vehicleId: 3, type: 'RC Smart Card Update', date: '2025-11-05', nextDue: '2025-11-05', status: 'scheduled', cost: 350, documents: [] },
  { id: 5, vehicleId: 4, type: 'Permit Renewal', date: '2025-07-20', nextDue: '2026-07-20', status: 'completed', cost: 5000, documents: ['permit2025.pdf'] },
  { id: 6, vehicleId: 5, type: 'PUC Expiry Check', date: '2025-10-10', nextDue: '2026-04-10', status: 'upcoming', cost: 150, documents: ['puc-swift.pdf'] },
  { id: 7, vehicleId: 6, type: 'Insurance Policy Update', date: '2025-11-15', nextDue: '2026-11-15', status: 'scheduled', cost: 14500, documents: [] },
  { id: 8, vehicleId: 6, type: 'Green Tax Payment', date: '2025-06-30', nextDue: '2030-06-30', status: 'completed', cost: 2500, documents: ['green-tax-receipt.pdf'] }
];
