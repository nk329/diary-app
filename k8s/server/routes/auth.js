const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 이메일 중복 체크
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해시화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('로그인 요청 받음:', { email });

    // 사용자 찾기
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    console.log('데이터베이스 조회 결과:', { usersFound: users.length });

    if (users.length === 0) {
      console.log('사용자를 찾을 수 없음:', email);
      return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = users[0];
    console.log('사용자 찾음:', { userId: user.id, email: user.email });

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('비밀번호 확인 결과:', { isMatch });

    if (!isMatch) {
      console.log('비밀번호 불일치');
      return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT 토큰 생성 완료');

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    console.log('로그인 성공:', { userId: user.id, email: user.email });
  } catch (error) {
    console.error('로그인 처리 중 에러 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 