import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { clsx } from 'clsx';

const ContractorDashboard = () => {
  const { jobs, user, fetchJobs, requests, fetchRequests } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchJobs();
    fetchRequests();
  }, []);

  const availableJobs = jobs.filter(job => job.status === 'Open');
  const myJobs = jobs.filter(job => job.assignedTo === user.email);

  const getJobDisplayStatus = (job) => {
    if (job.status === 'Open') {
      const hasMyPendingRequest = requests.some(r => r.jobId === job._id && r.contractorEmail === user.email && r.status === 'pending');
      return hasMyPendingRequest ? 'Interest Expressed' : 'Open';
    }
    return job.status;
  };

  const displayedJobs = activeTab === 'available' ? availableJobs : myJobs;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contractor Portal</h1>
          <p className="text-gray-500">Find work and manage tasks</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('available')}
          className={clsx(
            "pb-3 px-1 font-medium text-sm transition-all border-b-2",
            activeTab === 'available' ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Available Jobs ({availableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('my-jobs')}
          className={clsx(
            "pb-3 px-1 font-medium text-sm transition-all border-b-2",
            activeTab === 'my-jobs' ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          My Jobs ({myJobs.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedJobs.map(job => (
          <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="glass-card hover:translate-y-[-4px] transition-transform cursor-pointer group flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <StatusBadge status={getJobDisplayStatus(job)} />
              {job.price && <span className="text-sm font-semibold text-emerald-600">${job.price}</span>}
            </div>
            
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">{job.title}</h3>
            
            <div className="text-sm text-gray-500 flex items-center gap-1 mb-4">
              <MapPin size={14} />
              <span className="truncate">{job.propertyAddress}</span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{job.description}</p>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 mt-auto">
               <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
        
        {displayedJobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white/30 rounded-xl border border-dashed border-gray-300">
            <p>No jobs found in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
