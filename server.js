require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Enable CORS for Netlify frontend
const corsOptions = {
  origin: 'https://lailastreasures.netlify.app', // your Netlify frontend
  credentials: true,
};
app.options('*',cors(corsOptions));
app.use(cors(corsOptions));

// ✅ Parse JSON
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Routes
app.use('/api/users', userRoutes);

// ✅ Root endpoint (optional)
app.get('/', (req, res) => {
  res.send('Laila\'s Treasures Backend is Running');
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});