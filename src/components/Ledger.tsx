import React, { useState } from 'react'
import {
  Search,
  Download,
  Calendar,
  BadgeIndianRupee ,
  CheckCircle,
  FileText,
  Eye,
} from 'lucide-react'

// TYPES
export type LedgerEntry = {
  id: number
  workflowTitle: string
  vehicle: string
  client: string
  completedDate: string
  completedBy: string
  amount: number
  paymentStatus: 'Paid' | 'Pending' | 'Partial'
  paymentMethod: string
  invoiceNumber: string
  documents: string[]
  notes: string
}

// GENERIC DATATABLE
type DataTableProps<T> = {
  columns: string[]
  data: T[]
  renderRow: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
}

const DataTable = <T,>({
  columns,
  data,
  renderRow,
  emptyMessage = 'No records found',
}: DataTableProps<T>) => {
  if (!data?.length)
    return <p className="text-center text-gray-500 mt-6">{emptyMessage}</p>

  return (
    <div className="bg-white rounded-lg border border-gray-400 mt-2 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => renderRow(row, i))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// CONSTANTS
const PAYMENT_STATUS_COLORS: Record<LedgerEntry['paymentStatus'], string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Partial: 'bg-orange-100 text-orange-700',
}

const INITIAL_LEDGER_DATA: LedgerEntry[] = [
  {
    id: 1,
    workflowTitle: 'Vehicle Registration',
    vehicle: 'Toyota Camry • ABC123',
    client: 'John Doe',
    completedDate: '2024-11-10',
    completedBy: 'Admin User',
    amount: 5000,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2024-001',
    documents: ['RC Copy', 'Payment Receipt'],
    notes: 'Registration completed successfully',
  },
  {
    id: 2,
    workflowTitle: 'Insurance Claim',
    vehicle: 'Honda CR-V • XYZ789',
    client: 'Jane Smith',
    completedDate: '2024-11-08',
    completedBy: 'Admin User',
    amount: 12000,
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2024-002',
    documents: ['Insurance Policy', 'Claim Form'],
    notes: 'Claim processed, awaiting payment',
  },
  {
    id: 3,
    workflowTitle: 'PUC Certificate',
    vehicle: 'BMW X5 • BMW456',
    client: 'Mike Johnson',
    completedDate: '2024-11-01',
    completedBy: 'Support Team',
    amount: 800,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    invoiceNumber: 'INV-2024-003',
    documents: ['PUC Certificate'],
    notes: 'Certificate issued',
  },
  {
    id: 4,
    workflowTitle: 'Ownership Transfer',
    vehicle: 'Audi A6 • AUD789',
    client: 'Emily Davis',
    completedDate: '2024-11-09',
    completedBy: 'Admin User',
    amount: 8500,
    paymentStatus: 'Partial',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2024-004',
    documents: ['Transfer Documents', 'NOC'],
    notes: 'Partial payment received (5000/8500)',
  },
  {
    id: 5,
    workflowTitle: 'Service Reminder',
    vehicle: 'Mercedes C-Class • MER321',
    client: 'Robert Brown',
    completedDate: '2024-10-28',
    completedBy: 'Support Team',
    amount: 1500,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    invoiceNumber: 'INV-2024-005',
    documents: ['Service Report'],
    notes: 'Annual service completed',
  },
]

const Ledger: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<
    'All' | LedgerEntry['paymentStatus']
  >('All')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [ledgerData] = useState<LedgerEntry[]>(INITIAL_LEDGER_DATA)

  const filteredData = ledgerData.filter(entry => {
    const matchesSearch = [entry.workflowTitle, entry.vehicle, entry.client, entry.invoiceNumber].some(field =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesPayment = paymentFilter === 'All' || entry.paymentStatus === paymentFilter
    const matchesDate =
      (!dateRange.from || entry.completedDate >= dateRange.from) &&
      (!dateRange.to || entry.completedDate <= dateRange.to)
    return matchesSearch && matchesPayment && matchesDate
  })

  const totalAmount = filteredData.reduce((sum, entry) => sum + entry.amount, 0)
  const paidAmount = filteredData
    .filter(e => e.paymentStatus === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0)
  const pendingAmount = filteredData
    .filter(e => e.paymentStatus === 'Pending')
    .reduce((sum, e) => sum + e.amount, 0)

  const PaymentBadge: React.FC<{ status: LedgerEntry['paymentStatus'] }> = ({
    status,
  }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total Amount
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <BadgeIndianRupee  className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{paidAmount.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{pendingAmount.toLocaleString()}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by workflow, client, invoice..."
                  value={searchQuery}
                  onChange={e => setSearcезультaty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['All', 'Paid', 'Pending', 'Partial'].map(status => (
                  <button
                    key={status}
                    onClick={() =>
                      setPaymentFilter(status as 'All' | LedgerEntry['paymentStatus'])
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                      paymentFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={e =>
                    setDateRange(prev => ({ ...prev, from: e.target.value }))
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={e =>
                    setDateRange(prev => ({ ...prev, to: e.target.value }))
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredData.length} of {ledgerData.length} entries
          </div>
        </div>

        {/* TABLE */}
        <DataTable
          columns={[
            'Invoice',
            'Workflow',
            'Client',
            'Vehicle',
            'Date',
            'Amount',
            'Payment Status',
            'Method',
            'Actions',
          ]}
          data={filteredData}
          renderRow={(entry: LedgerEntry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-blue-600">
                  {entry.invoiceNumber}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {entry.workflowTitle}
                </div>
                <div className="text-xs text-gray-500">
                  By: {entry.completedBy}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{entry.client}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{entry.vehicle}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {entry.completedDate}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-gray-900">
                  ₹{entry.amount.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <PaymentBadge status={entry.paymentStatus} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {entry.paymentMethod}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => {
                    setSelectedEntry(entry)
                    setShowDetailModal(true)
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
              </td>
            </tr>
          )}
        />

        {/* PAGINATION STATIC */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-600">
            {filteredData.length} of {ledgerData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                3
              </button>
            </div>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEntry.workflowTitle}
                </h2>
                <p className="text-sm text-gray-600">
                  Invoice: {selectedEntry.invoiceNumber}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FileText className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Client</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEntry.client}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Vehicle</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEntry.vehicle}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Completed Date</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEntry.completedDate}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Completed By</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEntry.completedBy}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Amount</label>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{selectedEntry.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Payment Status</label>
                  <div className="mt-1">
                    <PaymentBadge status={selectedEntry.paymentStatus} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Payment Method</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEntry.paymentMethod}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Invoice Number</label>
                  <p className="text-sm font-medium text-blue-600">
                    {selectedEntry.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500">Documents</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEntry.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500">Notes</label>
                <p className="text-sm text-gray-900 mt-1">{selectedEntry.notes}</p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ledger
