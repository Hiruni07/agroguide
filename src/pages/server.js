const express = require('express');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./auth');
const db         = require('./db');

const app  = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Auth routes may fail.');
}

// ── Middleware ─────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(express.json());

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

// ── Auth routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── User profile routes ────────────────────────────────────────
app.get('/api/profile', authMiddleware, (req, res) => {
  db.query(
    'SELECT id, firstName, lastName, email, role, createdAt FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (results.length === 0) return res.status(404).json({ message: 'User not found.' });
      res.json(results[0]);
    }
  );
});

app.put('/api/profile/update', authMiddleware, (req, res) => {
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  db.query(
    'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?',
    [firstName, lastName, email, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json({ message: 'Profile updated successfully.' });
    }
  );
});

// ── Diagnosis routes ───────────────────────────────────────────
app.get('/api/diagnoses/stats', authMiddleware, (req, res) => {
  db.query(
    'SELECT status, COUNT(*) as count FROM diagnoses WHERE userId = ? GROUP BY status',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });

      const stats = {
        totalDiagnoses: 0,
        treatedDiagnoses: 0,
        pendingDiagnoses: 0,
        criticalDiagnoses: 0,
      };

      results.forEach((row) => {
        stats.totalDiagnoses += row.count;
        if (row.status === 'treated') stats.treatedDiagnoses = row.count;
        if (row.status === 'pending') stats.pendingDiagnoses = row.count;
        if (row.status === 'critical') stats.criticalDiagnoses = row.count;
      });

      res.json(stats);
    }
  );
});

app.get('/api/diagnoses', authMiddleware, (req, res) => {
  db.query(
    'SELECT id, userId, plantName, notes, diseaseName, confidence, severity, status, createdAt FROM diagnoses WHERE userId = ? ORDER BY createdAt DESC',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json(results);
    }
  );
});

app.post('/api/diagnoses', authMiddleware, (req, res) => {
  const { plantName, notes } = req.body;
  if (!plantName || !plantName.trim()) {
    return res.status(400).json({ message: 'Plant name is required.' });
  }

  db.query(
    'INSERT INTO diagnoses (userId, plantName, notes, status, createdAt) VALUES (?, ?, ?, ?, NOW())',
    [req.user.id, plantName.trim(), notes || '', 'pending'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.status(201).json({ message: 'Diagnosis submitted successfully.', id: result.insertId });
    }
  );
});

app.delete('/api/diagnoses/:id', authMiddleware, (req, res) => {
  const diagId = req.params.id;
  db.query('SELECT userId FROM diagnoses WHERE id = ?', [diagId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ message: 'Diagnosis not found.' });
    if (results[0].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this diagnosis.' });
    }

    db.query('DELETE FROM diagnoses WHERE id = ?', [diagId], (deleteErr) => {
      if (deleteErr) return res.status(500).json({ message: 'Database error.' });
      res.json({ message: 'Diagnosis deleted successfully.' });
    });
  });
});

// ── Feedback routes ───────────────────────────────────────────
app.get('/api/feedback/my', authMiddleware, (req, res) => {
  db.query(
    'SELECT id, userId, rating, category, title, message, createdAt FROM feedback WHERE userId = ? ORDER BY createdAt DESC',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json(results);
    }
  );
});

app.post('/api/feedback', authMiddleware, (req, res) => {
  const { rating, category, title, message } = req.body;
  if (!rating || !title || !message) {
    return res.status(400).json({ message: 'Rating, title, and message are required.' });
  }

  db.query(
    'INSERT INTO feedback (userId, rating, category, title, message, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
    [req.user.id, rating, category || 'General', title.trim(), message.trim()],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.status(201).json({ message: 'Feedback submitted successfully.', id: result.insertId });
    }
  );
});

