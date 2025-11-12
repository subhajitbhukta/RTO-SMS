import React, { useState, useMemo } from "react";
import { Bell, Search, X, Calendar, DollarSign, FileText, Phone, Mail, Car, User } from "lucide-react";

type ServiceItem = {
  name: string;
  qty: number;
  price: number;
};

type Document = {
  id: string | number;
  name: string;
  url?: string;
};

type Service = {
  id: string | number;
  type: string;
  nextDue: string;
  vehicleId: string | number;
  lastService?: string;
  description?: string;
  serviceItems?: ServiceItem[];
  totalAmount?: number;
  paidAmount?: number;
  documents?: Document[];
  quotationNote?: string;
};

type Vehicle = {
  id: string | number;
  model: string;
  number?: string;
  clientId: string | number;
};

type Client = {
  id: string | number;
  name: string;
  phone?: string;
  email?: string;
};

// Sample Data
const sampleServices: Service[] = [
  {
    id: 1001,
    type: "Oil Change",
    nextDue: "2024-11-20",
    vehicleId: 1,
    lastService: "2024-08-20",
    description: "Regular oil change service required",
    serviceItems: [
      { name: "Oil Change", qty: 1, price: 45 },
      { name: "Tire Rotation", qty: 1, price: 30 },
      { name: "Brake Inspection", qty: 1, price: 75 },
      { name: "Labor", qty: 1, price: 150 },
    ],
    totalAmount: 300,
    paidAmount: 0,
    documents: [
      { id: 1, name: "Aadhar Card" },
      { id: 2, name: "Voter ID" },
    ],
    quotationNote: "Thank you for choosing our service. We'll provide the best quality work for your Toyota Camry.",
  },
  {
    id: 1002,
    type: "Tire Rotation",
    nextDue: "2024-11-15",
    vehicleId: 2,
    lastService: "2024-09-15",
    description: "Rotate tires for even wear",
    serviceItems: [{ name: "Tire Rotation", qty: 1, price: 40 }],
    totalAmount: 40,
    paidAmount: 40,
    documents: [],
  },
  {
    id: 1003,
    type: "Brake Inspection",
    nextDue: "2024-12-05",
    vehicleId: 3,
    lastService: "2024-09-05",
    description: "Complete brake system check",
    serviceItems: [
      { name: "Brake Inspection", qty: 1, price: 80 },
      { name: "Labor", qty: 1, price: 97 },
    ],
    totalAmount: 177,
    paidAmount: 100,
    documents: [{ id: 1, name: "Aadhar Card" }],
    quotationNote: "Thank you for choosing our service. We'll provide the best quality work for your Ford F-150.",
  },
  {
    id: 1004,
    type: "Engine Service",
    nextDue: "2024-10-30",
    vehicleId: 4,
    lastService: "2024-07-30",
    description: "Full engine diagnostics and service",
    totalAmount: 250,
    paidAmount: 0,
    serviceItems: [
      { name: "Engine Diagnostics", qty: 1, price: 150 },
      { name: "Parts", qty: 1, price: 100 },
    ],
  },
];

const sampleVehicles: Vehicle[] = [
  { id: 1, model: "Toyota Camry 2020", number: "ABC-1234", clientId: 1 },
  { id: 2, model: "Honda Civic 2019", number: "XYZ-5678", clientId: 2 },
  { id: 3, model: "Ford F-150 2021", number: "DEF-9012", clientId: 3 },
  { id: 4, model: "Tesla Model 3 2023", number: "TES-3456", clientId: 4 },
];

