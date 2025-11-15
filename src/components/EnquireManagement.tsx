import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, X, Search, Upload, FileText, Plus, Check, MoreVertical, Edit, FileCheck, Trash2, ArrowLeft } from "lucide-react"
import { AddClientPopup } from "./AddClientPopup"
import { AddVehiclePopup } from "./VehiclePopup"
interface Option {
  id: string
  label: string
}

interface Document {
  id: string
  name: string
  file?: File | null
}

interface Enquiry {
  id: string
  services: Option[]
  client: Option
  vehicle: Option | null
  documents: Document[]
  createdAt: string
  status: 'pending' | 'in-progress' | 'completed'
}

const useClickOutside = (refs: React.RefObject<HTMLElement>[], handler: () => void) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (refs.every(ref => !ref.current?.contains(e.target as Node))) handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [refs, handler])
}

const Dropdown = ({ label, required, options, selected, onSelect, onAdd, multi = false, addButtonText }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => setIsOpen(false))

  const filtered = options.filter((o: Option) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  const display = multi
    ? selected.length > 0 ? `${selected.length} selected` : `Select ${label.toLowerCase()}`
    : selected?.label || `Select ${label.toLowerCase()}`

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all shadow-sm"
        >
          <span className="text-slate-700 truncate">{display}</span>
          <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2.5 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.map((opt: Option) =>
                multi ? (
                  <label key={opt.id} className="flex items-center px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={!!selected.find((s: Option) => s.id === opt.id)}
                      onChange={() => onSelect(opt)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
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
              )}
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

// const DocumentUpload = ({ doc, onFileSelect, onRemove }: any) => (
//   <div
//     onDragOver={(e) => e.preventDefault()}
//     onDrop={(e) => {
//       e.preventDefault()
//       const file = e.dataTransfer.files[0]
//       if (file) onFileSelect(doc.id, file)
//     }}
//     className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:border-indigo-400 transition-all duration-200"
//   >
//     <label className="text-sm font-medium text-slate-700 mb-2 block">{doc.name}</label>
//     {!doc.file ? (
//       <label className="flex flex-col items-center justify-center py-6 cursor-pointer group">
//         <input
//           type="file"
//           className="hidden"
//           onChange={(e) => {
//             const file = e.target.files?.[0]
//             if (file) onFileSelect(doc.id, file)
//           }}
//         />
//         <Upload className="h-10 w-10 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//         <span className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
//           Drag & drop or click to upload
//         </span>
//       </label>
//     ) : (
//       <div className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-lg">
//             <FileText className="h-5 w-5 text-indigo-500" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-slate-700">{doc.file.name}</p>
//             <p className="text-xs text-slate-500">{(doc.file.size / 1024).toFixed(1)} KB</p>
//           </div>
//         </div>
//         <button
//           onClick={() => onRemove(doc.id)}
//           className="text-rose-500 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-rose-50"
//         >
//           <X size={18} />
//         </button>
//       </div>
//     )}
//   </div>
// )

const AddDocumentModal = ({ isOpen, onClose, onAdd }: any) => {
  const [docName, setDocName] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (docName.trim()) {
      onAdd(docName)
      setDocName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Document</h3>
        <input
          type="text"
          placeholder="Enter document name..."
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!docName.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Document
          </button>
        </div>
      </div>
    </div>
  )
}

export const SuccessToast = ({ message, onClose }: any) => (
  <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl border border-emerald-200 p-4 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 z-50">
    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
      <Check className="text-emerald-600" size={18} />
    </div>
    <p className="text-sm font-medium text-slate-700">{message}</p>
    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
      <X size={18} />
    </button>
  </div>
)

const ActionMenu = ({ enquiry, onEdit, onCreateService, onDiscard }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => setIsOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-slate-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <button
            onClick={() => { onEdit(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
          >
            <Edit size={16} className="text-indigo-600" />
            <span className="text-slate-700 font-medium">Edit Enquiry</span>
          </button>
          <button
            onClick={() => { onCreateService(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
          >
            <FileCheck size={16} className="text-emerald-600" />
            <span className="text-slate-700 font-medium">Create Service</span>
          </button>
          <button
            onClick={() => { onDiscard(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors flex items-center gap-3 text-sm border-t border-slate-100"
          >
            <Trash2 size={16} className="text-rose-600" />
            <span className="text-rose-700 font-medium">Discard Enquiry</span>
          </button>
        </div>
      )}
    </div>
  )
}

export const EnquiryList = ({ enquiries, onEdit, onCreateService, onDiscard }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Services</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="text-slate-400" size={28} />
                    </div>
                    <p className="text-slate-600 font-medium">No enquiries found</p>
                    <p className="text-slate-500 text-sm">Create your first enquiry to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry: Enquiry) => (
                <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">#{enquiry.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 font-medium">{enquiry.client.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{enquiry.vehicle?.label || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {enquiry.services.slice(0, 2).map((s) => (
                        <span key={s.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                          {s.label}
                        </span>
                      ))}
                      {enquiry.services.length > 2 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          +{enquiry.services.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{enquiry.createdAt}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu
                      enquiry={enquiry}
                      onEdit={onEdit}
                      onCreateService={onCreateService}
                      onDiscard={onDiscard}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const EnquireManagement = ({ editMode = false, editData = null, onSaveComplete }: any) => {
  const [selectedServices, setSelectedServices] = useState<Option[]>(editData?.services || [])
  const [selectedClient, setSelectedClient] = useState<Option | null>(editData?.client || null)
  const [selectedVehicle, setSelectedVehicle] = useState<Option | null>(editData?.vehicle || null)
  const [documents, setDocuments] = useState<Document[]>(editData?.documents || [
    { id: "1", name: "Driving License", file: null },
    { id: "2", name: "PAN Details", file: null },
  ])

  const services: Option[] = [
    { id: "1", label: "Oil Change" },
    { id: "2", label: "Tire Rotation" },
    { id: "3", label: "Brake Service" },
    { id: "4", label: "Engine Repair" },
    { id: "5", label: "AC Service" },
  ]

  const clients: Option[] = [
    { id: "1", label: "John Doe" },
    { id: "2", label: "Jane Smith" },
    { id: "3", label: "Mike Johnson" },
  ]

  const vehicles: Option[] = [
    { id: "1", label: "Toyota Camry - ABC123" },
    { id: "2", label: "Honda Civic - XYZ789" },
    { id: "3", label: "Ford F-150 - DEF456" },
  ]
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showClientModel, setShowClientModel] = useState(false)
  const [showVehicleModel, setShowVehicleModel] = useState(false)


  const [clientList, setClientList] = useState<Option[]>(clients);
  const [vehicleList, setVehicleList] = useState<Option[]>(vehicles);

  const saveNewClient = (name: string) => {
    const newClient = { id: String(Date.now()), label: name };
    setClientList((prev) => [...prev, newClient]);
    setSelectedClient(newClient);
    setShowClientModel(false);
  };

  const saveNewVehicle = (label: string) => {
    const newVehicle = { id: String(Date.now()), label };
    setVehicleList((prev) => [...prev, newVehicle]);
    setSelectedVehicle(newVehicle);
    setShowVehicleModel(false);
  };




  const toggleService = (service: Option) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    )
  }

  const handleFileSelect = (docId: string, file: File) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, file } : d)))
  }

  const handleRemoveFile = (docId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, file: null } : d)))
  }

  const handleAddDocument = (name: string) => {
    setDocuments((prev) => [...prev, { id: String(Date.now()), name, file: null }])
    setShowAddDoc(false)
  }

  const handleSave = () => {
    if (!selectedServices.length || !selectedClient) return

    const enquiryData = {
      id: editData?.id || String(Date.now()),
      services: selectedServices,
      client: selectedClient,
      vehicle: selectedVehicle,
      documents,
      createdAt: editData?.createdAt || new Date().toLocaleDateString(),
      status: editData?.status || 'pending'
    }

    if (onSaveComplete) {
      onSaveComplete(enquiryData, editMode)
    }

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const hasSelections = selectedServices.length > 0 || selectedClient || selectedVehicle

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            {editMode ? "Edit Enquiry" : "New Enquiry"}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {editMode
              ? "Update the enquiry details"
              : "Fill in the details to create a new service enquiry"}
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          <button
            onClick={() => setShowClientModel(true)}
            className="bg-white text-blue-600 shadow-sm border cursor-pointer border-gray-200 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            Add Client
          </button>

          <button
            onClick={() => setShowVehicleModel(true)}
            className="bg-white text-blue-600 cursor-pointer shadow-sm border border-gray-200 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            Add Vehicle
          </button>
        </div>
      </div>


      {showClientModel && (
        <AddClientPopup
          onClose={() => setShowClientModel(false)}
          onSave={saveNewClient}
        />
      )}

      {showVehicleModel && (
        <AddVehiclePopup
          onClose={() => setShowVehicleModel(false)}
          onSave={saveNewVehicle}
        />
      )}


      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <Dropdown
          label="Service"
          required
          options={services}
          selected={selectedServices}
          onSelect={toggleService}
          multi
        />

        <Dropdown
          label="Client"
          required
          options={clients}
          selected={selectedClient}
          onSelect={setSelectedClient}
          addButtonText="+ Add New Client"
        />

        <Dropdown
          label="Vehicle"
          options={vehicles}
          selected={selectedVehicle}
          onSelect={setSelectedVehicle}
          addButtonText="+ Add New Vehicle"
        />

        {/* <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Documents</h3>
            <button
              onClick={() => setShowAddDoc(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-all"
            >
              <Plus size={14} />
              Add Document
            </button>
          </div>
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentUpload
                key={doc.id}
                doc={doc}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveFile}
              />
            ))}
          </div>
        </div> */}

        {hasSelections && (
          <div className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Selected Items</h3>
            {selectedServices.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-600 mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium shadow-sm"
                    >
                      {s.label}
                      <X size={14} className="cursor-pointer hover:text-indigo-900" onClick={() => toggleService(s)} />
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedClient && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-600 mb-2">Client</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium shadow-sm">
                  {selectedClient.label}
                  <X size={14} className="cursor-pointer hover:text-emerald-900" onClick={() => setSelectedClient(null)} />
                </span>
              </div>
            )}
            {selectedVehicle && (
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Vehicle</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-full text-xs font-medium shadow-sm">
                  {selectedVehicle.label}
                  <X size={14} className="cursor-pointer hover:text-violet-900" onClick={() => setSelectedVehicle(null)} />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={!selectedServices.length || !selectedClient}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editMode ? 'Update Enquiry' : 'Save Enquiry'}
          </button>
        </div>
      </div>

      <AddDocumentModal isOpen={showAddDoc} onClose={() => setShowAddDoc(false)} onAdd={handleAddDocument} />
      {showSuccess && <SuccessToast message={editMode ? "Enquiry updated successfully!" : "Enquiry saved successfully!"} onClose={() => setShowSuccess(false)} />}
    </div>
  )
}

export default EnquireManagement

