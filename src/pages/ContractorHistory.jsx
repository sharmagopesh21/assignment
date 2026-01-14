import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronLeft } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const ContractorHistory = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { fetchContractorJobs } = useStore();

  const contractorHistory = fetchContractorJobs(email);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="glass-card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contractor Work History</h1>
          <p className="text-gray-600 mt-1">{email}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="text-sm text-gray-600">Total Jobs</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">{contractorHistory.length}</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {contractorHistory.filter(j => j.status === 'Completed' || j.status === 'Invoiced' || j.status === 'Paid').length}
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {contractorHistory.filter(j => j.status === 'In Progress' || j.status === 'Assigned').length}
            </div>
          </div>
        </div>

        {contractorHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            No previous jobs found for this contractor.
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Job History</h2>
            {contractorHistory.map(historyJob => (
              <div key={historyJob._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                   onClick={() => navigate(`/jobs/${historyJob._id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{historyJob.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{historyJob.propertyAddress}</p>
                  </div>
                  <StatusBadge status={historyJob.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Assigned:</span>
                    <span className="ml-2 text-gray-900">{new Date(historyJob.createdAt).toLocaleDateString()}</span>
                  </div>
                  {historyJob.price && (
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-2 font-semibold text-gray-900">${historyJob.price}</span>
                    </div>
                  )}
                  {historyJob.budget && (
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <span className="ml-2 text-indigo-600">${historyJob.budget}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorHistory;
