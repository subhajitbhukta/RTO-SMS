import { useState } from "react"
import { Car, Calendar } from "lucide-react"
import ViewToggle from "./shared/ViewToggle"
import CardGrid from "./shared/CardGrid"
import DataTable from "./shared/DataTable"
import BookNowModal from "./BookNowModal.tsx"

interface VehiclesProps {
  vehicles: any[]
  clients: any[]
  services: any[]
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, clients, services }) => {
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleBookNow = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleSubmitBooking = (bookingData: any) => {
    console.log("New Booking:", bookingData)
    // POST to backend later
  }

  const renderCard = (vehicle: any) => {
    const client = clients.find((c) => c.id === vehicle.clientId)
    const vehicleServices = services.filter((s) => s.vehicleId === vehicle.id)

    return (
      <div key={vehicle.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Car className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{vehicle.model}</h3>
              <p className="text-gray-600 text-sm">{vehicle.plate}</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Owner</span>
            <span className="font-medium text-gray-800">{client?.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Year: {vehicle.year}</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
              {vehicleServices.length} Services
            </span>
          </div>
          <button
            onClick={() => handleBookNow(vehicle)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Book Now
          </button>
        </div>
      </div>
    )
  }

  const columns = ["Vehicle", "Plate", "Owner", "Year", "Services", "Action"]

  const renderRow = (vehicle: any) => {
    const client = clients.find((c) => c.id === vehicle.clientId)
    const vehicleServices = services.filter((s) => s.vehicleId === vehicle.id)

    return (
      <tr key={vehicle.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="text-blue-600" size={20} />
          </div>
          <div className="font-medium text-gray-900">{vehicle.model}</div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">{vehicle.plate}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{client?.name}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{vehicle.year}</td>
        <td className="px-6 py-4">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
            {vehicleServices.length}
          </span>
        </td>
        <td className="px-6 py-4 text-sm">
          <button
            onClick={() => handleBookNow(vehicle)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Calendar size={16} />
            Book
          </button>
        </td>
      </tr>
    )
  }

  return (
    <div className="p-2">
      <div className="mb-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-row md:flex-row justify-between gap-4 items-center">
        <input
          type="text"
          placeholder="Search clients..."
          value={""}
          className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === "card" ? (
        <CardGrid items={vehicles} renderCard={renderCard} />
      ) : (
        <DataTable columns={columns} data={vehicles} renderRow={renderRow} />
      )}

      <BookNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitBooking}
        vehicle={selectedVehicle}
      />
    </div>
  )
}

export default Vehicles
