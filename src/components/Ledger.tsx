import React, { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Eye,
  CreditCard,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Percent,
  BadgeIndianRupee,
  BarChart3,
  Receipt,
  FileSpreadsheet,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react'

// TYPES
export type EMISchedule = {
  installmentNumber: number
  dueDate: string
  amount: number
  principalAmount: number
  interestAmount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  paidDate?: string
}

export type LedgerEntry = {
  id: number
  workflowTitle: string
  vehicle: string
  client: string
  completedDate: string
  completedBy: string
  
  baseAmount: number
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  finalAmount: number
  
  paymentType: 'Full' | 'EMI'
  paymentStatus: 'Paid' | 'Due' | 'Partial'
  paymentMethod: string
  paidAmount: number
  
  emiTenure?: number
  emiInterestRate?: number
  emiMonthlyAmount?: number
  emiSchedule?: EMISchedule[]
  
  invoiceNumber: string
  documents: string[]
  notes: string
}

// Helper function to calculate EMI
const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 12 / 100
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
               (Math.pow(1 + monthlyRate, tenure) - 1)
  return Math.round(emi)
}

// Helper to generate EMI schedule
const generateEMISchedule = (
  principal: number,
  rate: number,
  tenure: number,
  startDate: string
): EMISchedule[] => {
  const schedule: EMISchedule[] = []
  const monthlyRate = rate / 12 / 100
  const emiAmount = calculateEMI(principal, rate, tenure)
  let balance = principal
  
  for (let i = 1; i <= tenure; i++) {
    const interestAmount = Math.round(balance * monthlyRate)
    const principalAmount = emiAmount - interestAmount
    balance -= principalAmount
    
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + i)
    
    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: emiAmount,
      principalAmount,
      interestAmount,
      status: i === 1 ? 'Paid' : i === 2 ? 'Pending' : 'Pending',
      paidDate: i === 1 ? startDate : undefined,
    })
  }
  
  return schedule
}

