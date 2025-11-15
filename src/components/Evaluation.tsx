import React, { useState, useRef, useEffect } from "react"
import { MoreVertical, Edit, FileCheck, Trash2, FileText, Upload, X, Plus, Check, FileEdit } from "lucide-react"

interface Option {
  id: string
  label: string
}

interface Document {
  id: string
  name: string
  file?: File | null
}

interface Enquiry {
  id: string
  services: Option[]
  client: Option
  vehicle: Option | null
  documents: Document[]
  createdAt: string
  status: 'pending' | 'in-progress' | 'completed'
  notes?: string
}

interface EvaluationProps {
  enquiries: Enquiry[]
  onEdit: (enquiry: Enquiry) => void
  onCreateService: (enquiry: Enquiry, documents: Document[]) => void
  onDiscard: (enquiry: Enquiry) => void
  onAddNote: (enquiry: Enquiry, note: string) => void
}

const useClickOutside = (refs: React.RefObject<HTMLElement>[], handler: () => void) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (refs.every(ref => !ref.current?.contains(e.target as Node))) handler()
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [refs, handler])
}

const DocumentUploadCard = ({ doc, onFileSelect, onRemove }: any) => (
  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) onFileSelect(doc.id, file)
    }}
    className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:border-indigo-400 transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-medium text-slate-700">{doc.name}</label>
      <button
        onClick={() => onRemove(doc.id)}
        className="text-slate-400 hover:text-rose-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
    
    {!doc.file ? (
      <label className="flex flex-col items-center justify-center py-6 cursor-pointer group">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileSelect(doc.id, file)
          }}
        />
        <Upload className="h-8 w-8 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span className="text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">
          Click or drag to upload
        </span>
      </label>
    ) : (
      <div className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 flex items-center justify-center rounded-lg">
            <FileText className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{doc.file.name}</p>
            <p className="text-xs text-slate-500">{(doc.file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFileSelect(doc.id, null)
          }}
          className="text-rose-500 hover:text-rose-600 transition-colors p-1"
        >
          <X size={14} />
        </button>
      </div>
    )}
  </div>
)

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full">
            <FileCheck className="text-indigo-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-center mb-2">{title}</h3>
          <p className="text-slate-600 text-center mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Not Yet
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddNoteModal = ({ isOpen, onClose, enquiry, onSubmit }: any) => {
  const [note, setNote] = useState(enquiry?.notes || "")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (note.trim()) {
      onSubmit(enquiry, note)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Add Note</h3>
              <p className="text-sm text-slate-600 mt-1">
                Enquiry #{enquiry?.id} - {enquiry?.client.label}
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

        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            autoFocus
          />
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!note.trim()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}

const CreateServiceModal = ({ isOpen, onClose, enquiry, onSubmit }: any) => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Service Agreement", file: null },
    { id: "2", name: "Vehicle Inspection Report", file: null },
  ])
  const [newDocName, setNewDocName] = useState("")
  const [showAddInput, setShowAddInput] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen) return null

  const handleFileSelect = (docId: string, file: File | null) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, file } : d)))
  }

  const handleRemoveDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
  }

  const handleAddDocument = () => {
    if (newDocName.trim()) {
      setDocuments((prev) => [
        ...prev,
        { id: String(Date.now()), name: newDocName, file: null },
      ])
      setNewDocName("")
      setShowAddInput(false)
    }
  }

  const handleUploadComplete = () => {
    const allUploaded = documents.every(doc => doc.file)
    // if (!allUploaded) {
    //   alert("Please upload all required documents")
    //   return
    // }
    setShowConfirmation(true)
  }

  const handleConfirmComplete = () => {
    onSubmit(enquiry, documents)
    setShowConfirmation(false)
    onClose()
  }

  const uploadedCount = documents.filter(doc => doc.file).length

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Create Evaluation</h3>
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

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">
                Upload Progress
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                {uploadedCount} / {documents.length} documents
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {/* Enquiry Details */}
            <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Enquiry Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Services</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {enquiry.services.map((s: Option) => (
                      <span key={s.id} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Vehicle</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {enquiry.vehicle?.label || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-800">Required Documents</h4>
                {!showAddInput && (
                  <button
                    onClick={() => setShowAddInput(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-all"
                  >
                    <Plus size={14} />
                    Add Document
                  </button>
                )}
              </div>

              {showAddInput && (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-indigo-300">
                  <label className="text-xs font-medium text-slate-700 mb-2 block">
                    New Document Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Insurance Certificate"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDocument()}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={handleAddDocument}
                      disabled={!newDocName.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddInput(false)
                        setNewDocName("")
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <DocumentUploadCard
                    key={doc.id}
                    doc={doc}
                    onFileSelect={handleFileSelect}
                    onRemove={handleRemoveDocument}
                  />
                ))}
              </div>

              {documents.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="mx-auto mb-2 text-slate-300" size={40} />
                  <p className="text-sm">No documents added yet</p>
                  <p className="text-xs">Click "Add Document" to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadComplete}
              // disabled={uploadedCount !== documents.length || documents.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck size={18} />
              Upload Complete
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmComplete}
        title="Want to Evaluate"
        // message="If Want Evaluate Click yes"
      />
    </>
  )
}

const SuccessToast = ({ message, onClose }: any) => (
  <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl border border-emerald-200 p-4 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 z-50">
    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
      <Check className="text-emerald-600" size={18} />
    </div>
    <p className="text-sm font-medium text-slate-700">{message}</p>
    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
      <X size={18} />
    </button>
  </div>
)

const ActionMenu = ({ enquiry, onEdit, onCreateService, onDiscard, onAddNote }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => setIsOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-slate-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <button
            onClick={() => { onEdit(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
          >
            <Edit size={16} className="text-indigo-600" />
            <span className="text-slate-700 font-medium">Edit Enquiry</span>
          </button>
          <button
            onClick={() => { onAddNote(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
          >
            <FileEdit size={16} className="text-blue-600" />
            <span className="text-slate-700 font-medium">Add Note</span>
          </button>
          <button
            onClick={() => { onCreateService(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
          >
            <FileCheck size={16} className="text-emerald-600" />
            <span className="text-slate-700 font-medium">Create Evaluation</span>
          </button>
          <button
            onClick={() => { onDiscard(enquiry); setIsOpen(false) }}
            className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors flex items-center gap-3 text-sm border-t border-slate-100"
          >
            <Trash2 size={16} className="text-rose-600" />
            <span className="text-rose-700 font-medium">Discard Enquiry</span>
          </button>
        </div>
      )}
    </div>
  )
}

const Evaluation: React.FC<EvaluationProps> = ({ enquiries, onEdit, onCreateService, onDiscard, onAddNote }) => {
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleCreateServiceClick = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry)
    setShowCreateServiceModal(true)
  }

  const handleAddNoteClick = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry)
    setShowAddNoteModal(true)
  }

  const handleCreateServiceSubmit = (enquiry: Enquiry, documents: Document[]) => {
    onCreateService(enquiry, documents)
    setSuccessMessage(`Evaluation completed successfully for enquiry #${enquiry.id}`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setShowCreateServiceModal(false)
  }

  const handleAddNoteSubmit = (enquiry: Enquiry, note: string) => {
    onAddNote(enquiry, note)
    setSuccessMessage('Note added successfully')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Services</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText className="text-slate-400" size={28} />
                      </div>
                      <p className="text-slate-600 font-medium">No enquiries found</p>
                      <p className="text-slate-500 text-sm">Create your first enquiry to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry: Enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">#{enquiry.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{enquiry.client.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{enquiry.vehicle?.label || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {enquiry.services.slice(0, 2).map((s) => (
                          <span key={s.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                            {s.label}
                          </span>
                        ))}
                        {enquiry.services.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                            +{enquiry.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{enquiry.createdAt}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu
                        enquiry={enquiry}
                        onEdit={onEdit}
                        onAddNote={handleAddNoteClick}
                        onCreateService={handleCreateServiceClick}
                        onDiscard={onDiscard}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateServiceModal && selectedEnquiry && (
        <CreateServiceModal
          isOpen={showCreateServiceModal}
          onClose={() => setShowCreateServiceModal(false)}
          enquiry={selectedEnquiry}
          onSubmit={handleCreateServiceSubmit}
        />
      )}

      {showAddNoteModal && selectedEnquiry && (
        <AddNoteModal
          isOpen={showAddNoteModal}
          onClose={() => setShowAddNoteModal(false)}
          enquiry={selectedEnquiry}
          onSubmit={handleAddNoteSubmit}
        />
      )}

      {showSuccess && (
        <SuccessToast
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  )
}

export default Evaluation