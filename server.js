// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from a 'public' folder

// MongoDB Connection (replace with your MongoDB URI)
const MONGODB_URI = 'mongodb://localhost:27017/fixmygear'; 
// For production, use an environment variable: process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Mongoose Schemas
const customerSchema = new mongoose.Schema({
  name: String,
  location: String,
  language: String,
  phone: { type: String, unique: true }
});
const Customer = mongoose.model('Customer', customerSchema);

const workerSchema = new mongoose.Schema({
  name: String,
  location: String,
  skills: [String],
  language: String,
  phone: { type: String, unique: true },
  available: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0 },
  verified: { type: Boolean, default: false },
  freeTime: [String]
});
const Worker = mongoose.model('Worker', workerSchema);

const jobSchema = new mongoose.Schema({
  customerId: String,
  workerName: String,
  service: String,
  status: { type: String, default: 'pending' }
});
const Job = mongoose.model('Job', jobSchema);

// Helper function for skill shortcodes
const skillMap = {
  'PL': 'plumber',
  'BIKE': 'bike',
  'ELEC': 'electrician'
};

// --- API Endpoints ---

// 1. Customer Registration
app.post('/customer/register', async (req, res) => {
  try {
    const { name, location, language, phone } = req.body;
    if (!name || !location || !phone) {
      return res.status(400).send('Please fill all fields.');
    }
    const newCustomer = new Customer({ name, location, language, phone });
    await newCustomer.save();
    res.status(201).send('Registered!');
  } catch (error) {
    res.status(500).send('Error registering customer.');
  }
});

// 2. Worker Registration
app.post('/worker/register', async (req, res) => {
  try {
    const { name, location, skills, language, phone, verification } = req.body;
    if (!name || !location || !skills || !phone) {
      return res.status(400).send('Please fill all fields.');
    }
    const parsedSkills = skills.toUpperCase().split(' ').map(code => skillMap[code]).filter(Boolean);
    const newWorker = new Worker({
      name,
      location,
      skills: parsedSkills,
      language,
      phone,
      verified: verification === 'on' // Checkbox value
    });
    await newWorker.save();
    res.status(201).send('Registered! Update availability below.');
  } catch (error) {
    res.status(500).send('Error registering worker.');
  }
});

// 3. Worker Availability Update
app.post('/worker/update', async (req, res) => {
  try {
    const { phone, availability, freeHours } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { phone },
      {
        available: availability === 'Available',
        freeTime: freeHours ? freeHours.split(',') : []
      }
    );
    if (!worker) return res.status(404).send('Worker not found.');
    res.send('Availability updated!');
  } catch (error) {
    res.status(500).send('Error updating availability.');
  }
});

// 4. Service Request and Matching
app.post('/request-service', async (req, res) => {
  try {
    const { service, location, phone } = req.body;
    const parsedService = skillMap[service.toUpperCase()];
    if (!parsedService) {
      return res.status(400).send('Invalid service code. Use PL, BIKE, or ELEC.');
    }

    const availableWorkers = await Worker.find({
      skills: { $in: [parsedService] },
      location,
      available: true
    }).limit(3);

    if (availableWorkers.length === 0) {
      return res.status(404).json({ message: 'No workers found.' });
    }

    res.json(availableWorkers.map(w => ({
      name: w.name,
      rating: w.rating,
      price: '₹150', // Mock price
      verified: w.verified
    })));
  } catch (error) {
    res.status(500).send('Error requesting service.');
  }
});

// 5. Booking (simulated)
app.post('/book-worker', async (req, res) => {
  try {
    const { customerPhone, workerName, service } = req.body;
    const newJob = new Job({
      customerId: customerPhone,
      workerName: workerName,
      service
    });
    await newJob.save();
    res.send(`Booked ${workerName}!`);
  } catch (error) {
    res.status(500).send('Error booking worker.');
  }
});

// 6. Admin Dashboard Data
app.get('/workers', async (req, res) => {
  const workers = await Worker.find({});
  res.json(workers);
});

app.get('/jobs', async (req, res) => {
  const jobs = await Job.find({});
  res.json(jobs);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});