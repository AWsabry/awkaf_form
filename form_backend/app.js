require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const formRouter = require('./routes/form');

const app = express();
app.use(cors({
  origin: [
    'http://15.237.144.99:3000', 
    'http://15.237.144.99',
    'http://localhost:3000',  // Fixed: added http:// protocol
    'http://localhost:5000'   // Add your backend URL if needed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Added Authorization header
}));

app.use(bodyParser.json());

app.use('/', formRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