const sampleClients: Client[] = [
  { id: 1, name: "John Doe", phone: "+919876543210", email: "john@example.com" },
  { id: 2, name: "Jane Smith", phone: "+919876543211", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", phone: "+919876543212", email: "mike@example.com" },
  { id: 4, name: "Sarah Williams", phone: "+919876543213", email: "sarah@example.com" },
];

const getDaysUntil = (dateString: string): number => {
  const today = new Date("2024-11-12");
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Reminders: React.FC = () => {
  const [mainTab, setMainTab] = useState<"renewals" | "details">("renewals");
  const [reminderFilter, setReminderFilter] = useState<"all" | "15days" | "60days" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const services = sampleServices;
  const vehicles = sampleVehicles;
  const clients = sampleClients;

  const filteredServices = useMemo(() => {
    let filtered = services;

    filtered = filtered.filter((s) => {
      const days = getDaysUntil(s.nextDue);
      if (reminderFilter === "15days") return days <= 15 && days >= 0;
      if (reminderFilter === "60days") return days <= 60 && days >= 0;
      if (reminderFilter === "overdue") return days < 0;
      return true;
    });

    if (searchTerm) {
      filtered = filtered.filter((s) => {
        const vehicle = vehicles.find((v) => v.id === s.vehicleId);
        const client = clients.find((c) => c.id === vehicle?.clientId);
        return (
          s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  }, [services, reminderFilter, searchTerm, vehicles, clients]);

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setEditingService({ ...service });
    setMainTab("details");
  };

  const handleAddDocument = () => {
    if (!newDocName.trim() || !editingService) return;
    
    let docUrl = undefined;
    if (uploadingFile) {
      // Create a local URL for the uploaded file
      docUrl = URL.createObjectURL(uploadingFile);
    }
    
    const newDoc: Document = { 
      id: Date.now(), 
      name: newDocName.trim(),
      url: docUrl
    };
    
    setEditingService({
      ...editingService,
      documents: [...(editingService.documents || []), newDoc],
    });
    setNewDocName("");
    setUploadingFile(null);
    showToastMessage("Document uploaded successfully!");
  };

  const handleRemoveDocument = (docId: string | number) => {
    if (!editingService) return;
    
    // Revoke the object URL if it exists to free up memory
    const docToRemove = editingService.documents?.find(d => d.id === docId);
    if (docToRemove?.url) {
      URL.revokeObjectURL(docToRemove.url);
    }
    
    setEditingService({
      ...editingService,
      documents: editingService.documents?.filter((d) => d.id !== docId) || [],
    });
    showToastMessage("Document removed!");
  };

  const handleSavePayment = () => {
    if (!editingService || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 0) return showToastMessage("Invalid amount");

    const total = editingService.totalAmount || 0;
    const paid = editingService.paidAmount || 0;
    const newPaid = paid + amount;

    if (newPaid > total) return showToastMessage("Payment exceeds total");

    const updatedService = { ...editingService, paidAmount: newPaid };
    setEditingService(updatedService);
    setSelectedService(updatedService);
    setPaymentAmount("");
    showToastMessage(`Payment of ₹${amount.toFixed(2)} recorded successfully!`);
  };

  const handleSendWhatsApp = (service: Service) => {
    const vehicle = vehicles.find((v) => v.id === service.vehicleId);
    const client = clients.find((c) => c.id === vehicle?.clientId);
    const daysLeft = getDaysUntil(service.nextDue);

    const msg = `*Service Reminder*

Dear ${client?.name},

Your vehicle *${vehicle?.model}* (${vehicle?.number}) is due for *${service.type}*.

*Next Service Due:* ${service.nextDue}
*Days ${daysLeft < 0 ? "Overdue" : "Remaining"}:* ${Math.abs(daysLeft)} days

${service.description || "Please schedule your service appointment soon."}

Thank you for choosing our service!`;

    const phone = client?.phone?.replace(/\D/g, "") || "";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    showToastMessage("Opening WhatsApp...");
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getDaysBadgeColor = (days: number) => {
    if (days < 0) return "bg-red-100 text-red-800 border-red-300";
    if (days <= 15) return "bg-amber-100 text-amber-800 border-amber-300";
    if (days <= 60) return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const vehicle = editingService ? vehicles.find((v) => v.id === editingService.vehicleId) : null;
  const client = vehicle ? clients.find((c) => c.id === vehicle.clientId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Service Reminders</h1>
          <p className="text-slate-600">Manage and track vehicle service schedules</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 md:p-6 border-b border-slate-200 flex flex-wrap gap-3">
            <button
              onClick={() => setMainTab("renewals")}
              className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                mainTab === "renewals"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Renewals
              </div>
            </button>
            <button
              onClick={() => selectedService && setMainTab("details")}
              disabled={!selectedService}
              className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                mainTab === "details" && selectedService
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View Details
              </div>
            </button>
          </div>

          {/* Renewals View */}
          {mainTab === "renewals" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    placeholder="Search by vehicle, client, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "15days", "60days", "overdue"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setReminderFilter(f as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        reminderFilter === f
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {f === "15days" ? "15 Days" : f === "60days" ? "60 Days" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredServices.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredServices.map((s) => {
                    const vehicle = vehicles.find((v) => v.id === s.vehicleId);
                    const client = clients.find((c) => c.id === vehicle?.clientId);
                    const days = getDaysUntil(s.nextDue);
                    const total = s.totalAmount || 0;
                    const paid = s.paidAmount || 0;
                    return (
                      <div
                        key={s.id}
                        className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-bold text-slate-900">{s.type}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDaysBadgeColor(days)}`}
                          >
                            {days < 0 ? `${Math.abs(days)}d Over` : `${days}d Left`}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{client?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Car className="w-4 h-4 text-slate-400" />
                            <span>{vehicle?.model}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{s.nextDue}</span>
                          </div>
                          {total > 0 && (
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              <span className="font-semibold">₹{paid} / ₹{total}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(s)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm py-2 font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(s)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm py-2 font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg font-medium">No reminders found</p>
                  <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}

          {/* Details View */}
          {mainTab === "details" && editingService && vehicle && client && (
            <div className="p-4 md:p-6">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    SRV-{editingService.id}
                  </h2>
                  <p className="text-slate-600 text-lg">Service: {editingService.type}</p>
                </div>
                <button
                  onClick={() => setMainTab("renewals")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Client Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 overflow-hidden">
                    <h3 className="text-sm font-bold text-blue-900 p-4 bg-blue-100 border-b-2 border-blue-200 uppercase tracking-wide">
                      Client Information
                    </h3>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Name</p>
                          <p className="font-semibold text-slate-900 text-lg">{client.name}</p>
                        </div>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Phone</p>
                            <p className="font-medium text-slate-900">{client.phone}</p>
                          </div>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Email</p>
                            <p className="font-medium text-slate-900">{client.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 overflow-hidden">
                    <h3 className="text-sm font-bold text-purple-900 p-4 bg-purple-100 border-b-2 border-purple-200 uppercase tracking-wide">
                      Vehicle Information
                    </h3>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Model</p>
                          <p className="font-semibold text-slate-900 text-lg">{vehicle.model}</p>
                        </div>
                      </div>
                      {vehicle.number && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Number</p>
                          <p className="font-bold text-slate-900 bg-yellow-200 inline-block px-4 py-2 rounded-lg text-lg border-2 border-yellow-400">
                            {vehicle.number}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Status</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${getDaysBadgeColor(
                            getDaysUntil(editingService.nextDue)
                          )}`}
                        >
                          {getDaysUntil(editingService.nextDue) < 0
                            ? `${Math.abs(getDaysUntil(editingService.nextDue))} Days Overdue`
                            : `${getDaysUntil(editingService.nextDue)} Days Remaining`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-700 p-4 bg-slate-50 border-b-2 border-slate-200 uppercase tracking-wide">
                      Uploaded Documents
                    </h3>
                    <div className="p-5 space-y-4">
                      {editingService.documents?.length ? (
                        <div className="grid grid-cols-2 gap-3">
                          {editingService.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                              <button
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                              >
                                ×
                              </button>
                              {doc.url ? (
                                <a 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <div className="bg-blue-100 h-24 rounded-lg mb-2 flex items-center justify-center border-2 border-blue-200">
                                    <FileText className="w-10 h-10 text-blue-600" />
                                  </div>
                                  <p className="text-sm font-semibold text-slate-900 text-center truncate">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-blue-600 text-center mt-1">
                                    Click to view
                                  </p>
                                </a>
                              ) : (
                                <>
                                  <div className="bg-slate-200 h-24 rounded-lg mb-2 flex items-center justify-center">
                                    <FileText className="w-10 h-10 text-slate-400" />
                                  </div>
                                  <p className="text-sm font-semibold text-slate-900 text-center truncate">
                                    {doc.name}
                                  </p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 text-center py-6">
                          No documents uploaded
                        </p>
                      )}

                      <div className="pt-4 border-t-2 border-slate-200">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Upload New Document</p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Document name..."
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <div className="relative">
                            <input
                              type="file"
                              id="file-upload"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadingFile(file);
                                  if (!newDocName) {
                                    setNewDocName(file.name);
                                  }
                                }
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="file-upload"
                              className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              {uploadingFile ? uploadingFile.name : 'Choose file (optional)'}
                            </label>
                          </div>
                          
                          <button
                            onClick={handleAddDocument}
                            disabled={!newDocName.trim()}
                            className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Document
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Service Breakdown */}
                  {editingService.serviceItems?.length ? (
                    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                      <h3 className="text-sm font-bold text-slate-700 p-4 bg-slate-50 border-b-2 border-slate-200 uppercase tracking-wide">
                        Service Breakdown
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700">Service</th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700">Qty</th>
                              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700">Price</th>
                              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {editingService.serviceItems.map((item, index) => (
                              <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-900 font-medium">{item.name}</td>
                                <td className="px-4 py-3 text-sm text-slate-900 text-center">{item.qty}</td>
                                <td className="px-4 py-3 text-sm text-slate-900 text-right">₹{item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-slate-900 text-right font-semibold">
                                  ₹{(item.qty * item.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-blue-50 border-t-2 border-blue-300">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-sm font-bold text-slate-900 text-right">
                                Total Estimate
                              </td>
                              <td className="px-4 py-3 text-lg font-bold text-blue-900 text-right">
                                ₹{(editingService.totalAmount || 0).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  {/* Payment Info */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 overflow-hidden">
                    <h3 className="text-sm font-bold text-green-900 p-4 bg-green-100 border-b-2 border-green-200 uppercase tracking-wide">
                      Payment Information
                    </h3>
                    <div className="p-5 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Total Amount</p>
                          <p className="text-2xl font-bold text-slate-900">
                            ₹{(editingService.totalAmount || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                          <p className="text-xs text-green-700 mb-1 font-medium">Paid Amount</p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{(editingService.paidAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-xl p-4">
                        <p className="text-xs text-amber-800 mb-1 font-bold">Remaining Balance</p>
                        <p className="text-3xl font-bold text-amber-900">
                          ₹{((editingService.totalAmount || 0) - (editingService.paidAmount || 0)).toFixed(2)}
                        </p>
                      </div>

                      {/* Payment Progress */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-2 font-medium">
                          <span>Payment Progress</span>
                          <span className="font-bold">
                            {(editingService.totalAmount || 0) > 0
                              ? (((editingService.paidAmount || 0) / (editingService.totalAmount || 1)) * 100).toFixed(0)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden border-2 border-slate-300">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                (editingService.totalAmount || 0) > 0
                                  ? ((editingService.paidAmount || 0) / (editingService.totalAmount || 1)) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Record Payment */}
                      {((editingService.totalAmount || 0) - (editingService.paidAmount || 0)) > 0 && (
                        <div className="pt-4 border-t-2 border-green-200">
                          <p className="text-xs text-slate-600 mb-2 font-bold">Record Payment</p>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold text-lg">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="0.00"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSavePayment()}
                                step="0.01"
                                min="0"
                                max={(editingService.totalAmount || 0) - (editingService.paidAmount || 0)}
                                className="w-full pl-8 pr-3 py-3 border-2 border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                            <button
                              onClick={handleSavePayment}
                              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quotation Note */}
                  {editingService.quotationNote && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden">
                      <h3 className="text-sm font-bold text-slate-700 p-4 bg-slate-100 border-b-2 border-slate-200 uppercase tracking-wide">
                        Quotation Note
                      </h3>
                      <div className="p-5">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {editingService.quotationNote}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t-2 border-slate-200">
                <button
                  onClick={() => handleSendWhatsApp(editingService)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send WhatsApp
                </button>

                {client?.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Mail className="w-6 h-6" />
                    Send Email
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-white border-2 border-slate-300 p-4 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;