app.get('/feedback-public', (req, res) => {
  db.query(
    `SELECT f.rating, f.category, f.title, f.message, f.createdAt,
            CONCAT(u.firstName, ' ', u.lastName) AS author
     FROM feedback f
     JOIN users u ON u.id = f.userId
     ORDER BY f.createdAt DESC
     LIMIT 6`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json(results.map(row => ({
        rating: row.rating,
        category: row.category,
        title: row.title,
        message: row.message,
        createdAt: row.createdAt,
        author: row.author,
      })));
    }
  );
});

app.get('/api/feedback/recent', (req, res) => {
  db.query(
    `SELECT f.rating, f.category, f.title, f.message, f.createdAt,
            CONCAT(u.firstName, ' ', u.lastName) AS author
     FROM feedback f
     JOIN users u ON u.id = f.userId
     ORDER BY f.createdAt DESC
     LIMIT 6`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json(results.map(row => ({
        rating: row.rating,
        category: row.category,
        title: row.title,
        message: row.message,
        createdAt: row.createdAt,
        author: row.author,
      })));
    }
  );
});

// ── Admin routes ──────────────────────────────────────────────
app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  db.query('SELECT status, COUNT(*) as count FROM diagnoses GROUP BY status', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    const stats = {
      totalDiagnoses: 0,
      treatedDiagnoses: 0,
      pendingDiagnoses: 0,
      criticalDiagnoses: 0,
    };

    results.forEach((row) => {
      stats.totalDiagnoses += row.count;
      if (row.status === 'treated') stats.treatedDiagnoses = row.count;
      if (row.status === 'pending') stats.pendingDiagnoses = row.count;
      if (row.status === 'critical') stats.criticalDiagnoses = row.count;
    });

    res.json(stats);
  });
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  db.query('SELECT id, firstName, lastName, email, role, createdAt FROM users ORDER BY createdAt DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    res.json(results);
  });
});

app.get('/api/admin/diagnoses', authMiddleware, adminMiddleware, (req, res) => {
  db.query(
    `SELECT d.id, d.plantName, d.notes, d.diseaseName, d.confidence, d.severity, d.status, d.createdAt,
            u.id AS userId, u.firstName, u.lastName, u.email, u.role
     FROM diagnoses d
     JOIN users u ON u.id = d.userId
     ORDER BY d.createdAt DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.json(results);
    }
  );
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM feedback WHERE userId = ?', [userId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    db.query('DELETE FROM diagnoses WHERE userId = ?', [userId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Database error.' });
      db.query('DELETE FROM users WHERE id = ?', [userId], (err3, result) => {
        if (err3) return res.status(500).json({ message: 'Database error.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User deleted successfully.' });
      });
    });
  });
});

app.delete('/api/admin/diagnoses/:id', authMiddleware, adminMiddleware, (req, res) => {
  db.query('DELETE FROM diagnoses WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Diagnosis not found.' });
    res.json({ message: 'Diagnosis deleted successfully.' });
  });
});

app.put('/api/admin/diagnoses/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { diseaseName, confidence, severity, status, notes } = req.body;
  const fields = [];
  const values = [];

  if (typeof diseaseName === 'string') { fields.push('diseaseName = ?'); values.push(diseaseName.trim()); }
  if (typeof confidence === 'number') { fields.push('confidence = ?'); values.push(confidence); }
  if (typeof severity === 'string') { fields.push('severity = ?'); values.push(severity.trim()); }
  if (typeof status === 'string') { fields.push('status = ?'); values.push(status.trim()); }
  if (typeof notes === 'string') { fields.push('notes = ?'); values.push(notes.trim()); }

  if (!fields.length) {
    return res.status(400).json({ message: 'No fields provided to update.' });
  }

  values.push(req.params.id);
  db.query(`UPDATE diagnoses SET ${fields.join(', ')} WHERE id = ?`, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Diagnosis not found.' });
    res.json({ message: 'Diagnosis updated successfully.' });
  });
});

// ── Test route ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'AgroGuide AI Backend is running!' });
});

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test it: http://localhost:${PORT}`);
});
