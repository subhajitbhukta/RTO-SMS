import React from "react"
import { Mail, Phone, CheckCircle, Clock, AlertTriangle } from "lucide-react"

type Renewal = {
  id: number
  title: string
  vehicle: string
  client: string
  nextDue: string
  cost: number
  status: "Completed" | "Upcoming" | "Overdue"
  documents: string[]
}

const data: Renewal[] = [
  {
    id: 1,
    title: "PUC Renewal",
    vehicle: "Toyota Camry • ABC123",
    client: "John Doe",
    nextDue: "2026-03-15",
    cost: 150,
    status: "Upcoming",
    documents: ["puc-certificate.pdf"],
  },
  {
    id: 2,
    title: "Insurance Renewal",
    vehicle: "Honda CR-V • XYZ789",
    client: "John Doe",
    nextDue: "2026-10-01",
    cost: 12000,
    status: "Upcoming",
    documents: ["policy2025.pdf"],
  },
]

const statusChip: Record<Renewal["status"], { bg: string; text: string; icon: any }> = {
  Completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  Upcoming: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  Overdue: { bg: "bg-red-100", text: "text-red-700", icon: AlertTriangle },
}

function daysInfo(dateStr: string) {
  const today = new Date()
  const date = new Date(dateStr)
  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff > 0) return `${diff} days left`
  if (diff === 0) return "Due today"
  return `${Math.abs(diff)} days overdue`
}

const Renewals = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Renewals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((item) => {
          const s = statusChip[item.status]
          const StatusIcon = s.icon

          return (
            <div key={item.id} className="bg-white  rounded-xl shadow-2xl p-5">
              {/* top */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${s.bg} ${s.text}`}>
                  <StatusIcon size={14} /> {item.status}
                </span>
              </div>

              <p className="mt-1 text-gray-700">{item.vehicle}</p>
              <p className="text-gray-500 text-sm">{item.client}</p>

              {/* details */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="border rounded-md p-3 bg-gray-50">
                  <p className="text-xs text-gray-500">Next Due</p>
                  <p className="font-semibold">{item.nextDue}</p>
                  <p className="text-xs mt-1 text-green-600">{daysInfo(item.nextDue)}</p>
                </div>

                <div className="border rounded-md p-3 bg-gray-50">
                  <p className="text-xs text-gray-500">Cost</p>
                  <p className="font-semibold">${item.cost}</p>
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-3 mb-3">
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex-1">
                  <Mail size={16} /> Email
                </button>
                <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm flex-1">
                  <Phone size={16} /> WhatsApp
                </button>
              </div>

              {/* docs */}
              <p className="text-sm text-gray-600">📄 Documents</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {item.documents.map((d) => (
                  <span key={d} className="text-xs bg-gray-100 border px-2 py-1 rounded-md">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Renewals
