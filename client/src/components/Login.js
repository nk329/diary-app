import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('로그인 시도:', formData);

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      console.log('로그인 응답:', response.data);

      localStorage.setItem('token', response.data.token);
      navigate('/diary');
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            로그인
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              로그인
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              회원가입
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 