const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  contractorEmail: { type: String, required: true },
  contractorName: { type: String, required: true },
  contractorPhone: { type: String, required: true },
  proposedPrice: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'accepted', 'rejected'] 
  },
}, { timestamps: true });

module.exports = mongoose.model('JobRequest', jobRequestSchema);
