import React, { useState } from "react"

const sampleServices = [
  {
    id: "SRV-1001",
    enquiryId: "ENQ-1001",
    client: { id: "1", label: "John Doe", phone: "+91 98765 43210" },
    vehicle: { id: "1", label: "Toyota Camry 2020" },
    vehicleNumber: "ABC-1234",
    services: [
      { id: "1", label: "Oil Change" },
      { id: "2", label: "Tire Rotation" },
      { id: "3", label: "Brake Inspection" }
    ],
    estimates: [
      { serviceId: "1", serviceName: "Oil Change", price: 45.00, quantity: 1 },
      { serviceId: "2", serviceName: "Tire Rotation", price: 30.00, quantity: 1 },
      { serviceId: "3", serviceName: "Brake Inspection", price: 75.00, quantity: 1 }
    ],
    documents: [
      { id: "1", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/4299e1/ffffff?text=Aadhar+Card" },
      { id: "2", name: "Voter ID", url: "https://via.placeholder.com/400x250/10b981/ffffff?text=Voter+ID" }
    ],
    quotation: "Thank you for choosing our service. We'll provide the best quality work for your Toyota Camry.",
    dateAdded: "2024-11-01",
    nextServiceDate: "2024-12-01",
    status: "pending"
  },
  {
    id: "SRV-1002",
    enquiryId: "ENQ-1002",
    client: { id: "2", label: "Jane Smith", phone: "+91 98765 43211" },
    vehicle: { id: "2", label: "Honda Civic 2019" },
    vehicleNumber: "XYZ-5678",
    services: [
      { id: "4", label: "Engine Repair" },
      { id: "5", label: "AC Service" }
    ],
    estimates: [
      { serviceId: "4", serviceName: "Engine Repair", price: 450.00, quantity: 1 },
      { serviceId: "5", serviceName: "AC Service", price: 120.00, quantity: 1 }
    ],
    documents: [
      { id: "5", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Aadhar+Card" },
      { id: "6", name: "PAN Card", url: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=PAN+Card" }
    ],
    quotation: "Engine repair includes complete diagnostics and parts replacement if needed.",
    dateAdded: "2024-11-05",
    nextServiceDate: "2024-11-15",
    status: "inprogress"
  },
  {
    id: "SRV-1003",
    enquiryId: "ENQ-1003",
    client: { id: "3", label: "Mike Johnson", phone: "+91 98765 43212" },
    vehicle: { id: "3", label: "Ford F-150 2021" },
    vehicleNumber: "DEF-9012",
    services: [
      { id: "6", label: "Transmission Service" },
      { id: "7", label: "Battery Replacement" }
    ],
    estimates: [
      { serviceId: "6", serviceName: "Transmission Service", price: 350.00, quantity: 1 },
      { serviceId: "7", serviceName: "Battery Replacement", price: 180.00, quantity: 1 }
    ],
    documents: [
      { id: "7", name: "Driving License", url: "https://via.placeholder.com/400x250/ef4444/ffffff?text=Driving+License" },
      { id: "8", name: "Insurance", url: "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Insurance" }
    ],
    quotation: "Complete transmission service with fluid replacement and system check.",
    dateAdded: "2024-10-28",
    nextServiceDate: "2024-11-28",
    status: "completed"
  },
  {
    id: "SRV-1004",
    enquiryId: "ENQ-1004",
    client: { id: "4", label: "Sarah Williams", phone: "+91 98765 43213" },
    vehicle: { id: "4", label: "Tesla Model 3 2023" },
    vehicleNumber: "TES-3456",
    services: [
      { id: "9", label: "General Inspection" }
    ],
    estimates: [
      { serviceId: "9", serviceName: "General Inspection", price: 50.00, quantity: 1 }
    ],
    documents: [
      { id: "10", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/84cc16/ffffff?text=Aadhar+Card" }
    ],
    quotation: "Comprehensive vehicle inspection covering all major systems.",
    dateAdded: "2024-11-08",
    status: "dispute"
  },
  {
    id: "SRV-1005",
    enquiryId: "ENQ-1005",
    client: { id: "5", label: "David Brown", phone: "+91 98765 43214" },
    vehicle: { id: "5", label: "BMW X5 2022" },
    vehicleNumber: "LUX-2468",
    services: [
      { id: "10", label: "Full Service" },
      { id: "11", label: "Detailing" }
    ],
    estimates: [
      { serviceId: "10", serviceName: "Full Service", price: 800.00, quantity: 1 },
      { serviceId: "11", serviceName: "Detailing", price: 250.00, quantity: 1 }
    ],
    documents: [
      { id: "11", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/ec4899/ffffff?text=Aadhar+Card" },
      { id: "12", name: "Passport", url: "https://via.placeholder.com/400x250/14b8a6/ffffff?text=Passport" },
      { id: "13", name: "Vehicle Papers", url: "https://via.placeholder.com/400x250/f97316/ffffff?text=Vehicle+Papers" }
    ],
    quotation: "Premium full service package including complete detailing and paint protection.",
    dateAdded: "2024-11-10",
    nextServiceDate: "2025-02-10",
    status: "pending"
  },
  {
    id: "SRV-1006",
    enquiryId: "ENQ-1006",
    client: { id: "6", label: "Emily Davis", phone: "+91 98765 43215" },
    vehicle: { id: "6", label: "Mercedes C-Class 2021" },
    vehicleNumber: "MER-7890",
    services: [
      { id: "12", label: "Brake Service" }
    ],
    estimates: [
      { serviceId: "12", serviceName: "Brake Service", price: 320.00, quantity: 1 }
    ],
    documents: [],
    quotation: "Complete brake system service including pad and rotor inspection.",
    dateAdded: "2024-11-09",
    status: "inprogress"
  },
  {
    id: "SRV-1007",
    enquiryId: "ENQ-1007",
    client: { id: "7", label: "Robert Wilson", phone: "+91 98765 43216" },
    vehicle: { id: "7", label: "Audi A4 2020" },
    vehicleNumber: "AUD-1122",
    services: [
      { id: "13", label: "Annual Service" }
    ],
    estimates: [
      { serviceId: "13", serviceName: "Annual Service", price: 550.00, quantity: 1 }
    ],
    documents: [],
    quotation: "Annual comprehensive service covering all scheduled maintenance items.",
    dateAdded: "2024-10-20",
    status: "completed"
  }
]

const Services = () => {
  const [services, setServices] = useState(sampleServices)
  const [mainTab, setMainTab] = useState("services") // "services" or "details"
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedService, setSelectedService] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const statusTabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "inprogress", label: "In Progress" },
    { id: "dispute", label: "Dispute" },
    { id: "completed", label: "Completed" }
  ]

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      inprogress: "bg-blue-100 text-blue-800 border-blue-200",
      dispute: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-green-100 text-green-800 border-green-200"
    }
    return colors[status] || "bg-slate-100 text-slate-800 border-slate-200"
  }

  const filteredServices = statusFilter === "all"
    ? services
    : services.filter(s => s.status === statusFilter)

  const getStatusCount = (statusId) => {
    if (statusId === "all") return services.length
    return services.filter(s => s.status === statusId).length
  }

  const handleEdit = (service) => {
    setToastMessage(`Edit service: ${service.id}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleDelete = (service) => {
    setServices(prev => prev.filter(s => s.id !== service.id))
    setToastMessage(`Service ${service.id} deleted successfully`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    if (selectedService?.id === service.id) {
      setSelectedService(null)
      setMainTab("services")
    }
  }

  const handleViewDetails = (service) => {
    setSelectedService(service)
    setMainTab("details")
  }

  const calculateTotal = (estimates) => {
    return estimates.reduce((sum, est) => sum + est.price, 0).toFixed(2)
  }

  const calculateSubtotal = () => {
    if (!selectedService) return 0
    return selectedService.estimates.reduce((sum, est) => sum + (est.price * est.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.18 // 18% GST
  }

  const calculateTotalEstimate = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSendWhatsApp = () => {
    if (!selectedService) return

    const message = `
*Service Details - ${selectedService.id}*

*Client:* ${selectedService.client.label}
*Vehicle:* ${selectedService.vehicle?.label || 'N/A'} ${selectedService.vehicleNumber ? `(${selectedService.vehicleNumber})` : ''}
*Status:* ${selectedService.status.toUpperCase()}

*Services:*
${selectedService.estimates.map(est => `• ${est.serviceName}: $${est.price.toFixed(2)}`).join('\n')}

*Total Amount:* $${calculateTotalEstimate().toFixed(2)}

${selectedService.quotation}
    `.trim()

    const phoneNumber = selectedService.client.phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    setToastMessage('Opening WhatsApp...')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Main Navigation Tabs */}
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <div className="flex gap-3">
              <button
                onClick={() => setMainTab("services")}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${mainTab === "services"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "bg-gray-200 text-gray-700 hover:bg-slate-300"
                  }`}
              >
                Services
              </button>
              <button
                onClick={() => setMainTab("details")}
                disabled={!selectedService}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${mainTab === "details" && selectedService
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "bg-gray-200 text-gray-700 hover:bg-slate-300 disabled:cursor-not-allowed"
                  }`}
              >
                Service Details
                {selectedService && mainTab === "details" && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded text-xs">
                    {selectedService.id}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Services Tab Content */}
          {mainTab === "services" && (
            <>
              {/* Status Filter Tabs */}
              <div className="border-b border-slate-200 bg-slate-50">
                <div className="flex overflow-x-auto">
                  {statusTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${statusFilter === tab.id
                        ? "border-blue-600 text-blue-700 bg-blue-50"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white"
                        }`}
                    >
                      {tab.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusFilter === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700"
                        }`}>
                        {getStatusCount(tab.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Services List */}
              <div className="p-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No services found</h3>
                    <p className="text-slate-500">No services match the current filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {service.id}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${getStatusColor(service.status)}`}>
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-1.5 mb-2 flex-1">
                          <div>
                            <span className="text-xs text-slate-500">Client:</span>
                            <p className="text-sm font-medium text-slate-900 truncate">{service.client.label}</p>
                          </div>
                          {service.vehicle && (
                            <div>
                              <span className="text-xs text-slate-500">Vehicle:</span>
                              <p className="text-sm text-slate-900 truncate">
                                {service.vehicleNumber || service.vehicle.label}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs text-slate-500">Date:</span>
                            <p className="text-sm text-slate-900">{service.dateAdded}</p>
                          </div>
                          {service.estimates.length > 0 && (
                            <div className="pt-1 border-t border-slate-100">
                              <span className="text-xs text-slate-500">Total:</span>
                              <p className="text-base font-bold text-slate-900">
                                ${calculateTotal(service.estimates)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {service.services.slice(0, 2).map((svc) => (
                            <span
                              key={svc.id}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs truncate"
                            >
                              {svc.label}
                            </span>
                          ))}
                          {service.services.length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-medium">
                              +{service.services.length - 2}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewDetails(service)}
                            className="flex-1 px-2 py-1.5 bg-slate-700 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              const message = `
*Service Details - ${service.id}*

*Client:* ${service.client.label}
*Vehicle:* ${service.vehicle?.label || 'N/A'} ${service.vehicleNumber ? `(${service.vehicleNumber})` : ''}
*Status:* ${service.status.toUpperCase()}

*Services:*
${service.estimates.map(est => `• ${est.serviceName}: ${est.price.toFixed(2)}`).join('\n')}

*Total Amount:* ${calculateTotal(service.estimates)}

${service.quotation}
                              `.trim()
                              const phoneNumber = service.client.phone.replace(/\D/g, '')
                              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                              setToastMessage('Opening WhatsApp...')
                              setShowToast(true)
                              setTimeout(() => setShowToast(false), 3000)
                            }}
                            className="flex-1 px-2 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Service Details Tab Content */}
          {mainTab === "details" && selectedService && (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {selectedService.id}
                  </h2>
                  <p className="text-slate-600">Enquiry: {selectedService.enquiryId}</p>
                </div>
                <button
                  onClick={() => setMainTab("services")}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  ← Back to Services
                </button>
              </div>

              {/* Client & Vehicle Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase">Client Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">{selectedService.client.label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{selectedService.client.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase">Vehicle Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Vehicle</p>
                      <p className="font-medium text-slate-900">{selectedService.vehicle?.label || 'N/A'}</p>
                    </div>
                    {selectedService.vehicleNumber && (
                      <div>
                        <p className="text-xs text-slate-500">Number</p>
                        <p className="font-medium text-slate-900">{selectedService.vehicleNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedService.status)}`}>
                        {selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedService.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedService.documents.map((doc) => (
                      <div key={doc.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-32 object-cover bg-slate-100"
                        />
                        <div className="p-3 bg-white">
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Breakdown</h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">Service</th>
                        <th className="text-center p-3 text-sm font-semibold text-slate-700">Qty</th>
                        <th className="text-right p-3 text-sm font-semibold text-slate-700">Price</th>
                        <th className="text-right p-3 text-sm font-semibold text-slate-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {selectedService.estimates.map((est, index) => (
                        <tr key={est.serviceId} className={index !== selectedService.estimates.length - 1 ? 'border-b border-slate-200' : ''}>
                          <td className="p-3 text-slate-900">{est.serviceName}</td>
                          <td className="p-3 text-center text-slate-900">{est.quantity}</td>
                          <td className="p-3 text-right text-slate-900">${est.price.toFixed(2)}</td>
                          <td className="p-3 text-right font-medium text-slate-900">${(est.price * est.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax (18% GST)</span>
                      <span className="font-medium text-slate-900">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-300">
                      <span className="text-base font-semibold text-slate-900">Total Estimate</span>
                      <span className="text-xl font-bold text-slate-900">${calculateTotalEstimate().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Quotation Note</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">{selectedService.quotation}</p>
                </div>
              </div>

              {/* Send WhatsApp Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSendWhatsApp}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-50">
            <p className="text-sm font-medium text-slate-700">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services