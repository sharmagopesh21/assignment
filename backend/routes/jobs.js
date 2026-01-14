const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobRequest = require('../models/JobRequest');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a job
router.post('/', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Job (Status, Assignment, Price)
router.patch('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Job (only if unassigned)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the job is assigned
    if (job.assignedTo || job.status !== 'Open') {
      // Small exception: if status is 'Open' but 'Interest Expressed' (which is UI logic usually, but let's check DB status)
      // Actually per models/Job.js, status 'Open' is the only one before 'Assigned'
      if (job.status !== 'Open') {
        return res.status(400).json({ message: 'Cannot delete job that is already assigned or in progress' });
      }
    }

    // Delete associated requests
    await JobRequest.deleteMany({ jobId: req.params.id });

    // Delete the job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job and associated requests deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