const INITIAL_LEDGER_DATA: LedgerEntry[] = [
  {
    id: 1,
    workflowTitle: 'Vehicle Registration',
    vehicle: 'Toyota Camry • ABC123',
    client: 'John Doe',
    completedDate: '2024-11-10',
    completedBy: 'Admin User',
    baseAmount: 6000,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 600,
    taxRate: 18,
    taxAmount: 972,
    finalAmount: 6372,
    paymentType: 'Full',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paidAmount: 6372,
    invoiceNumber: 'INV-2024-001',
    documents: ['RC Copy', 'Payment Receipt'],
    notes: '10% early bird discount applied',
  },
  {
    id: 2,
    workflowTitle: 'Insurance Claim Processing',
    vehicle: 'Honda CR-V • XYZ789',
    client: 'Jane Smith',
    completedDate: '2024-11-08',
    completedBy: 'Admin User',
    baseAmount: 15000,
    discountType: 'fixed',
    discountValue: 1000,
    discountAmount: 1000,
    taxRate: 18,
    taxAmount: 2520,
    finalAmount: 16520,
    paymentType: 'EMI',
    paymentStatus: 'Partial',
    paymentMethod: 'EMI',
    paidAmount: 5506,
    emiTenure: 3,
    emiInterestRate: 12,
    emiMonthlyAmount: 5506,
    emiSchedule: generateEMISchedule(16520, 12, 3, '2024-11-08'),
    invoiceNumber: 'INV-2024-002',
    documents: ['Insurance Policy', 'Claim Form'],
    notes: 'EMI: 3 months @ 12% interest',
  },
  {
    id: 3,
    workflowTitle: 'PUC Certificate',
    vehicle: 'BMW X5 • BMW456',
    client: 'Mike Johnson',
    completedDate: '2024-11-01',
    completedBy: 'Support Team',
    baseAmount: 800,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 144,
    finalAmount: 944,
    paymentType: 'Full',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    paidAmount: 944,
    invoiceNumber: 'INV-2024-003',
    documents: ['PUC Certificate'],
    notes: 'No discount',
  },
  {
    id: 4,
    workflowTitle: 'Ownership Transfer',
    vehicle: 'Audi A6 • AUD789',
    client: 'Emily Davis',
    completedDate: '2024-11-09',
    completedBy: 'Admin User',
    baseAmount: 10000,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 500,
    taxRate: 18,
    taxAmount: 1710,
    finalAmount: 11210,
    paymentType: 'EMI',
    paymentStatus: 'Partial',
    paymentMethod: 'EMI',
    paidAmount: 2336,
    emiTenure: 5,
    emiInterestRate: 10,
    emiMonthlyAmount: 2336,
    emiSchedule: generateEMISchedule(11210, 10, 5, '2024-11-09'),
    invoiceNumber: 'INV-2024-004',
    documents: ['Transfer Documents', 'NOC'],
    notes: '5% loyalty discount, EMI: 5 months @ 10%',
  },
  {
    id: 5,
    workflowTitle: 'Service Package',
    vehicle: 'Mercedes C-Class • MER321',
    client: 'Robert Brown',
    completedDate: '2024-10-28',
    completedBy: 'Support Team',
    baseAmount: 1800,
    discountType: 'fixed',
    discountValue: 300,
    discountAmount: 300,
    taxRate: 18,
    taxAmount: 270,
    finalAmount: 1770,
    paymentType: 'Full',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    paidAmount: 1770,
    invoiceNumber: 'INV-2024-005',
    documents: ['Service Report'],
    notes: 'Festival offer ₹300 flat discount',
  },
  {
    id: 6,
    workflowTitle: 'Vehicle Inspection',
    vehicle: 'Maruti Swift • MRU123',
    client: 'Sarah Wilson',
    completedDate: '2024-11-12',
    completedBy: 'Support Team',
    baseAmount: 2500,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 450,
    finalAmount: 2950,
    paymentType: 'Full',
    paymentStatus: 'Due',
    paymentMethod: 'Pending',
    paidAmount: 0,
    invoiceNumber: 'INV-2024-006',
    documents: ['Inspection Report'],
    notes: 'Payment pending',
  },
]

