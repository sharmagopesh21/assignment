const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User({ name, email, password, phone, role });
    await newUser.save();
    
    // Return user without password
    const { password: _, ...userWithoutPass } = newUser.toObject();
    res.status(201).json({ success: true, user: userWithoutPass });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Simple password check (In prod use bcrypt)
    if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPass } = user.toObject();
    res.json({ success: true, user: userWithoutPass });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
