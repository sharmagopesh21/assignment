/* eslint-disable react-refresh/only-export-components */
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, MapPin, User, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, user, assignJob, updateJobStatus, createInvoice, createRequest, fetchRequestsForJob, acceptRequest, rejectRequest } = useStore();
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [acceptPrice, setAcceptPrice] = useState('');
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [jobRequests, setJobRequests] = useState([]);
  const [myRequest, setMyRequest] = useState(null);

  const job = jobs.find(j => j._id === id);

  const isAgent = user?.role === 'agent';
  const isContractor = user?.role === 'contractor';
  const isAssignedToMe = isContractor && job?.assignedTo === user?.email;

  useEffect(() => {
    if (!job || !user) return; // Don't load requests if job or user not loaded yet
    
    const loadRequests = async () => {
      const requests = await fetchRequestsForJob(id);
      setJobRequests(requests);
      // Find my request if I'm a contractor
      if (isContractor && user?.email) {
        const myReq = requests.find(r => r.contractorEmail === user.email);
        setMyRequest(myReq || null);
      }
    };
    loadRequests();
  }, [id, job, user, isContractor]);

  if (!job) return <div className="text-center py-20 text-gray-500">Job not found</div>;
  if (!user) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  const handleSubmitRequest = async (e) => {
      e.preventDefault();
      const result = await createRequest({
        jobId: job._id,
        contractorEmail: user.email,
        contractorName: user.name,
        contractorPhone: user.phone,
        proposedPrice: parseFloat(acceptPrice)
      });
      if (result.success) {
        setMyRequest(result.data);
        setShowAcceptForm(false);
        setAcceptPrice('');
      }
  };

  const handleAcceptRequest = async (requestId, contractorEmail, price, contractorPhone) => {
    const result = await acceptRequest(requestId, job._id, contractorEmail, price, contractorPhone);
    if (result.success) {
      // Refresh requests
      const requests = await fetchRequestsForJob(id);
      setJobRequests(requests);
    }
  };

  const handleRejectRequest = async (requestId) => {
    await rejectRequest(requestId);
    // Refresh requests
    const requests = await fetchRequestsForJob(id);
    setJobRequests(requests);
  };


  const handleViewHistory = (contractorEmail) => {
    navigate(`/contractor-history/${encodeURIComponent(contractorEmail)}`);
  };

  const handleStatusChange = (newStatus) => {
      updateJobStatus(job._id, newStatus);
  };

  const handleInvoiceSubmit = (e) => {
      e.preventDefault();
      createInvoice({
          jobId: job._id,
          contractorId: user.email,
          amount: parseFloat(invoiceAmount),
          details: `Invoice for ${job.title}`,
          paymentMethod,
          paymentId
      });
      updateJobStatus(job._id, 'Invoiced', { 
          price: parseFloat(invoiceAmount),
          paymentMethod,
          paymentId
      });
      setShowInvoiceForm(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add branding
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald-600
    doc.text('Payment Receipt', 105, 20, { align: 'center' });
    
    // Header Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Receipt ID: ${job._id.toUpperCase()}`, 105, 28, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 34, { align: 'center' });
    
    // Divider
    doc.setDrawColor(230);
    doc.line(20, 40, 190, 40);
    
    // Job Title & Status
    doc.setFontSize(16);
    doc.setTextColor(30);
    doc.text(job.title, 20, 55);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('STATUS: PAID', 190, 55, { align: 'right' });
    doc.setFont(undefined, 'normal');

    // Details Table
    const tableData = [
      ['Service Property', job.propertyAddress],
      ['Service Description', job.description],
      ['Agent (Client)', job.createdBy],
      ['Contractor (Provider)', job.assignedTo],
      ['Total Amount Paid', `$${job.price}`],
      ['Payment Method', job.paymentMethod || 'N/A'],
      ['Transaction ID', job.paymentId || 'N/A']
    ];

    autoTable(doc, {
      startY: 65,
      head: [['Field', 'Details']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 20, right: 20 },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for using our Job Management System.', 105, finalY, { align: 'center' });
    doc.text('This is an electronically generated receipt.', 105, finalY + 6, { align: 'center' });

    doc.save(`Receipt_${job.title.replace(/\s+/g, '_')}_${job._id.slice(-6)}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="glass-card mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={job.status} />
                <span className="text-xs text-gray-400 font-mono">#{job._id.slice(-6)}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} /> {job.propertyAddress}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
             {/* Contractor - Show request form if no request exists */}
             {isContractor && job.status === 'Open' && !myRequest && !showAcceptForm && (
                  <button onClick={() => setShowAcceptForm(true)} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                      Express Interest
                  </button>
             )}

             {/* Contractor - Request form */}
             {isContractor && job.status === 'Open' && !myRequest && showAcceptForm && (
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Propose Budget</h4>
                    <form onSubmit={handleSubmitRequest} className="space-y-2">
                        <div className="relative">
                            <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
                                placeholder="Your proposed price"
                                value={acceptPrice}
                                onChange={e => setAcceptPrice(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowAcceptForm(false)} className="flex-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 px-2 py-1 text-xs text-white bg-emerald-600 rounded hover:bg-emerald-700">Submit Request</button>
                        </div>
                    </form>
                </div>
             )}

             {/* Contractor - Request status display */}
             {isContractor && myRequest && (
                <div className={`p-3 rounded-lg border ${
                  myRequest.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 
                  myRequest.status === 'accepted' ? 'bg-green-50 border-green-200' : 
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="text-sm font-semibold mb-1">
                    {myRequest.status === 'pending' && '⏳ Request Pending'}
                    {myRequest.status === 'accepted' && '✅ Request Accepted'}
                    {myRequest.status === 'rejected' && '❌ Request Rejected'}
                  </div>
                  <div className="text-xs text-gray-600">
                    Proposed: ${myRequest.proposedPrice}
                  </div>
                  {myRequest.status === 'rejected' && (
                    <button 
                      onClick={() => setMyRequest(null)} 
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      Submit new request
                    </button>
                  )}
                </div>
             )}
             
             {isAssignedToMe && job.status === 'Assigned' && (
                  <button onClick={() => handleStatusChange('In Progress')} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                      Start Work
                  </button>
             )}

            {isAssignedToMe && job.status === 'In Progress' && (
                  <button onClick={() => handleStatusChange('Completed')} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                      Mark Completed
                  </button>
             )}

            {isAssignedToMe && job.status === 'Completed' && !showInvoiceForm && (
                  <button onClick={() => setShowInvoiceForm(true)} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
                      Raise Invoice
                  </button>
             )}
             
             {isAssignedToMe && job.status === 'Invoiced' && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-center text-sm font-medium border border-emerald-200">
                      Invoice Submitted
                  </div>
             )}

              {isAgent && job.status === 'Invoiced' && (
                  <button onClick={() => handleStatusChange('Payment Initiated')} className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700">
                      Initiate Payment
                  </button>
              )}

              {isAssignedToMe && job.status === 'Payment Initiated' && (
                  <div className="space-y-3">
                      <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg text-center text-sm font-medium border border-indigo-200">
                          Payment Initiated by Agent
                      </div>
                      <div className="flex gap-2">
                          <button 
                              onClick={() => handleStatusChange('Paid')} 
                              className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-700 font-bold py-2"
                          >
                              Confirm Received
                          </button>
                          <button 
                              onClick={() => handleStatusChange('Invoiced')} 
                              className="flex-1 btn-secondary border-red-200 text-red-600 hover:bg-red-50 py-2"
                          >
                              Not Received
                          </button>
                      </div>
                  </div>
              )}

              {isAgent && job.status === 'Payment Initiated' && (
                  <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg text-center text-sm font-medium border border-indigo-200">
                      Payment Initiated. Awaiting Contractor Confirmation.
                  </div>
              )}
              
              {(isAgent || isAssignedToMe) && job.status === 'Paid' && (
                  <div className="space-y-3">
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-center text-sm font-medium border border-emerald-200">
                          Payment Completed
                      </div>
                      <button 
                          onClick={handleDownloadPDF}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-bold"
                      >
                          <Download size={18} /> Download Receipt (PDF)
                      </button>
                  </div>
              )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-sm font-uppercase text-gray-500 font-bold tracking-wider mb-2">DESCRIPTION</h3>
                    <p className="text-gray-700 leading-relaxed bg-white/40 p-4 rounded-lg border border-gray-100">
                        {job.description}
                    </p>
                </div>

                {/* Agent - Pending Requests */}
                {isAgent && job.status === 'Open' && jobRequests.filter(r => r.status === 'pending').length > 0 && (
                    <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-indigo-100">
                        <h3 className="font-bold text-lg mb-4 text-indigo-900">
                            Pending Requests ({jobRequests.filter(r => r.status === 'pending').length})
                        </h3>
                        <div className="space-y-3">
                            {jobRequests.filter(r => r.status === 'pending').map(request => (
                                <div key={request._id} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="font-semibold text-gray-900">{request.contractorName}</div>
                                            <div className="text-sm text-gray-600">{request.contractorEmail}</div>
                                            <div className="text-sm font-bold text-indigo-600 mt-1">
                                                Proposed: ${request.proposedPrice}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(request.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleViewHistory(request.contractorEmail)}
                                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                        >
                                            View History
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAcceptRequest(request._id, request.contractorEmail, request.proposedPrice, request.contractorPhone)}
                                            className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleRejectRequest(request._id)}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isAssignedToMe && showInvoiceForm && (
                    <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-lg mb-4">Submit Invoice</h3>
                        <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</div>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        step="0.01"
                                        className="input-field pl-8" 
                                        value={invoiceAmount}
                                        onChange={e => setInvoiceAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Paytm, PhonePe"
                                        required
                                        className="input-field" 
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID / Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="Mobile or ID"
                                        required
                                        className="input-field" 
                                        value={paymentId}
                                        onChange={e => setPaymentId(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowInvoiceForm(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700">Send Invoice</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-uppercase text-gray-500 font-bold tracking-wider mb-3">JOB DETAILS</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-500">Date Posted</span>
                            <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                         {job.assignedTo && (
                            <>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span className="text-gray-500">Contractor Email</span>
                                    <span className="font-medium text-emerald-600">{job.assignedTo}</span>
                                </div>
                                {job.contractorPhone && (isAgent || isAssignedToMe) && (
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="text-gray-500">Contractor Ph.</span>
                                        <span className="font-medium text-gray-900">{job.contractorPhone}</span>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-500">Agent Email</span>
                            <span className="font-medium text-indigo-600">{job.createdBy}</span>
                        </div>
                        {job.agentPhone && (isAgent || isAssignedToMe) && (
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-gray-500">Agent Ph.</span>
                                <span className="font-medium text-gray-900">{job.agentPhone}</span>
                            </div>
                        )}
                         {job.price && (
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-gray-500">Invoice Amount</span>
                                <span className="font-bold text-gray-900">${job.price}</span>
                            </div>
                        )}
                        {job.budget && (
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-gray-500">Budget</span>
                                <span className="font-bold text-gray-900">${job.budget}</span>
                            </div>
                        )}
                        {job.paymentMethod && (
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-gray-500">Payment Via</span>
                                <span className="font-medium text-indigo-600">{job.paymentMethod}</span>
                            </div>
                        )}
                        {job.paymentId && (
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-gray-500">Payment ID</span>
                                <span className="font-medium text-gray-900">{job.paymentId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
