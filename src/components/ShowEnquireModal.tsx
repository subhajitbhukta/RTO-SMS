import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, X, Search } from "lucide-react"
// import AddClientModal from "./AddClientModal.tsx"
// import AddVehicleModal from "./AddVehicleModal.tsx"

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface Option {
  id: string
  label: string
}

type FormDataType = {
  name: string
  email: string
  phone: string
  address: string
}

type VehicleFormDataType = {
  make: string
  model: string
  plateNumber: string
  year: string
  color: string
}

const Dropdown = ({ label, required, options, selected, onSelect, onAdd, multi = false, buttonRef, isOpen, setIsOpen, addButtonText }: any) => {
  const [search, setSearch] = useState("")
  const filtered = options.filter((o: Option) => o.label.toLowerCase().includes(search.toLowerCase()))
  
  const display = multi 
    ? (selected.length > 0 ? `${selected.length} selected` : `Select ${label.toLowerCase()}`)
    : (selected ? selected.label : `Select ${label.toLowerCase()}`)
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all shadow-sm"
        >
          <span className="text-slate-700 truncate">{display}</span>
          <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-64 overflow-hidden">
            <div className="p-2.5 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.map((opt: Option) => (
                multi ? (
                  <label key={opt.id} className="flex items-center px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={!!selected.find((s: Option) => s.id === opt.id)}
                      onChange={() => onSelect(opt)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="ml-3 text-sm text-slate-700">{opt.label}</span>
                  </label>
                ) : (
                  <button
                    key={opt.id}
                    onClick={() => { onSelect(opt); setIsOpen(false) }}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-700 transition-colors"
                  >
                    {opt.label}
                  </button>
                )
              ))}
            </div>
            {onAdd && (
              <div className="p-2.5 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => { onAdd(); setIsOpen(false) }}
                  className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
                > 
                  {addButtonText || "+ Add New"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const ShowEnquireModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedServices, setSelectedServices] = useState<Option[]>([])
  const [selectedClient, setSelectedClient] = useState<Option | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Option | null>(null)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [clientOpen, setClientOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  
  const serviceRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<HTMLDivElement>(null)
  const vehicleRef = useRef<HTMLDivElement>(null)
  
  const services: Option[] = [
    { id: "1", label: "Oil Change" },
    { id: "2", label: "Tire Rotation" },
    { id: "3", label: "Brake Service" },
    { id: "4", label: "Engine Repair" },
    { id: "5", label: "AC Service" }
  ]
  
  const [clients, setClients] = useState<Option[]>([
    { id: "1", label: "John Doe" },
    { id: "2", label: "Jane Smith" },
    { id: "3", label: "Mike Johnson" }
  ])
  
  const [vehicles, setVehicles] = useState<Option[]>([
    { id: "1", label: "Toyota Camry - ABC123" },
    { id: "2", label: "Honda Civic - XYZ789" },
    { id: "3", label: "Ford F-150 - DEF456" }
  ])
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) setServiceOpen(false)
      if (clientRef.current && !clientRef.current.contains(e.target as Node)) setClientOpen(false)
      if (vehicleRef.current && !vehicleRef.current.contains(e.target as Node)) setVehicleOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])
  
  const toggleService = (service: Option) => {
    setSelectedServices(prev => 
      prev.find(s => s.id === service.id) 
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    )
  }
  
  const handleAddClientSubmit = (data: FormDataType) => {
    const client = { 
      id: String(clients.length + 1), 
      label: data.name 
    }
    setClients([...clients, client])
    setSelectedClient(client)
    setShowAddClient(false)
  }
  
  const handleAddVehicleSubmit = (data: VehicleFormDataType) => {
    const vehicle = { 
      id: String(vehicles.length + 1), 
      label: `${data.make} ${data.model} - ${data.plateNumber}`
    }
    setVehicles([...vehicles, vehicle])
    setSelectedVehicle(vehicle)
    setShowAddVehicle(false)
  }
  
  const handleSave = () => {
    if (!selectedServices.length || !selectedClient) {
      alert("Please fill required fields")
      return
    }
    alert("Enquiry saved!")
    onClose()
  }
  
  if (!isOpen) return null
  
  const hasSelections = selectedServices.length > 0 || selectedClient || selectedVehicle
  
  return (
    <>
      <div className="fixed inset-0 bg-white/30 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
        <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl flex flex-col max-h-[88vh]">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-slate-800">New Enquiry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-white rounded-lg">
              <X size={22} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              <Dropdown
                label="Service"
                required
                options={services}
                selected={selectedServices}
                onSelect={toggleService}
                multi
                buttonRef={serviceRef}
                isOpen={serviceOpen}
                setIsOpen={setServiceOpen}
              />
              
              <Dropdown
                label="Client"
                required
                options={clients}
                selected={selectedClient}
                onSelect={setSelectedClient}
                onAdd={() => setShowAddClient(true)}
                addButtonText="+ Add New Client"
                buttonRef={clientRef}
                isOpen={clientOpen}
                setIsOpen={setClientOpen}
              />
              
              <Dropdown
                label="Vehicle"
                options={vehicles}
                selected={selectedVehicle}
                onSelect={setSelectedVehicle}
                onAdd={() => setShowAddVehicle(true)}
                addButtonText="+ Add New Vehicle"
                buttonRef={vehicleRef}
                isOpen={vehicleOpen}
                setIsOpen={setVehicleOpen}
              />
              
              {hasSelections && (
                <div className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Selected Items
                  </h3>
                  
                  {selectedServices.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map(s => (
                          <span key={s.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium shadow-sm">
                            {s.label}
                            <X size={14} className="cursor-pointer hover:text-indigo-900 transition-colors" onClick={() => toggleService(s)} />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedClient && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Client</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium shadow-sm">
                        {selectedClient.label}
                        <X size={14} className="cursor-pointer hover:text-emerald-900 transition-colors" onClick={() => setSelectedClient(null)} />
                      </span>
                    </div>
                  )}
                  
                  {selectedVehicle && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Vehicle</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-full text-xs font-medium shadow-sm">
                        {selectedVehicle.label}
                        <X size={14} className="cursor-pointer hover:text-violet-900 transition-colors" onClick={() => setSelectedVehicle(null)} />
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0 bg-slate-50 rounded-b-2xl">
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md">
              Save Enquiry
            </button>
          </div>
        </div>
      </div>
      
      {showAddClient && (
        <AddClientModal
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onSubmit={handleAddClientSubmit}
        />
      )}
      
      {showAddVehicle && (
        <AddVehicleModal
          isOpen={showAddVehicle}
          onClose={() => setShowAddVehicle(false)}
          onSubmit={handleAddVehicleSubmit}
        />
      )}
    </>
  )
}

export default ShowEnquireModal;