require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const app = express();

const allowedOrigins = [
  'https://lailastreasures.netlify.app',
  'https://localhost:3000'
];
app.use(cors({
  origin: function (origin,callback){
    if (!origin || allowedOrigins.includes(origin)){
      callback(null,true);
    } else{
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// ✅ Enable CORS for Netlify frontend
const corsOptions = {
  origin: function (origin,cb) {
    const allowed = [
      'https://lailastreasures.netlify.app', // your Netlify frontend
      'http://localhost:5500',
    ];
    if(!origin||allowed.includes(origin)) cb(null,true);
    else cb(new Error('Not allowed by CORS'));
  },
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
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);

// ✅ Root endpoint (optional)
app.get('/', (req, res) => {
  res.send('Laila\'s Treasures Backend is Running');
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});