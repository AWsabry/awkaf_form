require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const formRouter = require('./routes/form');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', formRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
