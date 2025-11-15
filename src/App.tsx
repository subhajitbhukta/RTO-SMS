import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from './components/Sidebar.tsx'
import Dashboard from './components/Dashboard.tsx'
import Reminders from './components/Reminders.tsx'
import Clients from './components/Clients.tsx'
import Vehicles from './components/Vehicles.tsx'
// import AddClientModal from './components/AddClientModal.tsx'
// import AddVehicleModal from './components/AddVehicleModal.tsx'
import Ledger from './components/Ledger.tsx'
import {
  initialClients,
  initialVehicles,
  initialServices,
} from './components/utils/initialData'
import { getDaysUntil } from './components/utils/dateUtils'
import WorkFlows from './components/WorkFlows.tsx'
import Renewals from './components/Renwals.tsx'
import ShowEnquireModal from './components/ShowEnquireModal.tsx'
import Enquires from './components/Enquires.tsx'
import Entries from './components/Entries.tsx'
import Services from './components/ServicesDemo.tsx'
import Payment from './components/Payment.tsx'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [clients, setClients] = useState<any[]>(initialClients)
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles)
  const [services] = useState<any[]>(initialServices)
  const [showClientModal, setShowClientModal] = useState<boolean>(false)
  const [showVehicleModal, setShowVehicleModal] = useState<boolean>(false)
  const [showEnquireModal, setShowEnquireModal] = useState<boolean>(false)

  const stats = useMemo(() => ({
    totalClients: clients.length,
    totalVehicles: vehicles.length,
    upcomingServices: services.filter(s => getDaysUntil(s.nextDue) <= 15 && getDaysUntil(s.nextDue) >= 0).length,
    overdueServices: services.filter(s => getDaysUntil(s.nextDue) < 0).length
  }), [clients, vehicles, services])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workflows', label: 'Workflows' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'renewals', label: 'Renewals' },
    { id: 'ledger', label: 'Ledger' },
    { id: 'clients', label: 'Clients' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'Enquiries', label: 'Enquiries' },
    { id: 'Entries', label: 'Entries' },
    { id: 'services', label: 'Services' },
    { id: 'payment', label: 'Payment' }
  ]

  const handleAddClient = (newClient: any) => {
    setClients([...clients, { ...newClient, id: Date.now().toString() }])
    setShowClientModal(false)
  }

  const handleAddVehicle = (newVehicle: any) => {
    setVehicles([...vehicles, { ...newVehicle, id: Date.now().toString() }])
    setShowVehicleModal(false)
  }

  const handleEnquiryClick = (): void => {
    setActiveTab('Enquiries')
  }


  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 sm:px-6 py-4">
            <div className=" flex items-center sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-3 flex-wrap">
                <div className="">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                    {navItems.find(item => item.id === activeTab)?.label}
                  </h1>
                  <p className="hidden sm:block text-[12px] sm:text-base text-gray-500">
                    Manage your vehicle services
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* <button
                  onClick={() => setShowClientModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all text-[11px] sm:text-base w-full sm:w-auto"
                > */}
                {/* <Plus className="w-4 h-4" /> */}
                {/* Add Client
                </button>
                <button
                  onClick={() => setShowVehicleModal(true)}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-all text-[10px] sm:text-base w-full sm:w-auto"
                > */}
                {/* <Plus className="w-4 h-4" /> */}
                {/* Add Vehicle
                </button> */}

                {/* <button
                  onClick={() => handleEnquiryClick(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all text-[12px] sm:text-base w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Service Enquiry
                </button> */}

              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-1.5 sm:p-4  sm:mb-8 mb-32 lg:pb-6">
            {activeTab === 'dashboard' && (
              <Dashboard stats={stats} services={services} vehicles={vehicles} clients={clients} />
            )}
            {activeTab === 'workflows' && (
              <WorkFlows stats={stats} services={services} vehicles={vehicles} clients={clients} />
            )}
            {activeTab === 'reminders' && (
              <Reminders services={services} vehicles={vehicles} clients={clients} />
            )}
            {activeTab === 'clients' && <Clients clients={clients} />}
            {activeTab === 'vehicles' && <Vehicles vehicles={vehicles} clients={clients} services={services} />}
            {activeTab === 'ledger' && <Ledger />}
            {activeTab === 'renewals' && <Renewals />}
            {activeTab === 'Enquiries' && <Enquires />}
            {activeTab === 'Entries' && <Entries />}
            {activeTab === 'services' && <Services />}
            {activeTab === 'payment' && <Payment/>}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Modals */}
        {/* <AddClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSubmit={handleAddClient}
        />
        <AddVehicleModal
          isOpen={showVehicleModal}
          onClose={() => setShowVehicleModal(false)}
          onSubmit={handleAddVehicle}
          clients={clients}
        /> */}
        <ShowEnquireModal
          isOpen={showEnquireModal}
          onClose={() => setShowEnquireModal(false)}
        />
      </div>
    </>
  )
}

export default App
