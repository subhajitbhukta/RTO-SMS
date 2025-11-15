import React, { useState, useMemo } from "react";

const STATUS_STYLES = {
  completed: "bg-green-100 text-green-700 border-green-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
  default: "bg-slate-100 text-slate-700 border-slate-300",
};

const InfoCard = ({ title, children }) => (
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase">{title}</h3>
    {children}
  </div>
);

const Button = ({ onClick, children, color = "blue", icon }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-500 hover:bg-gray-300 text-gray-800",
  };
  return (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors flex items-center gap-2 ${colors[color]}`}>
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};

const ServiceDetails = ({ selectedService, mainTab, setMainTab, calculateSubtotal, calculateTax, calculateTotalEstimate, handleSendWhatsApp }) => {
  const [amountPaid, setAmountPaid] = useState(selectedService?.amountPaid || 0);
  const [paymentStatus, setPaymentStatus] = useState(selectedService?.paymentStatus || "unpaid");
  const [serviceStatus, setServiceStatus] = useState(selectedService?.status || "pending");
  const [preview, setPreview] = useState(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  const totals = useMemo(() => {
    const total = calculateTotalEstimate();
    return { total, remaining: Math.max(0, total - amountPaid) };
  }, [calculateTotalEstimate, amountPaid]);

  const markAsPaid = () => {
    setPaymentStatus("paid");
    setAmountPaid(totals.total);
    setServiceStatus("completed");
  };

  const markAsUnpaid = () => {
    setPaymentStatus("unpaid");
    setAmountPaid(0);
    setServiceStatus("pending");
  };

  if (mainTab !== "details" || !selectedService) return null;

  const docs = selectedService.documents || [];
  const navigate = (dir) => {
    const newIdx = dir === 'next' ? Math.min(previewIdx + 1, docs.length - 1) : Math.max(previewIdx - 1, 0);
    setPreviewIdx(newIdx);
    setPreview(docs[newIdx]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{selectedService.id}</h2>
          <p className="text-slate-600">Enquiry: {selectedService.enquiryId}</p>
        </div>
        <Button onClick={() => setMainTab("services")} color="gray">← Back</Button>
      </div>

      {/* Client & Vehicle */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <InfoCard title="Client">
          <p className="text-sm mb-1"><span className="text-slate-500">Name:</span> <span className="font-medium">{selectedService.client.label}</span></p>
          <p className="text-sm"><span className="text-slate-500">Phone:</span> <span className="font-medium">{selectedService.client.phone}</span></p>
        </InfoCard>
        <InfoCard title="Vehicle">
          <p className="text-sm mb-1"><span className="text-slate-500">Vehicle:</span> <span className="font-medium">{selectedService.vehicle?.label || "N/A"}</span></p>
          {selectedService.vehicleNumber && <p className="text-sm mb-2"><span className="text-slate-500">Number:</span> <span className="font-medium">{selectedService.vehicleNumber}</span></p>}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[serviceStatus?.toLowerCase()] || STATUS_STYLES.default}`}>
            {serviceStatus}
          </span>
        </InfoCard>
      </div>

      {/* Documents */}
      {docs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {docs.map((doc, i) => (
              <div key={doc.id} onClick={() => { setPreview(doc); setPreviewIdx(i); }} className="border rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 cursor-pointer group">
                <div className="relative">
                  <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">View</span>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{preview.name}</h3>
                <p className="text-sm text-slate-300">Document {previewIdx + 1} of {docs.length}</p>
              </div>
              <button onClick={() => setPreview(null)} className="hover:bg-slate-700 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="relative bg-slate-100">
              <img src={preview.url} alt={preview.name} className="w-full max-h-[70vh] object-contain" />
              {docs.length > 1 && (
                <>
                  <button onClick={() => navigate('prev')} disabled={previewIdx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg disabled:opacity-40">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={() => navigate('next')} disabled={previewIdx === docs.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg disabled:opacity-40">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
            {docs.length > 1 && (
              <div className="bg-slate-50 p-4 flex gap-3 overflow-x-auto">
                {docs.map((doc, i) => (
                  <img key={doc.id} src={doc.url} alt={doc.name} onClick={() => { setPreviewIdx(i); setPreview(doc); }} className={`h-16 w-24 object-cover rounded cursor-pointer ${i === previewIdx ? 'ring-4 ring-blue-500' : 'opacity-60 hover:opacity-100'}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
        <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-sm font-semibold text-left">Service</th>
                <th className="p-3 text-sm font-semibold text-center">Qty</th>
                <th className="p-3 text-sm font-semibold text-right">Price</th>
                <th className="p-3 text-sm font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {selectedService.estimates.map((est) => (
                <tr key={est.serviceId} className="hover:bg-slate-50">
                  <td className="p-3">{est.serviceName}</td>
                  <td className="p-3 text-center">{est.quantity}</td>
                  <td className="p-3 text-right">₹{est.price.toFixed(2)}</td>
                  <td className="p-3 text-right font-medium">₹{(est.price * est.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-slate-50 border-t p-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax (18% GST)</span><span className="font-medium">₹{calculateTax().toFixed(2)}</span></div>
            <div className="flex justify-between pt-2 border-t"><span className="font-semibold">Total</span><span className="text-xl font-bold text-blue-600">₹{totals.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${paymentStatus === "paid" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                  {paymentStatus === "paid" ? "✓ Paid" : "⚠ Unpaid"}
                </span>
              </div>
              <p className="text-sm text-slate-600">Amount Paid: <span className="font-semibold text-slate-900">₹{amountPaid.toFixed(2)}</span></p>
              <p className="text-sm text-slate-600">Remaining: <span className="font-semibold text-red-600">₹{totals.remaining.toFixed(2)}</span></p>
            </div>
            <div className="flex gap-3">
              <Button onClick={markAsPaid} color="green" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}>Paid</Button>
              <Button onClick={markAsUnpaid} color="red" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}>Unpaid</Button>
            </div>
          </div>
        </div>
      </div>
      

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={() => handleSendWhatsApp(selectedService.client.phone, `Hi ${selectedService.client.label}! Service ${selectedService.id} total: ₹${totals.total.toFixed(2)}`)} color="green" icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}>Send WhatsApp</Button>

        <Button onClick={() => handleSendWhatsApp(selectedService.client.phone, `Hi ${selectedService.client.label}! Service ${selectedService.id} total: ₹${totals.total.toFixed(2)}`)} color="green" icon={""}>Generate Invoice</Button>
      </div>
    </div>
  );
};

export default ServiceDetails;