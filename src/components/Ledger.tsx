import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Download,
  Eye,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Percent,
  BadgeIndianRupee,
  ArrowLeft,
} from 'lucide-react'

// Load jsPDF library
declare global {
  interface Window {
    jspdf: any;
  }
}

// TYPES
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
  paymentStatus: 'Paid' | 'Due' | 'Partial'
  paymentMethod: string
  paidAmount: number
  invoiceNumber: string
  documents: string[]
  notes: string
}

// SAMPLE DATA
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
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paidAmount: 6372,
    invoiceNumber: 'INV-2024-001',
    documents: ['Invoice Receipt'],
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
    paymentStatus: 'Partial',
    paymentMethod: 'Bank Transfer',
    paidAmount: 10000,
    invoiceNumber: 'INV-2024-002',
    documents: ['Insurance Policy', 'Claim Form'],
    notes: 'Partial payment received',
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
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    paidAmount: 11210,
    invoiceNumber: 'INV-2024-004',
    documents: ['Transfer Documents', 'NOC'],
    notes: '5% discount applied',
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
    paymentStatus: 'Due',
    paymentMethod: 'Pending',
    paidAmount: 0,
    invoiceNumber: 'INV-2024-006',
    documents: ['Inspection Report'],
    notes: 'Payment pending',
  },
]

