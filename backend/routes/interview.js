import express from 'express';
import pool from '../database.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post('/saveInterview', authenticateToken, async (req, res) => {
  const { resumeText, jobDescription, responses } = req.body;
  const user_id = req.user.userId; // Extracted from the JWT

  const query = `
    INSERT INTO interviews (user_id, resume_text, job_description, responses)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [user_id, resumeText, jobDescription, responses]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving interview details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/interviews', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;

  const query = `
    SELECT * FROM interviews
    WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;