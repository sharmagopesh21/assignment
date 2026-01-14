import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('app-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [jobs, setJobs] = useState([]);
  const [invoices, setInvoices] = useState([]); // Invoices are now part of jobs in DB, but keeping for UI compatibility if needed
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user) {
        localStorage.setItem('app-user', JSON.stringify(user));
        fetchJobs();
    } else {
        localStorage.removeItem('app-user');
        setJobs([]);
    }
  }, [user]);

  const fetchJobs = async () => {
      try {
          const res = await api.get('/jobs');
          setJobs(res.data);
      } catch (err) {
          console.error("Failed to fetch jobs", err);
      }
  };

  const fetchRequests = async () => {
      try {
          const res = await api.get('/requests');
          setRequests(res.data);
      } catch (err) {
          console.error("Failed to fetch requests", err);
      }
  };

  const login = async (email, password, role) => {
    try {
        const res = await api.post('/auth/login', { email, password, role });
        setUser(res.data.user);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
        await api.post('/auth/register', userData);
        // Do not setUser here, let user login manually
        return { success: true };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => setUser(null);

  const addJob = async (jobData) => {
    try {
        const res = await api.post('/jobs', { ...jobData, createdBy: user.email, agentPhone: user.phone });
        setJobs(prev => [res.data, ...prev]);
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
  };

  const updateJobStatus = async (jobId, status, extraData = {}) => {
    try {
        const res = await api.patch(`/jobs/${jobId}`, { status, ...extraData });
        setJobs(prev => prev.map(job => 
            job._id === jobId ? res.data : job
        )); // Mongo uses _id
    } catch (err) {
        console.error("Update failed", err);
    }
  };

  const deleteJob = async (jobId) => {
    try {
        await api.delete(`/jobs/${jobId}`);
        setJobs(prev => prev.filter(job => job._id !== jobId));
        return { success: true };
    } catch (err) {
        console.error("Delete failed", err);
        return { success: false, message: err.response?.data?.message || 'Delete failed' };
    }
  };

  const assignJob = (jobId, contractorId, price, contractorPhone) => {
    updateJobStatus(jobId, 'Assigned', { assignedTo: contractorId, price, contractorPhone });
  };

  const createInvoice = (invoiceData) => {
      // In this simple version, we just update the job status and price
      console.log("Invoice created", invoiceData);
  };

  // Request management functions
  const createRequest = async (requestData) => {
    try {
      const res = await api.post('/requests', requestData);
      setRequests(prev => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Failed to create request", err);
      return { success: false };
    }
  };

  const fetchRequestsForJob = async (jobId) => {
    try {
      const res = await api.get(`/requests/job/${jobId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch requests", err);
      return [];
    }
  };

  const acceptRequest = async (requestId, jobId, contractorEmail, price, contractorPhone) => {
    try {
      // Update request status
      await api.patch(`/requests/${requestId}`, { status: 'accepted' });
      // Assign the job
      await assignJob(jobId, contractorEmail, price, contractorPhone);
      // Reject all other pending requests for this job
      const allRequests = await fetchRequestsForJob(jobId);
      const otherRequests = allRequests.filter(r => r._id !== requestId && r.status === 'pending');
      for (const req of otherRequests) {
        await api.patch(`/requests/${req._id}`, { status: 'rejected' });
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to accept request", err);
      return { success: false };
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await api.patch(`/requests/${requestId}`, { status: 'rejected' });
      return { success: true };
    } catch (err) {
      console.error("Failed to reject request", err);
      return { success: false };
    }
  };

  const fetchContractorJobs = (contractorEmail) => {
    // Filter jobs assigned to this contractor
    return jobs.filter(job => job.assignedTo === contractorEmail);
  };

  return (
    <StoreContext.Provider value={{ 
      user, users: [], login, register, logout, // users list not exposed in API version
      jobs, addJob, updateJobStatus, deleteJob, assignJob, fetchJobs,
      invoices, createInvoice,
      requests, createRequest, fetchRequestsForJob, acceptRequest, rejectRequest, fetchRequests,
      fetchContractorJobs
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
