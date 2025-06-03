const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

router.post('/', (req, res) => {
  const { name, nationalId, age, governorate, qualification, job, mobile, recitationType } = req.body;

  // Validate required fields
  if (!name || !nationalId || !mobile || !recitationType) {
    return res.status(400).json({ error: 'Name, National ID, Mobile, and Recitation Type are required.' });
  }

  const query = `
    INSERT INTO submissions (name, nationalId, age, governorate, qualification, job, mobile, recitationType) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, nationalId, age, governorate, qualification, job, mobile, recitationType], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(200).json({ id: this.lastID });
  });
});

const STATIC_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // Replace with this hard random key

router.get('/sequence', (req, res) => {
  const { key } = req.query; // Expect the key as a query parameter

  // Validate the static key
  if (key !== STATIC_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid access key.' });
  }

  const query = `SELECT * FROM sqlite_sequence`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(200).json(rows);
  });
});

router.get('/data', (req, res) => {
  const { key } = req.query; // Expect the key as a query parameter
  const STATIC_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // Replace with this hard random key

  // Validate the static key
  if (key !== STATIC_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid access key.' });
  }

  const query = `SELECT * FROM submissions`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(200).json(rows);
  });
});

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Awkaf Form!');
});

module.exports = router;
