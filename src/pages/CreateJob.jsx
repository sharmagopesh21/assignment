import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, Upload } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const { addJob } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyAddress: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      addJob(formData);
      setLoading(false);
      navigate('/agent');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
        <ChevronLeft size={18} /> Back
      </button>
      
      <div className="glass-card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Broken AC in Living Room"
              className="input-field"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
            <input
              required
              type="text"
              placeholder="e.g. 123 Baker Street"
              className="input-field"
              value={formData.propertyAddress}
              onChange={e => setFormData({...formData, propertyAddress: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
            <input
              required
              type="number"
              placeholder="e.g. 500"
              className="input-field"
              value={formData.budget || ''}
              onChange={e => setFormData({...formData, budget: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue in detail..."
              className="input-field"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
