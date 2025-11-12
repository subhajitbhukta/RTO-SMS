import React, { useState, ChangeEvent } from "react"
import { User, Mail, Phone, MapPin } from "lucide-react"

const AddClientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    console.log("✅ Client added:", formData)
    alert("Client added successfully!")

    // Reset form after submit
    setFormData({ name: "", email: "", phone: "", address: "" })
  }

  return (
    <div className="w-full  bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">New Client</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            placeholder="Full Name *"
          />
        </div>

        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            placeholder="Email Address *"
          />
        </div>

        <div className="relative">
          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            placeholder="Phone Number *"
          />
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
            placeholder="Address (Optional)"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
        >
          Add Client
        </button>
      </div>
    </div>
  )
}

export default AddClientForm
