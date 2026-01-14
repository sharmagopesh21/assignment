import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PlusCircle, Search, MapPin, Calendar, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const AgentDashboard = () => {
  const { jobs, user, fetchJobs, requests, fetchRequests, deleteJob } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchRequests();
  }, []);

  const myJobs = jobs.filter(job => job.createdBy === user.email);

  const getJobDisplayStatus = (job) => {
    if (job.status === 'Open') {
      const hasPendingRequests = requests.some(r => r.jobId === job._id && r.status === 'pending');
      return hasPendingRequests ? 'Interest Expressed' : 'Open';
    }
    return job.status;
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        const result = await deleteJob(jobId);
        if (!result.success) {
            alert(result.message || 'Failed to delete job');
        }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Maintenance</h1>
          <p className="text-gray-500">Manage work orders and requests</p>
        </div>
        <Link to="/agent/create-job" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} /> New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myJobs.map(job => (
          <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="glass-card hover:translate-y-[-4px] transition-transform cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <StatusBadge status={getJobDisplayStatus(job)} />
              <div className="flex items-center gap-2">
                {job.status === 'Open' && (
                  <button 
                    onClick={(e) => handleDelete(e, job._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <span className="text-xs text-gray-400 font-mono">#{job._id.slice(-6)}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
            
            <div className="text-sm text-gray-500 flex items-center gap-1 mb-4">
              <MapPin size={14} />
              <span className="truncate">{job.propertyAddress}</span>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="font-semibold text-gray-700">{job.budget ? `$${job.budget}` : ''}</span>
              <span>{job.assignedTo ? 'Assigned' : 'Unassigned'}</span>
            </div>
          </div>
        ))}
        
        {myJobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white/30 rounded-xl border border-dashed border-gray-300">
            <p>No jobs found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
