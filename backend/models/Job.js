const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Open', 
    enum: ['Open', 'Assigned', 'In Progress', 'Completed', 'Invoiced', 'Payment Initiated', 'Paid'] 
  },
  createdBy: { type: String, required: true }, // Storing Agent ID/Email
  agentPhone: { type: String, default: null },
  assignedTo: { type: String, default: null }, // Storing Contractor ID/Email
  contractorPhone: { type: String, default: null },
  price: { type: Number, default: null },
  budget: { type: Number, default: null },
  paymentMethod: { type: String, default: null },
  paymentId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
