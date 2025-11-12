import React, { useState, ChangeEvent } from 'react'
import { Car, Calendar, Hash, CheckCircle } from 'lucide-react'

const AddVehicleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vehicle_no: '',
    chassis_no: '',
    engine_no: '',
    reg_date: '',
    manufacturar: '',
    name: '',
    note: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    if (!formData.vehicle_no) {
      alert('Vehicle number is required')
      return
    }
    console.log('Vehicle Added:', formData)
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 2000)
    setFormData({
      vehicle_no: '',
      chassis_no: '',
      engine_no: '',
      reg_date: '',
      manufacturar: '',
      name: '',
      note: ''
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <Car className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Add Vehicle</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div className="relative">
          <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="vehicle_no"
            type="text"
            placeholder="Vehicle No *"
            value={formData.vehicle_no}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
          />
        </div>

        <input
          name="chassis_no"
          placeholder="Chassis No"
          value={formData.chassis_no}
          onChange={handleChange}
          className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
        />

        <input
          name="engine_no"
          placeholder="Engine No"
          value={formData.engine_no}
          onChange={handleChange}
          className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
        />

        <input
          name="manufacturar"
          placeholder="Manufacturer"
          value={formData.manufacturar}
          onChange={handleChange}
          className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
        />

        <label className="block ml-2 mb-1 text-sm font-medium text-gray-700">
          Registration Date
        </label>
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="reg_date"
            type="date"
            value={formData.reg_date}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
          />
        </div>

        <input
          name="name"
          placeholder="Owner Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl"
        />

        <textarea
          name="note"
          placeholder="Notes"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl h-20"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl"
        >
          Save
        </button>
        <button
          type="reset"
          onClick={() =>
            setFormData({
              vehicle_no: '',
              chassis_no: '',
              engine_no: '',
              reg_date: '',
              manufacturar: '',
              name: '',
              note: ''
            })
          }
          className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
        >
          Clear
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="flex items-center justify-center gap-2 mt-4 text-green-600 font-medium text-sm">
          <CheckCircle className="w-4 h-4" />
          Vehicle added successfully!
        </div>
      )}
    </div>
  )
}

export default AddVehicleForm
