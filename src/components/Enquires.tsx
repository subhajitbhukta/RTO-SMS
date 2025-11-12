import React, { useState, FC } from "react"
import EnquireManagement from "./EnquireManagement"
import Evaluation from "./Evaluation"
import Estimation from "./Estimation"

type TabOption = "enquires" | "evaluation" | "estimation"

interface Option {
  id: string
  label: string
}

interface Document {
  id: string
  name: string
  file?: File | null
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
  documents: Document[]
  createdAt: string
  status: 'pending' | 'in-progress' | 'completed'
  estimates?: ServiceEstimate[]
  notes?: string
}

const Enquires: FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("enquires")
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: '1001',
      services: [
        { id: '1', label: 'Oil Change' },
        { id: '2', label: 'Tire Rotation' }
      ],
      client: { id: '1', label: 'John Doe' },
      vehicle: { id: '1', label: 'Toyota Camry - ABC123' },
      documents: [],
      createdAt: '2024-11-01',
      status: 'pending'
    },
    {
      id: '1002',
      services: [
        { id: '3', label: 'Brake Service' },
        { id: '5', label: 'AC Service' }
      ],
      client: { id: '2', label: 'Jane Smith' },
      vehicle: { id: '2', label: 'Honda Civic - XYZ789' },
      documents: [],
      createdAt: '2024-11-05',
      status: 'pending'
    },
    {
      id: '1003',
      services: [{ id: '4', label: 'Engine Repair' }],
      client: { id: '3', label: 'Mike Johnson' },
      vehicle: { id: '3', label: 'Ford F-150 - DEF456' },
      documents: [],
      createdAt: '2024-11-08',
      status: 'pending'
    }
  ])
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null)

  const handleEdit = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry)
    setActiveTab('enquires')
  }

  const handleCreateService = (enquiry: Enquiry, documents: Document[]) => {
    console.log('Creating service for enquiry:', enquiry)
    console.log('With documents:', documents)
    
    setEnquiries(prev => prev.map(e => 
      e.id === enquiry.id 
        ? { ...e, status: 'completed', documents } 
        : e
    ))
    
    setActiveTab('estimation')
  }

  const handleDiscard = (enquiry: Enquiry) => {
    if (window.confirm(`Are you sure you want to discard enquiry #${enquiry.id}?`)) {
      setEnquiries(prev => prev.filter(e => e.id !== enquiry.id))
    }
  }

  const handleAddNote = (enquiry: Enquiry, note: string) => {
    setEnquiries(prev => prev.map(e => 
      e.id === enquiry.id ? { ...e, notes: note } : e
    ))
  }

  const handleSaveEstimates = (enquiryId: string, estimates: ServiceEstimate[]) => {
    setEnquiries(prev => prev.map(e => 
      e.id === enquiryId ? { ...e, estimates } : e
    ))
  }

  const handleSaveComplete = (enquiryData: Enquiry, isEdit: boolean) => {
    if (isEdit) {
      setEnquiries(prev => prev.map(e => e.id === enquiryData.id ? enquiryData : e))
    } else {
      setEnquiries(prev => [...prev, enquiryData])
    }
    setTimeout(() => {
      setActiveTab('evaluation')
      setEditingEnquiry(null)
    }, 1500)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "evaluation":
        return (
          <Evaluation
            enquiries={enquiries}
            onEdit={handleEdit}
            onCreateService={handleCreateService}
            onDiscard={handleDiscard}
            onAddNote={handleAddNote}
          />
        )
      case "estimation":
        return (
          <Estimation
            enquiries={enquiries.filter(e => e.status === 'completed')}
            onSaveEstimates={handleSaveEstimates}
          />
        )
      default:
        return (
          <EnquireManagement
            editMode={!!editingEnquiry}
            editData={editingEnquiry}
            onSaveComplete={handleSaveComplete}
          />
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg w-fit">
          {[
            { id: "enquires", label: "Enquires" },
            { id: "evaluation", label: "Evaluation" },
            { id: "estimation", label: "Estimation" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabOption)
                if (tab.id === 'enquires') setEditingEnquiry(null)
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "bg-gray-200 text-gray-700 hover:text-blue-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">{renderContent()}</div>
    </div>
  )
}

export default Enquires