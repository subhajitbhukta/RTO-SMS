import React, { useState } from "react";
import { Clock, AlertCircle, CheckCircle, Eye, X, Calendar, User, Car, DollarSign, FileText, IndianRupee } from "lucide-react";

const dummyPayments = [
    {
        id: "INV-001",
        clientName: "Rajesh Kumar",
        clientPhone: "+91 98765 43210",
        vehicle: "Honda City 2020",
        vehicleNumber: "KA-01-MN-1234",
        services: [
            { id: "s1", name: "Oil Change", price: 1500, quantity: 1, date: "2025-11-01" },
            { id: "s2", name: "Brake Service", price: 3500, quantity: 1, date: "2025-11-01" },
            { id: "s3", name: "Tire Rotation", price: 800, quantity: 4, date: "2025-11-05" },
        ],
        totalCost: 8300,
        amountPaid: 5000,
        dueAmount: 3300,
        status: "due",
        dueDate: "2025-11-20",
        lastPaymentDate: "2025-11-10",
    },
    {
        id: "INV-002",
        clientName: "Priya Sharma",
        clientPhone: "+91 87654 32109",
        vehicle: "Maruti Swift 2019",
        vehicleNumber: "KA-02-AB-5678",
        services: [
            { id: "s4", name: "Engine Tune-up", price: 4500, quantity: 1, date: "2025-11-08" },
            { id: "s5", name: "AC Repair", price: 2800, quantity: 1, date: "2025-11-08" },
        ],
        totalCost: 7300,
        amountPaid: 0,
        dueAmount: 7300,
        status: "pending",
        dueDate: "2025-11-15",
    },
    {
        id: "INV-003",
        clientName: "Amit Patel",
        clientPhone: "+91 76543 21098",
        vehicle: "Hyundai Creta 2021",
        vehicleNumber: "KA-03-CD-9012",
        services: [
            { id: "s6", name: "Full Service", price: 5500, quantity: 1, date: "2025-10-25" },
            { id: "s7", name: "Wheel Alignment", price: 1200, quantity: 1, date: "2025-10-25" },
        ],
        totalCost: 6700,
        amountPaid: 6700,
        dueAmount: 0,
        status: "fulfilled",
        dueDate: "2025-11-05",
        lastPaymentDate: "2025-11-05",
    },
];

const StatusBadge = ({ status }) => {
    const configs = {
        pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
        due: { bg: "bg-red-100", text: "text-red-700", label: "Overdue" },
        fulfilled: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
    };
    const cfg = configs[status] || configs.pending;
    return <span className={`${cfg.bg} ${cfg.text} px-3 py-1 rounded-full text-xs font-semibold`}>{cfg.label}</span>;
};

