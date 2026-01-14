const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');

// Create a new job request
router.post('/', async (req, res) => {
  try {
    const newRequest = new JobRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all requests for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const requests = await JobRequest.find({ jobId: req.params.jobId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all requests (for admin/debugging)
router.get('/', async (req, res) => {
  try {
    const requests = await JobRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update request status (accept/reject)
router.patch('/:id', async (req, res) => {
  try {
    const updatedRequest = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
