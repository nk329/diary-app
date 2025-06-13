const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const db = require('./config/db');

dotenv.config();

const app = express();

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// CORS 설정
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// 라우트
app.use('/api/auth', authRoutes);

// 다이어리 라우트
// 모든 다이어리 조회
app.get('/api/diaries', async (req, res) => {
  try {
    const [diaries] = await db.query('SELECT * FROM diaries ORDER BY date DESC');
    res.json(diaries);
  } catch (error) {
    console.error('Error fetching diaries:', error);
    res.status(500).json({ message: error.message });
  }
});

// 새로운 다이어리 작성
app.post('/api/diaries', async (req, res) => {
  const { title, content, mood } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO diaries (title, content, mood, date) VALUES (?, ?, ?, NOW())',
      [title, content, mood]
    );
    const [newDiary] = await db.query('SELECT * FROM diaries WHERE id = ?', [result.insertId]);
    res.status(201).json(newDiary[0]);
  } catch (error) {
    console.error('Error adding diary:', error);
    res.status(400).json({ message: error.message });
  }
});

// 특정 다이어리 조회
app.get('/api/diaries/:id', async (req, res) => {
  try {
    const [diaries] = await db.query('SELECT * FROM diaries WHERE id = ?', [req.params.id]);
    if (diaries.length > 0) {
      res.json(diaries[0]);
    } else {
      res.status(404).json({ message: '다이어리를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error fetching diary:', error);
    res.status(500).json({ message: error.message });
  }
});

// 다이어리 수정
app.put('/api/diaries/:id', async (req, res) => {
  const { title, content, mood } = req.body;
  try {
    await db.query(
      'UPDATE diaries SET title = ?, content = ?, mood = ? WHERE id = ?',
      [title, content, mood, req.params.id]
    );
    const [updatedDiary] = await db.query('SELECT * FROM diaries WHERE id = ?', [req.params.id]);
    res.json(updatedDiary[0]);
  } catch (error) {
    console.error('Error updating diary:', error);
    res.status(400).json({ message: error.message });
  }
});

// 다이어리 삭제
app.delete('/api/diaries/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM diaries WHERE id = ?', [req.params.id]);
    res.json({ message: '다이어리가 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting diary:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 