import React, { useState } from "react"
import { FileText, X, Edit2, DollarSign, Check, Save } from "lucide-react"

interface Option {
    id: string
    label: string
}

interface ServiceEstimate {
    serviceId: string
    serviceName: string
    price: number
}

interface Enquiry {
    id: string
    services: Option[]
    client: Option
    vehicle: Option | null
    createdAt: string
    status: string
    estimates?: ServiceEstimate[]
}

interface EstimationProps {
    enquiries: Enquiry[]
    onSaveEstimates: (enquiryId: string, estimates: ServiceEstimate[]) => void
}

const EstimateModal = ({ isOpen, onClose, enquiry, onSave }: any) => {
    const [estimates, setEstimates] = useState<ServiceEstimate[]>(
        enquiry?.estimates || enquiry?.services.map((s: Option) => ({
            serviceId: s.id,
            serviceName: s.label,
            price: 0
        })) || []
    )

    if (!isOpen) return null

    const handlePriceChange = (serviceId: string, price: string) => {
        const numPrice = parseFloat(price) || 0
        setEstimates(prev => prev.map(e =>
            e.serviceId === serviceId ? { ...e, price: numPrice } : e
        ))
    }

    const handleSave = () => {
        onSave(enquiry.id, estimates)
        onClose()
    }

    const total = estimates.reduce((sum, e) => sum + e.price, 0)

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Edit Estimation</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Enquiry #{enquiry.id} - {enquiry.client.label}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                        {estimates.map((estimate) => (
                            <div key={estimate.serviceId} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{estimate.serviceName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign size={18} className="text-slate-400" />
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={estimate.price || ''}
                                        onChange={(e) => handlePriceChange(estimate.serviceId, e.target.value)}
                                        placeholder="0.00"
                                        className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-right"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-800">Total</span>
                            <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md"
                    >
                        Save Estimates
                    </button>
                </div>
            </div>
        </div>
    )
}

const Estimation: React.FC<EstimationProps> = ({ enquiries, onSaveEstimates }) => {
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
    const [showEstimateModal, setShowEstimateModal] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [savedEnquiries, setSavedEnquiries] = useState<Set<string>>(new Set())

    const handleEditEstimate = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry)
        setShowEstimateModal(true)
    }

    const handleSaveEstimates = (enquiryId: string, estimates: ServiceEstimate[]) => {
        onSaveEstimates(enquiryId, estimates)
    }

    const handleSaveService = (enquiry: Enquiry) => {
        // Mark this enquiry as saved
        setSavedEnquiries(prev => new Set(prev).add(enquiry.id))

        // Show success message
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 3000)

        // Here you can add your API call to save the service
        console.log('Saving service for enquiry:', enquiry)
        console.log('Total amount:', enquiry.estimates?.reduce((sum, e) => sum + e.price, 0))
    }

    const isServiceSaved = (enquiryId: string) => savedEnquiries.has(enquiryId)

    return (
        <>
            <div className="space-y-6">
                {enquiries.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-slate-400" size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Completed Evaluations</h3>
                        <p className="text-slate-600">Complete an evaluation to create estimations</p>
                    </div>
                ) : (
                    enquiries.map((enquiry) => {
                        const total = enquiry.estimates?.reduce((sum, e) => sum + e.price, 0) || 0
                        const hasEstimates = enquiry.estimates && enquiry.estimates.length > 0 && enquiry.estimates.some(e => e.price > 0)

                        return (
                            <div key={enquiry.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">Enquiry #{enquiry.id}</h3>
                                            <p className="text-sm text-slate-600 mt-1">{enquiry.client.label}</p>
                                            {enquiry.vehicle && (
                                                <p className="text-sm text-slate-500 mt-1">{enquiry.vehicle.label}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleEditEstimate(enquiry)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-all shadow-sm border border-indigo-200"
                                        >
                                            <Edit2 size={16} />
                                            {hasEstimates ? 'Edit Prices' : 'Add Prices'}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {hasEstimates ? (
                                        <>
                                            <div className="space-y-3 mb-6">
                                                {enquiry.estimates?.map((estimate) => (
                                                    <div key={estimate.serviceId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                        <span className="text-sm font-medium text-slate-700">{estimate.serviceName}</span>
                                                        <span className="text-lg font-bold text-indigo-600">${estimate.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 mb-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-slate-800">Total Estimate</span>
                                                    <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {isServiceSaved(enquiry.id) ? (
                                                <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                                                    <Check className="text-emerald-600" size={20} />
                                                    <span className="text-emerald-700 font-semibold">Service Saved Successfully</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleSaveService(enquiry)}
                                                        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md flex items-center gap-2"
                                                    >
                                                        <Save size={18} />
                                                        Save Service
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <DollarSign className="mx-auto mb-3 text-slate-300" size={48} />
                                            <p className="text-slate-600 font-medium mb-2">No prices set yet</p>
                                            <p className="text-slate-500 text-sm mb-4">Click "Add Prices" to set service prices</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {showEstimateModal && selectedEnquiry && (
                <EstimateModal
                    isOpen={showEstimateModal}
                    onClose={() => setShowEstimateModal(false)}
                    enquiry={selectedEnquiry}
                    onSave={handleSaveEstimates}
                />
            )}

            {showSuccessToast && (
                <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl border border-emerald-200 p-4 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="text-emerald-600" size={18} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Service saved successfully!</p>
                    <button
                        onClick={() => setShowSuccessToast(false)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </>
    )
}

export default Estimation