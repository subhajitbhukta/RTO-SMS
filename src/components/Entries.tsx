import React, { useState, FC } from "react"
import AddClientForm from "./AddClientForm"
import AddVehicleForm from "./AddVehicleForm"

type TabOption = "client" | "vehicle"

const Entries: FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("client")

  const renderContent = (): React.ReactElement => {
    switch (activeTab) {
      case "vehicle":
        return (
          <div className="p-4">
            <AddVehicleForm />
          </div>
        )
      default:
        return (
          <div className="p-4">
            <AddClientForm />
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Tabs Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg w-fit">
          {[
            { id: "client", label: "Add Client" },
            { id: "vehicle", label: "Add Vehicle" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabOption)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${
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

      {/* Tab Content */}
      <div className="p-4">{renderContent()}</div>
    </div>
  )
}

export default Entries
