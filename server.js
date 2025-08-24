// server.js
require('dotenv').config();

const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');

const app = express();

/* ------------------------------------------------------------------ */
/* Trust proxy (needed so 'secure' cookies work behind Render's proxy) */
/* ------------------------------------------------------------------ */
app.set('trust proxy', 1);

/* ---------------------- Body & cookie parsers ---------------------- */
app.use(express.json());
app.use(cookieParser());

/* ------------------------------ CORS ------------------------------- */
/* Netlify -> Render needs credentials + a proper origin whitelist
   IMPORTANT: keep Netlify origin EXACT, and use SAME options for OPTIONS */
const allowedOrigins = new Set([
  'https://lailastreasures.netlify.app', // deployed frontend
  'http://localhost:5500',               // local dev (Live Server)
  'http://127.0.0.1:5500',
]);

function corsOrigin(origin, cb) {
  // allow same-origin/no-origin (curl, health checks)
  if (!origin || allowedOrigins.has(origin)) return cb(null, true);
  return cb(new Error('Not allowed by CORS'), false);
}

const corsOpts = {
  origin: corsOrigin,
  credentials: true, // allow cookies
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOpts));
app.options('*', cors(corsOpts)); // preflight with the SAME options

/* ---------------------------- MongoDB ------------------------------ */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/* ------------------------------ Routes ----------------------------- */
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/products',  require('./routes/productRoutes'));
app.use('/api/messages',  require('./routes/messageRoutes'));
app.use('/api/order',     require('./routes/orderRoutes'));
app.use('/api/cart',      require('./routes/cartRoutes'));
app.use('/api/chat',      require('./routes/chatRoutes'));
app.use('/api/sections',  require('./routes/sectionRoutes'));

/* ------------------------------- Root ------------------------------ */
app.get('/', (_req, res) => {
  res.send("Laila's Treasures Backend is Running");
});

/* ------------------------------ Start ------------------------------ */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});