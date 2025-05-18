require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const RedisStore = require('connect-redis').default;
const redisClient = require('./src/redis/redisClient');
const authRoutes = require('./src/routes/authRoutes');
const connectDb = require("./src/db/index"); 
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({ origin: 'https://sweet-twilight-f60d5f.netlify.app',credentials: true}));
// https://sweet-twilight-f60d5f.netlify.app
// http://localhost:3000
app.use(express.json());
app.use(cookieParser());



connectDb()


// app.use(session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 30 }
// }));

app.use(session({
  secret: "test", // Secret key to encrypt session
  resave: true, // Don't save session if unchanged
  saveUninitialized: true, // Don't save empty sessions
  cookie: { 
    secure: false,    
    httpOnly: true, 
    sameSite: "lax"
  } 
}));

// app.use(
//   session({
//     secret: "test", // Secret key
//     resave: true,
//     saveUninitialized: true,
//     cookie: { 
//       secure: true,          // 🔥 MUST be true for HTTPS
//       httpOnly: true,
//       sameSite: "None"       // 🔥 allow cross-site cookies between Netlify + Render
//     }
//   })
// );
// app.set('trust proxy', 1);


app.use('/auth', authRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.head('/ping', (req, res) => {
  res.status(200).end(); 
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle shutdown properly
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});