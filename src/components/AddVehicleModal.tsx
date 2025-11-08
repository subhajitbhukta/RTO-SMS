import React, { useState, ChangeEvent } from 'react'
import { X, Car, Calendar, Hash, User } from 'lucide-react'

type Client = {
  id: string | number
  name: string
}

type FormDataType = {
  clientId: string
  vehicle_no: string
  chassis_no: string
  engine_no: string
  reg_date: string
  manufacturar: string
  validity: string
  name: string
  note: string
}

type AddVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormDataType) => void
  clients: Client[]
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSubmit, clients }) => {
  const [formData, setFormData] = useState<FormDataType>({
    clientId: '',
    vehicle_no: '',
    chassis_no: '',
    engine_no: '',
    reg_date: '',
    manufacturar: '',
    validity: '',
    name: '',
    note: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    if (!formData.clientId || !formData.vehicle_no) {
      alert('Client & Vehicle No required')
      return
    }
    onSubmit(formData)
    setFormData({
      clientId: '',
      vehicle_no: '',
      chassis_no: '',
      engine_no: '',
      reg_date: '',
      manufacturar: '',
      validity: '',
      name: '',
      note: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20 animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 sticky top-0 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add Vehicle</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">

          {/* CLIENT */}
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
            >
              <option value="">Select Client *</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          {/* vehicle_no */}
          <div className="relative">
            <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="vehicle_no" type="text" placeholder="Vehicle No *" onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl" />
          </div>

          <input name="chassis_no" placeholder="Chassis No" onChange={handleChange}
            className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl" />

          <input name="engine_no" placeholder="Engine No" onChange={handleChange}
            className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl" />


          <input name="manufacturar" placeholder="Manufacturer" onChange={handleChange}
            className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl" />

          <label className="block ml-2 mb-1 text-sm font-medium text-gray-700">
            Registration Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="reg_date"
              type="date"
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
            />
          </div>


          <input name="name" placeholder="Owner Name" onChange={handleChange}
            className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl" />

          <textarea name="note" placeholder="Notes" onChange={handleChange}
            className="w-full p-3 text-sm border border-gray-200 rounded-xl h-20"></textarea>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl">
              Save
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}}
        .animate-scaleIn{animation:scaleIn .2s ease-out;}
      `}</style>
    </div>
  )
}

export default AddVehicleModal
