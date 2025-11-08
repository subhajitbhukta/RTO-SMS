import React, { useState } from 'react';
import { Search, X, CheckCircle, Clock, FileText, LayoutGrid, List } from 'lucide-react';

// Types
type Workflow = {
  id: number;
  title: string;
  vehicle: string;
  client: string;
  status: 'Pending' | 'InProgress' | 'Dispute' | 'Complete';
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
};

type FormData = {
  completionNotes: string;
  completedBy: string;
  documents: string;
  cost: string;
};

// DataTable Component
const DataTable = <T,>({ columns, data, renderRow, emptyMessage = "No records found" }: {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}) => {
  if (!data?.length) return <p className="text-center text-gray-500 mt-6">{emptyMessage}</p>;
  
  return (
    <div className="bg-white rounded-lg border border-gray-400 mt-2 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
  );
};

// Constants
const FILTERS = ['Pending', 'InProgress', 'Dispute', 'Complete'];
const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  InProgress: 'bg-blue-100 text-blue-700',
  Dispute: 'bg-red-100 text-red-700',
  Complete: 'bg-green-100 text-green-700'
};
const PRIORITY_COLORS = {
  High: 'text-red-600',
  Medium: 'text-orange-600',
  Low: 'text-green-600'
};

const INITIAL_WORKFLOWS: Workflow[] = [
  { id: 1, title: 'Vehicle Registration', vehicle: 'Toyota Camry • ABC123', client: 'John Doe', status: 'Pending', date: '2024-11-10', priority: 'High', description: 'Complete vehicle registration process with RTO' },
  { id: 2, title: 'Insurance Claim', vehicle: 'Honda CR-V • XYZ789', client: 'Jane Smith', status: 'InProgress', date: '2024-11-08', priority: 'Medium', description: 'Process insurance claim for accident damage' },
  { id: 3, title: 'License Renewal', vehicle: 'Tesla Model 3 • TES001', client: 'Sarah Smith', status: 'Dispute', date: '2024-11-05', priority: 'High', description: 'Resolve documentation issues for license renewal' },
  { id: 4, title: 'PUC Certificate', vehicle: 'BMW X5 • BMW456', client: 'Mike Johnson', status: 'Complete', date: '2024-11-01', priority: 'Low', description: 'Pollution Under Control certificate issued' },
  { id: 5, title: 'Ownership Transfer', vehicle: 'Audi A6 • AUD789', client: 'Emily Davis', status: 'InProgress', date: '2024-11-09', priority: 'Medium', description: 'Transfer vehicle ownership to new owner' },
  { id: 6, title: 'Service Reminder', vehicle: 'Mercedes C-Class • MER321', client: 'Robert Brown', status: 'Complete', date: '2024-10-28', priority: 'Low', description: 'Annual service completed successfully' }
];

