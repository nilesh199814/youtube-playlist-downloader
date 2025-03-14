const express = require('express');
const cors = require('cors');
const rateLimitMiddleware = require('./middleware/rateLimiter');
const { downloadPlaylistHandler } = require('./controllers/downloadController');

const app = express();

// CORS configuration: Allow all origins and all methods
const corsOptions = {
  origin: '*', // Allow all origins
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Allow all common HTTP methods
  // allowedHeaders: ['Content-Type'], // Allow Content-Type header (for JSON requests)
  // optionsSuccessStatus: 200 // For legacy browser support
};

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
// app.use(rateLimitMiddleware);

app.get('/api/status', (req, res) => {
  res.json({ message: 'Server is running' });
})
app.post('/api/download-playlist', downloadPlaylistHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;