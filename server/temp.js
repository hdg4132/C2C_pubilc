const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'c2c',
  port: 3306,
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.post('/movie', (req, res) => {
    const { id, title, img, status, content } = req.body;
    const query = 'INSERT INTO yourtable (id, title, img, movie_status, content) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id, title, img, status, content], (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ message: 'Data inserted successfully', results });
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