const PaymentCard = ({ payment, onViewDetails }) => {
    const progress = (payment.amountPaid / payment.totalCost) * 100;
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{payment.clientName}</h3>
                    <p className="text-sm text-slate-600">{payment.clientPhone}</p>
                    <p className="text-xs text-slate-500 mt-1">{payment.id}</p>
                </div>
                <StatusBadge status={payment.status} />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm">
                <span className="font-medium text-slate-900">{payment.vehicle}</span>
                <span className="text-slate-600"> • {payment.vehicleNumber}</span>
            </div>
            <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Services</p>
                {payment.services.slice(0, 2).map((s) => (
                    <p key={s.id} className="text-sm text-slate-700">• {s.name} <span className="text-slate-500">(₹{s.price})</span></p>
                ))}
                {payment.services.length > 2 && <p className="text-xs text-blue-600 font-medium">+{payment.services.length - 2} more</p>}
            </div>
            <div className="border-t border-slate-200 pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total</span>
                    <span className="font-bold text-slate-900">₹{payment.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Paid</span>
                    <span className="font-semibold text-green-600">₹{payment.amountPaid.toFixed(2)}</span>
                </div>
                {payment.dueAmount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Due</span>
                        <span className="font-semibold text-red-600">₹{payment.dueAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-600 mb-4">Due: {payment.dueDate}</p>
            <button onClick={onViewDetails} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" /> View Details
            </button>
        </div>
    );
};

const PaymentManagement = () => {
    const [mainTab, setMainTab] = useState("payments");
    const [subTab, setSubTab] = useState("pending");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [payments, setPayments] = useState(dummyPayments);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [paymentNote, setPaymentNote] = useState("");
    const [originalTotal, setOriginalTotal] = useState(0);
    const [editedTotal, setEditedTotal] = useState(0);
    const [editedPaid, setEditedPaid] = useState(0);
    
    const filteredPayments = payments.filter((p) => p.status === subTab);
    const counts = {
        pending: payments.filter((p) => p.status === "pending").length,
        due: payments.filter((p) => p.status === "due").length,
        fulfilled: payments.filter((p) => p.status === "fulfilled").length,
    };

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setMainTab("details");
        setPaymentAmount("");
        setDiscountAmount("");
        setPaymentNote("");
        setOriginalTotal(payment.totalCost);
        setEditedTotal(payment.totalCost);
        setEditedPaid(payment.amountPaid);
    };

    const handleBackToPayments = () => {
        setMainTab("payments");
        setSelectedPayment(null);
        setPaymentAmount("");
        setDiscountAmount("");
        setPaymentNote("");
        setOriginalTotal(0);
        setEditedTotal(0);
        setEditedPaid(0);
    };

    const handleSaveChanges = () => {
        if (editedPaid > editedTotal) {
            alert("Paid amount cannot exceed total amount");
            return;
        }

        const updatedPayments = payments.map((p) => {
            if (p.id === selectedPayment.id) {
                const newDue = editedTotal - editedPaid;
                return {
                    ...p,
                    totalCost: editedTotal,
                    amountPaid: editedPaid,
                    dueAmount: newDue,
                    status: newDue === 0 ? "fulfilled" : newDue > 0 && p.status === "pending" ? "due" : p.status,
                    lastPaymentDate: new Date().toISOString().split('T')[0]
                };
            }
            return p;
        });

        setPayments(updatedPayments);
        const updated = updatedPayments.find(p => p.id === selectedPayment.id);
        setSelectedPayment(updated);
        setOriginalTotal(editedTotal);
        alert("Changes saved successfully!");
    };

    const handleAddPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (!amount || amount <= 0) {
            alert("Please enter a valid payment amount");
            return;
        }
        
        if (amount > selectedPayment.dueAmount) {
            alert("Payment amount cannot exceed due amount");
            return;
        }

        const updatedPayments = payments.map((p) => {
            if (p.id === selectedPayment.id) {
                const newAmountPaid = p.amountPaid + amount;
                const newDueAmount = p.dueAmount - amount;
                const newStatus = newDueAmount === 0 ? "fulfilled" : p.status === "pending" ? "due" : p.status;
                
                return {
                    ...p,
                    amountPaid: newAmountPaid,
                    dueAmount: newDueAmount,
                    status: newStatus,
                    lastPaymentDate: new Date().toISOString().split('T')[0]
                };
            }
            return p;
        });

        setPayments(updatedPayments);
        const updated = updatedPayments.find(p => p.id === selectedPayment.id);
        setSelectedPayment(updated);
        setPaymentAmount("");
        setPaymentNote("");
        alert(`Payment of ₹${amount.toFixed(2)} added successfully!`);
    };

    const handleApplyDiscount = () => {
        const discount = parseFloat(discountAmount);
        if (!discount || discount <= 0) {
            alert("Please enter a valid discount amount");
            return;
        }
        
        if (discount > selectedPayment.totalCost) {
            alert("Discount cannot exceed total cost");
            return;
        }

        const updatedPayments = payments.map((p) => {
            if (p.id === selectedPayment.id) {
                const newTotalCost = p.totalCost - discount;
                const newDueAmount = newTotalCost - p.amountPaid;
                const newStatus = newDueAmount <= 0 ? "fulfilled" : p.status;
                
                return {
                    ...p,
                    totalCost: newTotalCost,
                    dueAmount: Math.max(0, newDueAmount),
                    status: newStatus
                };
            }
            return p;
        });

        setPayments(updatedPayments);
        const updated = updatedPayments.find(p => p.id === selectedPayment.id);
        setSelectedPayment(updated);
        setDiscountAmount("");
        alert(`Discount of ₹${discount.toFixed(2)} applied successfully!`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-1">
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-2 border-b p-2 border-slate-300 mb-4">
                    {["payments", "details"].map((tab) => (
                        <button key={tab} onClick={() => setMainTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mainTab === tab ? "bg-white text-blue-600 shadow-sm border border-gray-200" : "bg-gray-200 text-gray-700 hover:text-blue-500"}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {mainTab === "payments" && (
                    <>
                        <div className="flex gap-3 mb-6">
                            {["pending", "due", "fulfilled"].map((tab) => (
                                <button key={tab} onClick={() => setSubTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${subTab === tab ? "bg-white text-blue-600 shadow-sm border border-gray-200" : "bg-gray-200 text-gray-700 hover:text-blue-500"}`}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-20">{counts[tab]}</span>
                                </button>
                            ))}
                        </div>
                        {filteredPayments.length === 0 ? (
                            <div className="bg-white rounded-lg border p-12 text-center">
                                <FileText className="w-16 h-16 mx-auto text-slate-400 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No {subTab} payments</h3>
                                <p className="text-slate-600">There are no payments in this category</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPayments.map((p) => <PaymentCard key={p.id} payment={p} onViewDetails={() => handleViewDetails(p)} />)}
                            </div>
                        )}
                    </>
                )}

                {mainTab === "details" && selectedPayment && (
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="border-b p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedPayment.id}</h2>
                                <p className="text-slate-600 mt-1">Payment Details</p>
                            </div>
                            <button onClick={handleBackToPayments} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                                ← Back to Payments
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4 border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="w-5 h-5 text-slate-600" />
                                        <h3 className="font-semibold">Client Information</h3>
                                    </div>
                                    <p className="text-sm mb-2"><span className="text-slate-600">Name:</span> <span className="font-medium">{selectedPayment.clientName}</span></p>
                                    <p className="text-sm"><span className="text-slate-600">Phone:</span> <span className="font-medium">{selectedPayment.clientPhone}</span></p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Car className="w-5 h-5 text-slate-600" />
                                        <h3 className="font-semibold">Vehicle Information</h3>
                                    </div>
                                    <p className="text-sm mb-2"><span className="text-slate-600">Model:</span> <span className="font-medium">{selectedPayment.vehicle}</span></p>
                                    <p className="text-sm"><span className="text-slate-600">Number:</span> <span className="font-medium">{selectedPayment.vehicleNumber}</span></p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-5 h-5" /> Services Breakdown</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="text-left p-3 text-sm font-semibold">Service</th>
                                                <th className="text-center p-3 text-sm font-semibold">Qty</th>
                                                <th className="text-right p-3 text-sm font-semibold">Price</th>
                                                <th className="text-right p-3 text-sm font-semibold">Total</th>
                                                <th className="text-left p-3 text-sm font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {selectedPayment.services.map((s) => (
                                                <tr key={s.id} className="hover:bg-slate-50">
                                                    <td className="p-3 text-sm">{s.name}</td>
                                                    <td className="p-3 text-center text-sm">{s.quantity}</td>
                                                    <td className="p-3 text-right text-sm">₹{s.price}</td>
                                                    <td className="p-3 text-right text-sm font-medium">₹{s.price * s.quantity}</td>
                                                    <td className="p-3 text-sm text-slate-600">{s.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><IndianRupee  className="w-5 h-5" /> Manual Adjustments</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Total Amount (INR)</label>
                                        <input
                                            type="number"
                                            value={editedTotal}
                                            onChange={(e) => setEditedTotal(parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Amount Paid (INR)</label>
                                        <input
                                            type="number"
                                            value={editedPaid}
                                            onChange={(e) => setEditedPaid(parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Apply Discount (INR)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                placeholder="Enter discount"
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                step="0.01"
                                                min="0"
                                            />
                                            <button
                                                onClick={() => {
                                                    const discount = parseFloat(discountAmount);
                                                    if (!discount || discount <= 0) {
                                                        alert("Please enter a valid discount amount");
                                                        return;
                                                    }
                                                    if (discount > editedTotal) {
                                                        alert("Discount cannot exceed total amount");
                                                        return;
                                                    }
                                                    setEditedTotal(editedTotal - discount);
                                                    setDiscountAmount("");
                                                    alert(`Discount of ₹${discount.toFixed(2)} applied!`);
                                                }}
                                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t space-y-2">
                                        <h4 className="font-semibold text-slate-800 mb-2">Summary</h4>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Original Total</span>
                                            <span className="font-medium">₹{originalTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Discount</span>
                                            <span className="font-medium text-orange-600">-₹{(originalTotal - editedTotal).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="text-slate-600 font-semibold">Total</span>
                                            <span className="font-bold">₹{editedTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Paid</span>
                                            <span className="font-semibold text-green-600">₹{editedPaid.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="font-semibold">Balance Due</span>
                                            <span className={`font-bold text-lg ${(editedTotal - editedPaid) === 0 ? "text-green-600" : "text-red-600"}`}>
                                                ₹{(editedTotal - editedPaid).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <StatusBadge status={selectedPayment.status} />
                                    </div>

                                    <button
                                        onClick={handleSaveChanges}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentManagement;