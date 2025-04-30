const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
mongoose.connect('mongodb+srv://user1:malafiki@leodb.5mf7q.mongodb.net/?retryWrites=true&w=majority&appName=leodb', ).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ DB connection error:', err));

const espSchema = new mongoose.Schema({
  espName: String,
  foodName: String,
  price: Number,
}, { timestamps: true });

const ESP = mongoose.model('ESP', espSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // contains REGISTRATION.html, dashboard.html

app.post('/register-food', async (req, res) => {
  try {
    const { espName, foodName, price } = req.body;

    const existing = await ESP.findOne({ espName });
    if (existing) {
      return res.status(400).json({ message: 'ESP32 already registered.' });
    }

    const newDevice = new ESP({ espName, foodName, price });
    await newDevice.save();

    res.status(200).json({ message: 'Device registered.' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/get-devices', async (req, res) => {
  try {
    const devices = await ESP.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