// PDF Generation Function
// PDF Generation Function - Invoice
const generateInvoicePDF = (entry: LedgerEntry) => {
  if (!window.jspdf) {
    alert('PDF library is still loading. Please try again in a moment.')
    return
  }
  
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  
  // Header Background
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, 210, 40, 'F')
  
  // Company Header
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('VEHICLE SERVICES INC.', 105, 18, { align: 'center' })
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('123 Main Street, City, State 12345', 105, 26, { align: 'center' })
  doc.text('Phone: (123) 456-7890 | Email: info@vehicleservices.com', 105, 32, { align: 'center' })
  
  // Invoice Title
  doc.setFontSize(22)
  doc.setTextColor(37, 99, 235)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 20, 55)
  
  // Invoice Info Box
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(130, 48, 60, 22)
  
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Number:', 133, 54)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.invoiceNumber, 133, 59)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Date:', 133, 64)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.completedDate, 133, 69)
  
  // Bill To Section
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('BILL TO:', 20, 80)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text(entry.client, 20, 87)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(entry.vehicle, 20, 93)
  doc.text(`Completed By: ${entry.completedBy}`, 20, 99)
  
  // Service Description Box
  doc.setFillColor(245, 247, 250)
  doc.rect(20, 107, 170, 15, 'F')
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, 107, 170, 15)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text('SERVICE DESCRIPTION:', 23, 113)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.workflowTitle, 23, 119)
  
  // Financial Table
  let yPos = 135
  
  // Table Header
  doc.setFillColor(37, 99, 235)
  doc.rect(20, yPos - 7, 170, 8, 'F')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION', 23, yPos - 2)
  doc.text('AMOUNT', 160, yPos - 2)
  
  yPos += 5
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  
  // Base Amount
  doc.text('Base Amount', 23, yPos)
  doc.text(`₹${entry.baseAmount.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  doc.setDrawColor(230, 230, 230)
  doc.line(20, yPos + 2, 190, yPos + 2)
  yPos += 8
  
  // Discount
  if (entry.discountAmount > 0) {
    doc.setTextColor(34, 197, 94)
    const discountText = entry.discountType === 'percentage' 
      ? `Discount (${entry.discountValue}%)`
      : `Discount (Flat ₹${entry.discountValue})`
    doc.text(discountText, 23, yPos)
    doc.text(`-₹${entry.discountAmount.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
    doc.line(20, yPos + 2, 190, yPos + 2)
    yPos += 8
    doc.setTextColor(0, 0, 0)
  }
  
  // Subtotal
  const subtotal = entry.baseAmount - entry.discountAmount
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal', 23, yPos)
  doc.text(`₹${subtotal.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  doc.line(20, yPos + 2, 190, yPos + 2)
  yPos += 8
  
  // Tax
  doc.setFont('helvetica', 'normal')
  doc.text(`Tax (GST ${entry.taxRate}%)`, 23, yPos)
  doc.text(`₹${entry.taxAmount.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  doc.setLineWidth(0.8)
  doc.line(20, yPos + 2, 190, yPos + 2)
  yPos += 10
  
  // Total Amount - Highlighted
  doc.setFillColor(37, 99, 235)
  doc.rect(20, yPos - 5, 170, 10, 'F')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL AMOUNT', 23, yPos)
  doc.text(`₹${entry.finalAmount.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  
  yPos += 15
  
  // Payment Information Section
  doc.setFontSize(11)
  doc.setTextColor(37, 99, 235)
  doc.text('PAYMENT INFORMATION', 20, yPos)
  yPos += 8
  
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(20, yPos - 5, 170, 25)
  
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  
  doc.text('Amount Paid:', 23, yPos)
  doc.setTextColor(34, 197, 94)
  doc.setFont('helvetica', 'bold')
  doc.text(`₹${entry.paidAmount.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  
  yPos += 6
  const balanceDue = entry.finalAmount - entry.paidAmount
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Balance Due:', 23, yPos)
  doc.setTextColor(balanceDue > 0 ? 220 : 34, balanceDue > 0 ? 38 : 197, balanceDue > 0 ? 38 : 94)
  doc.text(`₹${balanceDue.toLocaleString('en-IN')}`, 187, yPos, { align: 'right' })
  
  yPos += 6
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text('Payment Method:', 23, yPos)
  doc.text(entry.paymentMethod, 187, yPos, { align: 'right' })
  
  yPos += 6
  doc.text('Payment Status:', 23, yPos)
  const statusColor = entry.paymentStatus === 'Paid' ? [34, 197, 94] : entry.paymentStatus === 'Partial' ? [234, 179, 8] : [220, 38, 38]
  doc.setTextColor(...statusColor)
  doc.setFont('helvetica', 'bold')
  doc.text(entry.paymentStatus, 187, yPos, { align: 'right' })
  
  yPos += 15
  
  // Documents Section
  if (entry.documents.length > 0) {
    doc.setFontSize(10)
    doc.setTextColor(37, 99, 235)
    doc.setFont('helvetica', 'bold')
    doc.text('ATTACHED DOCUMENTS:', 20, yPos)
    yPos += 6
    
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    entry.documents.forEach(docName => {
      doc.text(`• ${docName}`, 23, yPos)
      yPos += 5
    })
    yPos += 5
  }
  
  // Notes Section
  if (entry.notes) {
    doc.setFontSize(10)
    doc.setTextColor(37, 99, 235)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTES:', 20, yPos)
    yPos += 6
    
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    const splitNotes = doc.splitTextToSize(entry.notes, 170)
    doc.text(splitNotes, 20, yPos)
  }
  
  // Footer
  doc.setFillColor(245, 247, 250)
  doc.rect(0, 270, 210, 27, 'F')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'italic')
  doc.text('Thank you for your business!', 105, 280, { align: 'center' })
  doc.setFontSize(8)
  doc.text('For any queries, please contact: support@vehicleservices.com', 105, 286, { align: 'center' })
  
  doc.save(`Invoice_${entry.invoiceNumber}_${entry.client.replace(/\s+/g, '_')}.pdf`)
}

// PDF Generation Function - Payment Receipt
const generatePaymentReceiptPDF = (entry: LedgerEntry) => {
  if (!window.jspdf) {
    alert('PDF library is still loading. Please try again in a moment.')
    return
  }
  
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  
  // Header Background
  doc.setFillColor(34, 197, 94)
  doc.rect(0, 0, 210, 40, 'F')
  
  // Company Header
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('VEHICLE SERVICES INC.', 105, 18, { align: 'center' })
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('123 Main Street, City, State 12345', 105, 26, { align: 'center' })
  doc.text('Phone: (123) 456-7890 | Email: info@vehicleservices.com', 105, 32, { align: 'center' })
  
  // Receipt Title
  doc.setFontSize(22)
  doc.setTextColor(34, 197, 94)
  doc.setFont('helvetica', 'bold')
  // doc.text('PAYMENT RECEIPT', 20, 55)
  
  // Receipt Info Box
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(120, 48, 70, 28)
  
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Receipt Number:', 123, 54)
  doc.setFont('helvetica', 'normal')
  doc.text(`RCP-${entry.invoiceNumber.split('-')[2]}`, 123, 59)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Number:', 123, 64)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.invoiceNumber, 123, 69)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Date:', 123, 74)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.completedDate, 123, 79)
  
  // Received From Section
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 197, 94)
  doc.text('RECEIVED FROM:', 20, 90)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text(entry.client, 20, 97)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(entry.vehicle, 20, 103)
  
  // Payment For Section
  doc.setFillColor(240, 253, 244)
  doc.rect(20, 112, 170, 15, 'F')
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, 112, 170, 15)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 197, 94)
  doc.text('PAYMENT FOR:', 23, 118)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.workflowTitle, 23, 124)
  
  // Payment Details Box - Large and Prominent
  let yPos = 145
  doc.setFillColor(34, 197, 94)
  doc.rect(20, yPos, 170, 35, 'F')
  
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('AMOUNT RECEIVED', 105, yPos + 10, { align: 'center' })
  
  doc.setFontSize(28)
  doc.text(`₹${entry.paidAmount.toLocaleString('en-IN')}`, 105, yPos + 23, { align: 'center' })
  
  yPos += 45
  
  // Payment Method Box
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.rect(20, yPos, 170, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Method:', 23, yPos + 8)
  doc.setFont('helvetica', 'normal')
  doc.text(entry.paymentMethod, 187, yPos + 8, { align: 'right' })
  
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Status:', 23, yPos + 15)
  doc.setTextColor(34, 197, 94)
  doc.text(entry.paymentStatus, 187, yPos + 15, { align: 'right' })
  
  yPos += 30
  
  // Transaction Summary
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('TRANSACTION SUMMARY:', 20, yPos)
  yPos += 8
  
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, yPos - 3, 170, 24)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  doc.text('Invoice Amount:', 23, yPos + 3)
  doc.text(`₹${entry.finalAmount.toLocaleString('en-IN')}`, 187, yPos + 3, { align: 'right' })
  
  doc.text('Amount Paid:', 23, yPos + 9)
  doc.setTextColor(34, 197, 94)
  doc.setFont('helvetica', 'bold')
  doc.text(`₹${entry.paidAmount.toLocaleString('en-IN')}`, 187, yPos + 9, { align: 'right' })
  
  const balance = entry.finalAmount - entry.paidAmount
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.text('Balance Due:', 23, yPos + 15)
  doc.setTextColor(balance > 0 ? 234 : 34, balance > 0 ? 179 : 197, balance > 0 ? 8 : 94)
  doc.setFont('helvetica', 'bold')
  doc.text(`₹${balance.toLocaleString('en-IN')}`, 187, yPos + 15, { align: 'right' })
  
  yPos += 30
  
  // Processed By
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Processed by: ${entry.completedBy}`, 20, yPos)
  
  // Stamp/Signature Area
  yPos += 20
  doc.setDrawColor(200, 200, 200)
  doc.rect(130, yPos, 60, 25)
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Authorized Signature', 160, yPos + 20, { align: 'center' })
  
  // Footer
  doc.setFillColor(240, 253, 244)
  doc.rect(0, 270, 210, 27, 'F')
  doc.setFontSize(9)
  doc.setTextColor(34, 197, 94)
  doc.setFont('helvetica', 'bold')
  doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 280, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  doc.text('For any queries, please contact: support@vehicleservices.com', 105, 286, { align: 'center' })
  
  doc.save(`Receipt_${entry.invoiceNumber}_${entry.client.replace(/\s+/g, '_')}.pdf`)
}

// COMPONENT: Payment Badge
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

// COMPONENT: Summary Cards
const SummaryCards: React.FC<{ financials: any }> = ({ financials }) => (
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
)

// COMPONENT: Filter Bar
const FilterBar: React.FC<{
  searchQuery: string
  setSearchQuery: (q: string) => void
  paymentFilter: string
  setPaymentFilter: (f: any) => void
  filteredCount: number
  totalCount: number
}> = ({ searchQuery, setSearchQuery, paymentFilter, setPaymentFilter, filteredCount, totalCount }) => (
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
            onClick={() => setPaymentFilter(status)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              paymentFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
    <p className="text-xs text-gray-600 mt-2">
      {filteredCount} of {totalCount} entries
    </p>
  </div>
)

// COMPONENT: Ledger Table
const LedgerTable: React.FC<{
  data: LedgerEntry[]
  onViewDetails: (entry: LedgerEntry) => void
}> = ({ data, onViewDetails }) => (
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
          {data.map(entry => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-blue-600">{entry.invoiceNumber}</div>
                <div className="text-xs text-gray-500">{entry.completedDate}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{entry.workflowTitle}</div>
                <div className="text-xs text-gray-500">{entry.client}</div>
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
                  onClick={() => onViewDetails(entry)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
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
)

// COMPONENT: Details View
const DetailsView: React.FC<{
  entry: LedgerEntry
  onBack: () => void
}> = ({ entry, onBack }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Summary
    </button>

    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{entry.workflowTitle}</h2>
      <p className="text-sm text-gray-600 mt-1">{entry.invoiceNumber} • {entry.completedDate}</p>
    </div>

    {/* Financial Breakdown */}
    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
      <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <BadgeIndianRupee className="w-4 h-4" />
        Financial Breakdown
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-800">Base Amount:</span>
          <span className="font-semibold text-blue-900">₹{entry.baseAmount.toLocaleString()}</span>
        </div>
        {entry.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-700 flex items-center gap-1">
              <Percent className="w-3 h-3" />
              Discount ({entry.discountType === 'percentage' 
                ? `${entry.discountValue}%` 
                : `₹${entry.discountValue}`}):
            </span>
            <span className="font-semibold text-green-700">-₹{entry.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-blue-800">Tax ({entry.taxRate}%):</span>
          <span className="font-semibold text-blue-900">+₹{entry.taxAmount.toLocaleString()}</span>
        </div>
        <div className="border-t border-blue-300 pt-2 flex justify-between">
          <span className="font-bold text-blue-900">Final Amount:</span>
          <span className="font-bold text-xl text-blue-900">₹{entry.finalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>

    {/* Payment Status */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-xs text-green-700 mb-1 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Amount Paid
        </p>
        <p className="text-2xl font-bold text-green-700">₹{entry.paidAmount.toLocaleString()}</p>
        <span className="text-xs text-green-600 mt-2 inline-block">{entry.paymentMethod}</span>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-xs text-yellow-700 mb-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Balance Due
        </p>
        <p className="text-2xl font-bold text-yellow-700">
          ₹{(entry.finalAmount - entry.paidAmount).toLocaleString()}
        </p>
        <div className="mt-2">
          <PaymentBadge status={entry.paymentStatus} />
        </div>
      </div>
    </div>

    {/* Client & Vehicle Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Client Information</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">Client Name</label>
            <p className="text-sm font-medium text-gray-900">{entry.client}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Vehicle</label>
            <p className="text-sm font-medium text-gray-900">{entry.vehicle}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Transaction Details</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">Completed By</label>
            <p className="text-sm font-medium text-gray-900">{entry.completedBy}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Payment Method</label>
            <p className="text-sm font-medium text-gray-900">{entry.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Documents */}
    <div className="mb-6">
      <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-2">
        <FileText className="w-3 h-3" />
        Attached Documents
      </label>
      <div className="flex flex-wrap gap-2">
        {entry.documents.map((doc, idx) => (
          <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
            {doc}
          </span>
        ))}
      </div>
    </div>

    {/* Notes */}
    <div className="mb-6">
      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Notes</label>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-900">{entry.notes || 'No notes'}</p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <button
        onClick={onBack}
        className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
      >
        Close
      </button>
      <button 
        onClick={() => generateInvoicePDF(entry)}
        className="flex-1 px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download Invoice PDF
      </button>
    </div>
  </div>
)

// MAIN COMPONENT
const Ledger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<'All' | LedgerEntry['paymentStatus']>('All')
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)
  const [ledgerData] = useState<LedgerEntry[]>(INITIAL_LEDGER_DATA)

  // Load jsPDF library
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    script.async = true
    document.head.appendChild(script)
    
    return () => {
      document.head.removeChild(script)
    }
  }, [])

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

  const financials = useMemo(() => {
    const baseRevenue = filteredData.reduce((sum, e) => sum + e.baseAmount, 0)
    const totalDiscounts = filteredData.reduce((sum, e) => sum + e.discountAmount, 0)
    const netRevenue = baseRevenue - totalDiscounts
    const totalTax = filteredData.reduce((sum, e) => sum + e.taxAmount, 0)
    const grossRevenue = netRevenue + totalTax
    const totalReceived = filteredData.reduce((sum, e) => sum + e.paidAmount, 0)
    const totalDue = filteredData.reduce((sum, e) => sum + (e.finalAmount - e.paidAmount), 0)
    
    return {
      baseRevenue,
      totalDiscounts,
      netRevenue,
      totalTax,
      grossRevenue,
      totalReceived,
      totalDue,
    }
  }, [filteredData])

  const handleViewDetails = (entry: LedgerEntry) => {
    setSelectedEntry(entry)
    setActiveTab('details')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="p-1 mb-4 flex gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'bg-gray-200 text-gray-700 hover:text-blue-500'
            }`}
          >
            Invoice Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            disabled={!selectedEntry}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'details'
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                : 'bg-gray-200 text-gray-700'
            } ${!selectedEntry ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Details
          </button>
        </div>

        {/* Content */}
        {activeTab === 'summary' ? (
          <>
            <SummaryCards financials={financials} />
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              filteredCount={filteredData.length}
              totalCount={ledgerData.length}
            />
            <LedgerTable data={filteredData} onViewDetails={handleViewDetails} />
          </>
        ) : selectedEntry ? (
          <DetailsView entry={selectedEntry} onBack={() => setActiveTab('summary')} />
        ) : null}
      </div>
    </div>
  )
}

export default Ledger