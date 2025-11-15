import React, { useState } from "react"

const sampleServices = [
  {
    id: "SRV-1001",
    enquiryId: "ENQ-1001",
    client: { id: "1", label: "John Doe", phone: "+919876543210" },
    vehicle: { id: "1", label: "Toyota Camry 2020" },
    vehicleNumber: "ABC-1234",
    services: [{ id: "1", label: "Oil Change" }, { id: "2", label: "Tire Rotation" }],
    estimates: [
      { serviceId: "1", serviceName: "Oil Change", price: 45.00, quantity: 1 },
      { serviceId: "2", serviceName: "Tire Rotation", price: 30.00, quantity: 1 }
    ],
    documents: [
      { id: "1", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/4299e1/ffffff?text=Aadhar+Card" },
      { id: "2", name: "Voter ID", url: "https://via.placeholder.com/400x250/10b981/ffffff?text=Voter+ID" }
    ],
    quotation: "Thank you for choosing our service.",
    dateAdded: "2024-11-01",
    status: "pending",
    paymentStatus: "unpaid",
    amountPaid: 0
  },
  {
    id: "SRV-1002",
    enquiryId: "ENQ-1002",
    client: { id: "2", label: "Jane Smith", phone: "+919876543211" },
    vehicle: { id: "2", label: "Honda Civic 2019" },
    vehicleNumber: "XYZ-5678",
    services: [{ id: "4", label: "Engine Repair" }],
    estimates: [{ serviceId: "4", serviceName: "Engine Repair", price: 450.00, quantity: 1 }],
    documents: [{ id: "5", name: "Aadhar Card", url: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Aadhar" }],
    quotation: "Engine repair includes complete diagnostics.",
    dateAdded: "2024-11-05",
    status: "inprogress",
    paymentStatus: "unpaid",
    amountPaid: 0
  }
]

const STATUS_STYLES = {
  completed: "bg-green-100 text-green-700 border-green-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  inprogress: "bg-blue-100 text-blue-700 border-blue-300",
  dispute: "bg-orange-100 text-orange-700 border-orange-300",
  default: "bg-slate-100 text-slate-700 border-slate-300",
}

const Button = ({ onClick, children, color = "blue", icon, className = "" }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    orange: "bg-orange-600 hover:bg-orange-700",
  }
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2 ${colors[color]} ${className}`}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  )
}

const Services = () => {
  const [services, setServices] = useState(sampleServices)
  const [mainTab, setMainTab] = useState("services")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedService, setSelectedService] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showStatusMenu, setShowStatusMenu] = useState(null)
  const [preview, setPreview] = useState(null)
  const [previewIdx, setPreviewIdx] = useState(0)

  const statusTabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "inprogress", label: "In Progress" },
    { id: "dispute", label: "Dispute" },
    { id: "completed", label: "Completed" }
  ]

  const getStatusColor = (status) => STATUS_STYLES[status] || STATUS_STYLES.default

  const filteredServices = statusFilter === "all" ? services : services.filter(s => s.status === statusFilter)

  const getStatusCount = (statusId) => statusId === "all" ? services.length : services.filter(s => s.status === statusId).length

  const updateServiceStatus = (serviceId, newStatus) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s))
    if (selectedService?.id === serviceId) {
      setSelectedService(prev => ({ ...prev, status: newStatus }))
    }
    setShowStatusMenu(null)
    setToastMessage(`Status updated to ${newStatus}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const calculateTotal = (estimates) => estimates.reduce((sum, est) => sum + est.price * est.quantity, 0)
  const calculateSubtotal = () => selectedService ? selectedService.estimates.reduce((sum, est) => sum + est.price * est.quantity, 0) : 0
  const calculateTax = () => calculateSubtotal() * 0.18
  const calculateTotalEstimate = () => calculateSubtotal() + calculateTax()

  const markAsPaid = () => {
    const total = calculateTotalEstimate()
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, paymentStatus: "paid", amountPaid: total, status: "completed" } : s))
    setSelectedService(prev => ({ ...prev, paymentStatus: "paid", amountPaid: total, status: "completed" }))
    setToastMessage("Marked as paid and completed")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const markAsUnpaid = () => {
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, paymentStatus: "unpaid", amountPaid: 0, status: "pending" } : s))
    setSelectedService(prev => ({ ...prev, paymentStatus: "unpaid", amountPaid: 0, status: "pending" }))
    setToastMessage("Marked as unpaid")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSendWhatsApp = (service) => {
    const message = `*Service: ${service.id}*\n\nClient: ${service.client.label}\nVehicle: ${service.vehicle?.label}\nTotal: ₹${calculateTotal(service.estimates).toFixed(2)}`
    const phoneNumber = service.client.phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const navigate = (dir) => {
    const docs = selectedService.documents
    const newIdx = dir === 'next' ? Math.min(previewIdx + 1, docs.length - 1) : Math.max(previewIdx - 1, 0)
    setPreviewIdx(newIdx)
    setPreview(docs[newIdx])
  }

  return (
    <div className="min-h-screen p-2 bg-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          {/* Main Tabs */}
          <div className="bg-slate-50 p-4 border-b">
            <div className="flex gap-3">
              <button onClick={() => setMainTab("services")} className={`px-4 py-2 text-sm rounded-lg ${mainTab === "services" ? "bg-white text-blue-600 shadow-sm border" : "bg-gray-200 text-gray-700"}`}>Services</button>
              <button onClick={() => setMainTab("details")} disabled={!selectedService} className={`px-4 py-2 text-sm rounded-lg ${mainTab === "details" && selectedService ? "bg-white text-blue-600 shadow-sm border" : "bg-gray-200 text-gray-700"}`}>
                Service Details {selectedService && mainTab === "details" && <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded text-xs">{selectedService.id}</span>}
              </button>
            </div>
          </div>

          {/* Services List */}
          {mainTab === "services" && (
            <>
              <div className="border-b bg-slate-50 flex overflow-x-auto">
                {statusTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${statusFilter === tab.id ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-slate-600"}`}>
                    {tab.label} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusFilter === tab.id ? "bg-blue-600 text-white" : "bg-slate-200"}`}>{getStatusCount(tab.id)}</span>
                  </button>
                ))}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow relative">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold truncate">{service.id}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(service.status)}`}>
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => setShowStatusMenu(showStatusMenu === service.id ? null : service.id)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                            {showStatusMenu === service.id && (
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border z-20">
                                <button onClick={() => updateServiceStatus(service.id, "pending")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-yellow-50 rounded-t-lg flex items-center gap-2">
                                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                  Pending
                                </button>
                                <button onClick={() => updateServiceStatus(service.id, "inprogress")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  In Progress
                                </button>
                                <button onClick={() => updateServiceStatus(service.id, "dispute")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                  Dispute
                                </button>
                                <button onClick={() => updateServiceStatus(service.id, "completed")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 rounded-b-lg flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  Completed
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-2">
                        <div><span className="text-xs text-slate-500">Client:</span><p className="text-sm font-medium truncate">{service.client.label}</p></div>
                        <div><span className="text-xs text-slate-500">Vehicle:</span><p className="text-sm truncate">{service.vehicleNumber || service.vehicle.label}</p></div>
                        <div><span className="text-xs text-slate-500">Date:</span><p className="text-sm">{service.dateAdded}</p></div>
                        <div className="pt-1 border-t"><span className="text-xs text-slate-500">Total:</span><p className="text-base font-bold">₹{calculateTotal(service.estimates).toFixed(2)}</p></div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 pt-2 border-t">
                        <button onClick={() => { setSelectedService(service); setMainTab("details") }} className="flex-1 px-2 py-1.5 bg-slate-700 text-white rounded text-xs font-medium hover:bg-slate-800">View Details</button>
                        <button onClick={() => handleSendWhatsApp(service)} className="px-2 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Service Details */}
          {mainTab === "details" && selectedService && (
            <div className="p-6 max-w-6xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <div><h2 className="text-2xl font-bold">{selectedService.id}</h2><p className="text-slate-600">Enquiry: {selectedService.enquiryId}</p></div>
                <Button onClick={() => setMainTab("services")} color="gray">← Back</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase">Client</h3>
                  <p className="text-sm mb-1"><span className="text-slate-500">Name:</span> <span className="font-medium">{selectedService.client.label}</span></p>
                  <p className="text-sm"><span className="text-slate-500">Phone:</span> <span className="font-medium">{selectedService.client.phone}</span></p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase">Vehicle</h3>
                  <p className="text-sm mb-1"><span className="text-slate-500">Vehicle:</span> <span className="font-medium">{selectedService.vehicle?.label}</span></p>
                  <p className="text-sm mb-2"><span className="text-slate-500">Number:</span> <span className="font-medium">{selectedService.vehicleNumber}</span></p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedService.status)}`}>{selectedService.status}</span>
                </div>
              </div>

              {selectedService.documents?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedService.documents.map((doc, i) => (
                      <div key={doc.id} onClick={() => { setPreview(doc); setPreviewIdx(i) }} className="border rounded-lg overflow-hidden hover:shadow-lg cursor-pointer group">
                        <div className="relative">
                          <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm">View</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white"><p className="text-sm font-medium truncate">{doc.name}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {preview && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
                  <div className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                      <div><h3 className="font-semibold">{preview.name}</h3><p className="text-sm text-slate-300">Document {previewIdx + 1} of {selectedService.documents.length}</p></div>
                      <button onClick={() => setPreview(null)} className="hover:bg-slate-700 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                    <div className="relative bg-slate-100">
                      <img src={preview.url} alt={preview.name} className="w-full max-h-[70vh] object-contain" />
                      {selectedService.documents.length > 1 && (
                        <>
                          <button onClick={() => navigate('prev')} disabled={previewIdx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg disabled:opacity-40"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                          <button onClick={() => navigate('next')} disabled={previewIdx === selectedService.documents.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg disabled:opacity-40"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-left">Service</th>
                        <th className="p-3 text-sm font-semibold text-center">Qty</th>
                        <th className="p-3 text-sm font-semibold text-right">Price</th>
                        <th className="p-3 text-sm font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedService.estimates.map((est) => (
                        <tr key={est.serviceId} className="hover:bg-slate-50">
                          <td className="p-3">{est.serviceName}</td>
                          <td className="p-3 text-center">{est.quantity}</td>
                          <td className="p-3 text-right">₹{est.price.toFixed(2)}</td>
                          <td className="p-3 text-right font-medium">₹{(est.price * est.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-slate-50 border-t p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Tax (18% GST)</span><span className="font-medium">₹{calculateTax().toFixed(2)}</span></div>
                    <div className="flex justify-between pt-2 border-t"><span className="font-semibold">Total</span><span className="text-xl font-bold text-blue-600">₹{calculateTotalEstimate().toFixed(2)}</span></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">Status:</span>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedService.paymentStatus === "paid" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                          {selectedService.paymentStatus === "paid" ? "✓ Paid" : "⚠ Unpaid"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">Amount Paid: <span className="font-semibold">₹{selectedService.amountPaid.toFixed(2)}</span></p>
                      <p className="text-sm text-slate-600">Remaining: <span className="font-semibold text-red-600">₹{Math.max(0, calculateTotalEstimate() - selectedService.amountPaid).toFixed(2)}</span></p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={markAsPaid} color="green" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}>Paid</Button>
                      <Button onClick={markAsUnpaid} color="red" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}>Unpaid</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5">
                <Button onClick={() => handleSendWhatsApp(selectedService)} color="green" icon="">Generate Invoice</Button>

                <Button onClick={() => handleSendWhatsApp(selectedService)} color="green" icon={<svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}>Send WhatsApp</Button>
              </div>
            </div>
          )}
        </div>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border p-4 z-50">
            <p className="text-sm font-medium text-slate-700">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services