// Main Component
const Workflows = () => {
  const [state, setState] = useState({
    activeFilter: 'Pending',
    searchQuery: '',
    viewMode: 'card' as 'card' | 'table',
    showCompleteModal: false,
    showDetailModal: false,
    selectedWorkflow: null as Workflow | null
  });
  
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [formData, setFormData] = useState<FormData>({ completionNotes: '', completedBy: '', documents: '', cost: '' });

  const filteredWorkflows = workflows.filter(w => {
    const matchesFilter = state.activeFilter === 'All' || w.status === state.activeFilter;
    const matchesSearch = [w.title, w.vehicle, w.client].some(field => 
      field.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  const updateState = (updates: Partial<typeof state>) => setState(prev => ({ ...prev, ...updates }));
  
  const updateWorkflowStatus = (id: number, status: Workflow['status']) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const openModal = (workflow: Workflow, type: 'complete' | 'detail') => {
    updateState({ 
      selectedWorkflow: workflow,
      [type === 'complete' ? 'showCompleteModal' : 'showDetailModal']: true 
    });
    if (type === 'complete') setFormData({ completionNotes: '', completedBy: '', documents: '', cost: '' });
  };

  const closeModals = () => updateState({ showCompleteModal: false, showDetailModal: false, selectedWorkflow: null });

  const handleCompleteSubmit = () => {
    if (!formData.completedBy || !formData.completionNotes) {
      alert('Please fill in all required fields');
      return;
    }
    if (state.selectedWorkflow) {
      updateWorkflowStatus(state.selectedWorkflow.id, 'Complete');
      closeModals();
    }
  };

  const ActionButtons = ({ workflow, compact = false }: { workflow: Workflow; compact?: boolean }) => {
    const buttonClass = (color: string) => `${compact ? 'inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs' : 'flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm'} ${color} text-white rounded-lg hover:opacity-90 transition-colors font-medium`;
    
    return (
      <div className={compact ? 'flex gap-1.5 flex-wrap' : 'grid grid-cols-2 gap-2'}>
        {workflow.status !== 'Pending' && (
          <button onClick={() => updateWorkflowStatus(workflow.id, 'Pending')} className={buttonClass('bg-yellow-500')} title="Mark as Pending">
            <Clock className="w-3.5 h-3.5" />
            {compact ? 'Pend' : 'Pending'}
          </button>
        )}
        {workflow.status !== 'Dispute' && (
          <button onClick={() => updateWorkflowStatus(workflow.id, 'Dispute')} className={buttonClass('bg-red-600')} title="Mark as Dispute">
            <X className="w-3.5 h-3.5" />
            {compact ? 'Disp' : 'Dispute'}
          </button>
        )}
        {workflow.status !== 'Complete' && (
          <button onClick={() => openModal(workflow, 'complete')} className={buttonClass('bg-green-600')} title="Mark as Complete">
            <CheckCircle className="w-3.5 h-3.5" />
            {compact ? 'Done' : 'Complete'}
          </button>
        )}
        <button onClick={() => openModal(workflow, 'detail')} className={buttonClass('bg-blue-600')} title="View Details">
          <FileText className="w-3.5 h-3.5" />
          {compact ? 'Info' : 'Details'}
        </button>
      </div>
    );
  };

  const StatusBadge = ({ status }: { status: Workflow['status'] }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {status === 'InProgress' ? 'In Progress' : status}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          {/* Desktop: Single Row Layout */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={state.searchQuery}
                onChange={(e) => updateState({ searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateState({ viewMode: 'card' })}
                className={`p-2.5 rounded-lg transition-colors ${state.viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title="Card View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => updateState({ viewMode: 'table' })}
                className={`p-2.5 rounded-lg transition-colors ${state.viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title="Table View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile: Compact Layout */}
          <div className="lg:hidden flex flex-col gap-3">
            {/* Search + Toggle Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={state.searchQuery}
                  onChange={(e) => updateState({ searchQuery: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateState({ viewMode: 'card' })}
                  className={`p-2 rounded-lg transition-colors ${state.viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateState({ viewMode: 'table' })}
                  className={`p-2 rounded-lg transition-colors ${state.viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Filters Row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  onClick={() => updateState({ activeFilter: filter })}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs ${
                    state.activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Filters Row */}
          <div className="hidden lg:flex gap-2 mt-4">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => updateState({ activeFilter: filter })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                  state.activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Card View */}
        {state.viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredWorkflows.map(workflow => (
              <div key={workflow.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <StatusBadge status={workflow.status} />
                  <span className={`text-xs font-semibold ${PRIORITY_COLORS[workflow.priority]}`}>{workflow.priority}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{workflow.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{workflow.vehicle}</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{workflow.client}</p>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mb-3 sm:mb-4">
                  <span className="text-xs text-gray-500">Date</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{workflow.date}</span>
                </div>
                <ActionButtons workflow={workflow} />
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            columns={['Title', 'Vehicle', 'Client', 'Status', 'Priority', 'Date', 'Actions']}
            data={filteredWorkflows}
            renderRow={(workflow: Workflow) => (
              <tr key={workflow.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">{workflow.title}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{workflow.vehicle}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{workflow.client}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4"><StatusBadge status={workflow.status} /></td>
                <td className="px-4 sm:px-6 py-3 sm:py-4"><span className={`text-sm font-semibold ${PRIORITY_COLORS[workflow.priority]}`}>{workflow.priority}</span></td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{workflow.date}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4"><ActionButtons workflow={workflow} compact /></td>
              </tr>
            )}
            emptyMessage="No workflows found"
          />
        )}

        {/* Bottom Pagination */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-600">
            {filteredWorkflows.length} of {workflows.length} workflows
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">3</button>
            </div>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {state.showCompleteModal && state.selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Complete Workflow</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Workflow</label>
                <input type="text" value={state.selectedWorkflow.title} disabled className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Completed By <span className="text-red-500">*</span></label>
                <input type="text" name="completedBy" value={formData.completedBy} onChange={(e) => setFormData(prev => ({ ...prev, completedBy: e.target.value }))} placeholder="Enter your name" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Completion Notes <span className="text-red-500">*</span></label>
                <textarea name="completionNotes" value={formData.completionNotes} onChange={(e) => setFormData(prev => ({ ...prev, completionNotes: e.target.value }))} placeholder="Enter completion details" rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Documents Submitted</label>
                <input type="text" name="documents" value={formData.documents} onChange={(e) => setFormData(prev => ({ ...prev, documents: e.target.value }))} placeholder="e.g., RC Copy, Insurance" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                <input type="number" name="cost" value={formData.cost} onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))} placeholder="Enter amount" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={closeModals} className="flex-1 px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={handleCompleteSubmit} className="flex-1 px-4 py-2 sm:py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {state.showDetailModal && state.selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Workflow Details</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5 sm:w-6 sm:h-6" /></button>
            </div>
            <div className="space-y-4">
              <StatusBadge status={state.selectedWorkflow.status} />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{state.selectedWorkflow.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{state.selectedWorkflow.description}</p>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 sm:space-y-3">
                {[
                  { label: 'Vehicle', value: state.selectedWorkflow.vehicle },
                  { label: 'Client', value: state.selectedWorkflow.client },
                  { label: 'Date', value: state.selectedWorkflow.date },
                  { label: 'Priority', value: state.selectedWorkflow.priority, color: PRIORITY_COLORS[state.selectedWorkflow.priority] }
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">{item.label}:</span>
                    <span className={`text-xs sm:text-sm font-medium ${item.color || 'text-gray-900'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={closeModals} className="w-full mt-4 sm:mt-6 px-4 py-2 sm:py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;