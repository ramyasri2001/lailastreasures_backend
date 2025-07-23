require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));
app.get('/', (req, res) => {
  res.send("Laila's Treasures Backend is Running");
});

// ✅ Route Setup
app.use('/api/users', userRoutes); // All user-related routes

app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});