const Ledger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'analytics'>('summary')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<'All' | LedgerEntry['paymentStatus']>('All')
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)
  const [ledgerData] = useState<LedgerEntry[]>(INITIAL_LEDGER_DATA)

  const filteredData = useMemo(() => {
    return ledgerData.filter(entry => {
      const matchesSearch = [
        entry.workflowTitle,
        entry.vehicle,
        entry.client,
        entry.invoiceNumber,
      ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesPayment = paymentFilter === 'All' || entry.paymentStatus === paymentFilter
      
      return matchesSearch && matchesPayment
    })
  }, [ledgerData, searchQuery, paymentFilter])

  // COMPREHENSIVE FINANCIAL CALCULATIONS
  const financials = useMemo(() => {
    const baseRevenue = filteredData.reduce((sum, e) => sum + e.baseAmount, 0)
    const totalDiscounts = filteredData.reduce((sum, e) => sum + e.discountAmount, 0)
    const netRevenue = baseRevenue - totalDiscounts
    const totalTax = filteredData.reduce((sum, e) => sum + e.taxAmount, 0)
    const grossRevenue = netRevenue + totalTax
    
    const totalReceived = filteredData.reduce((sum, e) => sum + e.paidAmount, 0)
    const totalDue = filteredData.reduce((sum, e) => sum + (e.finalAmount - e.paidAmount), 0)
    
    // EMI specific calculations
    const emiEntries = filteredData.filter(e => e.paymentType === 'EMI')
    const totalEMIInterest = emiEntries.reduce((sum, e) => {
      if (e.emiSchedule) {
        return sum + e.emiSchedule.reduce((s, emi) => s + emi.interestAmount, 0)
      }
      return sum
    }, 0)
    
    const emiPrincipalOutstanding = emiEntries.reduce((sum, e) => {
      if (e.emiSchedule) {
        const unpaidEMIs = e.emiSchedule.filter(emi => emi.status !== 'Paid')
        return sum + unpaidEMIs.reduce((s, emi) => s + emi.principalAmount, 0)
      }
      return sum
    }, 0)
    
    const emiInterestOutstanding = emiEntries.reduce((sum, e) => {
      if (e.emiSchedule) {
        const unpaidEMIs = e.emiSchedule.filter(emi => emi.status !== 'Paid')
        return sum + unpaidEMIs.reduce((s, emi) => s + emi.interestAmount, 0)
      }
      return sum
    }, 0)
    
    const emiInterestReceived = emiEntries.reduce((sum, e) => {
      if (e.emiSchedule) {
        const paidEMIs = e.emiSchedule.filter(emi => emi.status === 'Paid')
        return sum + paidEMIs.reduce((s, emi) => s + emi.interestAmount, 0)
      }
      return sum
    }, 0)
    
    return {
      // Revenue
      baseRevenue,
      totalDiscounts,
      netRevenue,
      totalTax,
      grossRevenue,
      
      // Receivables
      totalReceived,
      totalDue,
      
      // EMI
      totalEMIInterest,
      emiPrincipalOutstanding,
      emiInterestOutstanding,
      emiInterestReceived,
      
      // Counts
      totalTransactions: filteredData.length,
      paidCount: filteredData.filter(e => e.paymentStatus === 'Paid').length,
      dueCount: filteredData.filter(e => e.paymentStatus === 'Due').length,
      partialCount: filteredData.filter(e => e.paymentStatus === 'Partial').length,
      emiCount: emiEntries.length,
      fullPaymentCount: filteredData.filter(e => e.paymentType === 'Full').length,
    }
  }, [filteredData])

  const PaymentBadge: React.FC<{ status: LedgerEntry['paymentStatus'] }> = ({ status }) => {
    const colors = {
      Paid: 'bg-green-100 text-green-700',
      Due: 'bg-yellow-100 text-yellow-700',
      Partial: 'bg-orange-100 text-orange-700',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    )
  }

  const handleViewDetails = (entry: LedgerEntry) => {
    setSelectedEntry(entry)
    setActiveTab('details')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-3">
      <div className="max-w-7xl mx-auto">
        {/* TABS */}
        <div className=" p-1 mb-4 flex gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'bg-gray-200 text-gray-700 hover:text-blue-500'
            }`}
          >
            {/* <Receipt className="w-4 h-4" /> */}
            Invoice Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-not-allowed pointer-events-none duration-200 ${
              activeTab === 'details'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'bg-gray-200 text-gray-700 hover:text-blue-500'
            }`}
          >
            {/* <FileText className="w-4 h-4" /> */}
            Details
          </button>
          {/* <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'bg-gray-200 text-gray-700 hover:text-blue-500'
            }`} */}
          {/* > */}
            {/* <BarChart3 className="w-4 h-4" /> */}
            {/* Balance Sheet & Analytics
          </button> */}
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'summary' && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-600">
                <p className="text-xs text-gray-600">Gross Revenue</p>
                <p className="text-lg font-bold text-gray-900">₹{financials.grossRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-600">
                <p className="text-xs text-gray-600">Received</p>
                <p className="text-lg font-bold text-green-600">₹{financials.totalReceived.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-yellow-600">
                <p className="text-xs text-gray-600">Outstanding</p>
                <p className="text-lg font-bold text-yellow-600">₹{financials.totalDue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-purple-600">
                <p className="text-xs text-gray-600">Discounts</p>
                <p className="text-lg font-bold text-purple-600">₹{financials.totalDiscounts.toLocaleString()}</p>
              </div>
            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  {['All', 'Paid', 'Due', 'Partial'].map(status => (
                    <button
                      key={status}
                      onClick={() => setPaymentFilter(status as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        paymentFilter === status
                          ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 shadow-sm border border-gray-200 rounded-lg hover:bg-blue-700 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {filteredData.length} of {ledgerData.length} entries
              </p>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Base</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-blue-600">{entry.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">{entry.completedDate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{entry.workflowTitle}</div>
                          <div className="text-xs text-gray-500">{entry.client}</div>
                          {entry.paymentType === 'EMI' && (
                            <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-1">
                              <CreditCard className="w-3 h-3" />
                              EMI
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-900">₹{entry.baseAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          {entry.discountAmount > 0 ? (
                            <div className="flex items-center gap-1">
                              <TrendingDown className="w-3 h-3 text-green-600" />
                              <span className="text-sm font-medium text-green-600">₹{entry.discountAmount}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-gray-900">₹{entry.finalAmount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">+₹{entry.taxAmount} tax</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-green-600">₹{entry.paidAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          <PaymentBadge status={entry.paymentStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDetails(entry)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 shadow-sm border border-gray-200 rounded hover:bg-blue-700 hover:text-white xs font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'details' && selectedEntry && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setActiveTab('summary')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Summary
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEntry.workflowTitle}</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedEntry.invoiceNumber} • {selectedEntry.completedDate}</p>
            </div>

            {/* PRICING BREAKDOWN */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <BadgeIndianRupee className="w-4 h-4" />
                Financial Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Base Amount:</span>
                  <span className="font-semibold text-blue-900">₹{selectedEntry.baseAmount.toLocaleString()}</span>
                </div>
                {selectedEntry.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      Discount ({selectedEntry.discountType === 'percentage' 
                        ? `${selectedEntry.discountValue}%` 
                        : `₹${selectedEntry.discountValue}`}):
                    </span>
                    <span className="font-semibold text-green-700">-₹{selectedEntry.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Subtotal:</span>
                  <span className="font-semibold text-blue-900">₹{(selectedEntry.baseAmount - selectedEntry.discountAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Tax ({selectedEntry.taxRate}%):</span>
                  <span className="font-semibold text-blue-900">+₹{selectedEntry.taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-300 pt-2 flex justify-between">
                  <span className="font-bold text-blue-900">Final Amount:</span>
                  <span className="font-bold text-xl text-blue-900">₹{selectedEntry.finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT STATUS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-green-700 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Amount Paid
                </p>
                <p className="text-2xl font-bold text-green-700">₹{selectedEntry.paidAmount.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  {selectedEntry.paymentType === 'EMI' ? (
                    <>
                      <CreditCard className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">{selectedEntry.paymentMethod}</span>
                    </>
                  ) : (
                    <span className="text-xs text-green-600">{selectedEntry.paymentMethod}</span>
                  )}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-xs text-yellow-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Balance Due
                </p>
                <p className="text-2xl font-bold text-yellow-700">
                  ₹{(selectedEntry.finalAmount - selectedEntry.paidAmount).toLocaleString()}
                </p>
                <div className="mt-2">
                  <PaymentBadge status={selectedEntry.paymentStatus} />
                </div>
              </div>
            </div>

            {/* EMI SCHEDULE */}
            {selectedEntry.paymentType === 'EMI' && selectedEntry.emiSchedule && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  EMI Payment Schedule - {selectedEntry.emiTenure} months @ {selectedEntry.emiInterestRate}% p.a.
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto">
                  {selectedEntry.emiSchedule.map(emi => (
                    <div
                      key={emi.installmentNumber}
                      className={`flex items-center justify-between p-3 rounded ${
                        emi.status === 'Paid'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            emi.status === 'Paid'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {emi.status === 'Paid' ? '✓' : emi.installmentNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Installment #{emi.installmentNumber}</p>
                          <p className="text-xs text-gray-500">Due: {emi.dueDate}</p>
                          {emi.paidDate && <p className="text-xs text-green-600">Paid: {emi.paidDate}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{emi.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Principal: ₹{emi.principalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Interest: ₹{emi.interestAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div className="text-xs text-purple-800">
                      <p className="font-semibold mb-1">EMI Summary</p>
                      <div className="grid grid-cols-2 gap-2">
                        <p>Monthly Payment: ₹{selectedEntry.emiMonthlyAmount?.toLocaleString()}</p>
                        <p>Total Interest: ₹{selectedEntry.emiSchedule.reduce((sum, e) => sum + e.interestAmount, 0).toLocaleString()}</p>
                        <p>Remaining Installments: {selectedEntry.emiSchedule.filter(e => e.status !== 'Paid').length}</p>
                        <p>Paid Installments: {selectedEntry.emiSchedule.filter(e => e.status === 'Paid').length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLIENT & VEHICLE INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Client Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Client Name</label>
                    <p className="text-sm font-medium text-gray-900">{selectedEntry.client}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Vehicle</label>
                    <p className="text-sm font-medium text-gray-900">{selectedEntry.vehicle}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Transaction Details</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Completed By</label>
                    <p className="text-sm font-medium text-gray-900">{selectedEntry.completedBy}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Payment Method</label>
                    <p className="text-sm font-medium text-gray-900">{selectedEntry.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DOCUMENTS */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-2">
                <FileText className="w-3 h-3" />
                Attached Documents
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.documents.map((doc, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* NOTES */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Notes</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900">{selectedEntry.notes}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('summary')}
                className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-3 text-sm bg-white text-blue-600 shadow-sm border border-gray-200 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>
        )}

        {/* {activeTab === 'analytics' && (
          <div className="space-y-6"> */}
            {/* BALANCE SHEET */}

            {/* TRANSACTION ANALYTICS */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">Paid Invoices</h3>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{financials.paidCount}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {((financials.paidCount / financials.totalTransactions) * 100).toFixed(0)}% of total
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">Due Invoices</h3>
                  <Calendar className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{financials.dueCount}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {((financials.dueCount / financials.totalTransactions) * 100).toFixed(0)}% of total
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">Partial Payments</h3>
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{financials.partialCount}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {((financials.partialCount / financials.totalTransactions) * 100).toFixed(0)}% of total
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">EMI Plans</h3>
                  <CreditCard className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{financials.emiCount}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {((financials.emiCount / financials.totalTransactions) * 100).toFixed(0)}% of total
                </p>
              </div>
            </div> */}

            {/* PAYMENT METHOD BREAKDOWN */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Payment Method Distribution
              </h3>
              <div className="space-y-3">
                {['UPI', 'Cash', 'Card', 'EMI', 'Bank Transfer', 'Pending'].map(method => {
                  const count = filteredData.filter(e => e.paymentMethod === method).length
                  const amount = filteredData
                    .filter(e => e.paymentMethod === method)
                    .reduce((sum, e) => sum + e.paidAmount, 0)
                  const percentage = (count / filteredData.length) * 100
                  
                  if (count === 0) return null
                  
                  return (
                    <div key={method}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{method}</span>
                        <span className="text-gray-900">
                          {count} transactions • ₹{amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div> */}

            {/* DISCOUNT ANALYSIS */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Discount Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-purple-700 mb-1">Total Discounts Given</p>
                  <p className="text-2xl font-bold text-purple-900">₹{financials.totalDiscounts.toLocaleString()}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {((financials.totalDiscounts / financials.baseRevenue) * 100).toFixed(1)}% of base revenue
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Invoices with Discount</p>
                  <p className="text-2xl font-bold text-green-900">
                    {filteredData.filter(e => e.discountAmount > 0).length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {((filteredData.filter(e => e.discountAmount > 0).length / filteredData.length) * 100).toFixed(0)}% of transactions
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Avg Discount Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{Math.round(financials.totalDiscounts / filteredData.filter(e => e.discountAmount > 0).length || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Per discounted invoice</p>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default Ledger