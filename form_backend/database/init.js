// db/init.js (optional for setup)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nationalId TEXT NOT NULL,
      age INTEGER,
      governorate TEXT,
      qualification TEXT,
      job TEXT,
      mobile TEXT NOT NULL,
      recitationType TEXT NOT NULL
    )
  `);

  // Retrieve data from sqlite_sequence table
  db.all(`SELECT * FROM sqlite_sequence`, (err, rows) => {
    if (err) {
      console.error('Error retrieving sqlite_sequence:', err);
    } else {
      console.log('sqlite_sequence data:', rows);
    }
  });

    // Retrieve data from submissions table
  db.all(`SELECT * FROM submissions`, (err, rows) => {
    if (err) {
      console.error('Error retrieving submissions:', err);
    } else {
      console.log('submissions data:', rows);
    }
  });
});



db.close();

