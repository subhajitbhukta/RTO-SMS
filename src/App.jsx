import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reminders from './components/Reminders';
import Clients from './components/Clients';
import Vehicles from './components/Vehicles';
import AddClientModal from './components/AddClientModal';
import AddVehicleModal from './components/AddVehicleModal';
import { initialClients, initialVehicles, initialServices } from './components/utils/initialData';
import { getDaysUntil } from './components/utils/dateUtils';
import InstallPrompt from './components/InstallPrompt';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState(initialClients);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [services] = useState(initialServices);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const stats = useMemo(() => ({
    totalClients: clients.length,
    totalVehicles: vehicles.length,
    upcomingServices: services.filter(s => getDaysUntil(s.nextDue) <= 15 && getDaysUntil(s.nextDue) >= 0).length,
    overdueServices: services.filter(s => getDaysUntil(s.nextDue) < 0).length
  }), [clients, vehicles, services]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'clients', label: 'Clients' },
    { id: 'vehicles', label: 'Vehicles' }
  ];

  const handleAddClient = (newClient) => {
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setShowClientModal(false);
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, { ...newVehicle, id: Date.now().toString() }]);
    setShowVehicleModal(false);
  };

  return (
    <>
    <InstallPrompt/>
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className=" flex items-center sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start sm:items-center gap-3 flex-wrap">
              <div className=''>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="hidden sm:block text-[12px] sm:text-base text-gray-500">
                  Manage your vehicle services
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setShowClientModal(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all text-[11px] sm:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Add Client
              </button>
              <button 
                onClick={() => setShowVehicleModal(true)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-all text-[10px] sm:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            </div>
          </div>
        </header>

        {/* Content Area with bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto p-1.5 sm:p-4  sm:mb-8 mb-32 lg:pb-6">
          {activeTab === 'dashboard' && (
            <Dashboard stats={stats} services={services} vehicles={vehicles} clients={clients} />
          )}
          {activeTab === 'reminders' && (
            <Reminders services={services} vehicles={vehicles} clients={clients} />
          )}
          {activeTab === 'clients' && (
            <Clients clients={clients} />
          )}
          {activeTab === 'vehicles' && (
            <Vehicles vehicles={vehicles} clients={clients} services={services} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Always visible on mobile */}
      <div className="lg:hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Modals */}
      <AddClientModal 
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSubmit={handleAddClient}
      />
      <AddVehicleModal 
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSubmit={handleAddVehicle}
        clients={clients}
      />
    </div>
    </>
  );
};

export default App;