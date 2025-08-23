require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const devMakeAdmin = require('./routes/devMakeAdmin');

const app = express();

app.use('/api',devMakeAdmin);

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
    const ok = !origin ||['https://lailastreasures.netlify.app','http:localhost:5500']
    cb(ok? null: new Error('Not allowed by CORS'),ok);
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
app.use('/api/users',  require("./routes/userRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/messages', require("./routes/messageRoutes"));
app.use('/api/order',    require ("./routes/orderRoutes"));  
app.use('/api/cart', require("./routes/cartRoutes"));

/* ---------- Root ---------- */
app.get('/', (_req, res) => {
  res.send("Laila's Treasures Backend is Running");
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});