import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Diary() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'happy',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchDiaries = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/diaries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/diaries', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData({ title: '', content: '', mood: 'happy', date: new Date().toISOString().split('T')[0] });
      fetchDiaries();
    } catch (error) {
      console.error('Error creating diary:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            나의 다이어리
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                새로운 다이어리 작성
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="제목"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="내용"
                  name="content"
                  multiline
                  rows={4}
                  value={formData.content}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>기분</InputLabel>
                  <Select
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    label="기분"
                  >
                    <MenuItem value="happy">행복</MenuItem>
                    <MenuItem value="sad">슬픔</MenuItem>
                    <MenuItem value="angry">화남</MenuItem>
                    <MenuItem value="peaceful">평온</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="날짜"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  저장하기
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              다이어리 목록
            </Typography>
            <Grid container spacing={2}>
              {diaries.map((diary) => (
                <Grid item xs={12} key={diary.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {diary.title}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {new Date(diary.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">
                        {diary.content}
                      </Typography>
                      <Typography color="textSecondary" sx={{ mt: 1 }}>
                        기분: {diary.mood}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Diary; 