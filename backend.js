
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());

/* CONEXIÓN DB */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conexión:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

/* API */

// GET
app.get('/contactos', (req, res) => {
  db.query('SELECT * FROM contactos', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST
app.post('/contactos', (req, res) => {
  const { name, phone, city, address, gender } = req.body;

  db.query(
    'INSERT INTO contactos (name, phone, city, address, gender) VALUES (?, ?, ?, ?, ?)',
    [name, phone, city, address, gender],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ ok: true });
    }
  );
});

// PUT
app.put('/contactos/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, city, address, gender } = req.body;

  db.query(
    'UPDATE contactos SET name=?, phone=?, city=?, address=?, gender=? WHERE id=?',
    [name, phone, city, address, gender, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ ok: true });
    }
  );
});

// DELETE
app.delete('/contactos/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM contactos WHERE id=?',
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ ok: true });
    }
  );
});

/* INICIO SERVIDOR */
app.listen(PORT, () => {
  console.log(`🚀 API en http://localhost:${PORT}`);
});
