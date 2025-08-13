require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const orderRoutes   = require('./routes/orderRoutes');

const app = express();

/* ---------- Trust proxy (needed for secure cookies on Render/Netlify) ---------- */
app.set('trust proxy', 1);

/* ---------- CORS (single, correct block) ---------- */
const allowedOrigins = [
  'https://lailastreasures.netlify.app',
  'http://localhost:5500',
];

app.use(cors({
  origin(origin, cb) {
    // allow same-origin & tools that send no origin (curl, health checks)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // allow cookies/credentials
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Make sure preflight succeeds
app.options('*', cors());

/* ---------- Body & cookies ---------- */
app.use(express.json());
app.use(cookieParser());

/* ---------- MongoDB ---------- */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

/* ---------- Routes ---------- */
app.use('/api/users',    userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/order',    orderRoutes);  // keep as you have now

/* ---------- Root ---------- */
app.get('/', (_req, res) => {
  res.send("Laila's Treasures Backend is Running");
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});