const express = require('express');
require('dotenv').config();
require('./jobs/cronJobs');
const db = require('./config/mongoose-connection');

const app = express();
const expressSession = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const PORT = process.env.PORT || 3000;

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




const allowedOrigins = [
  'http://localhost:5173',
  'https://e-bachatgat.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') || null;
  res.locals.error_msg = req.flash('error_msg') || null;
  next();
});


app.use('/', require('./routes/memberRoutes'));
app.use('/president', require('./routes/presidentRoutes'));
app.use('/loan', require('./routes/loanRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/treasurer', require('./routes/treasurerRoutes'));
app.use('/secretary', require('./routes/secretaryRoutes'));
app.use('/otp', require('./routes/otp'));
app.use('/online', require('./routes/paymentRoutes'));

app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
