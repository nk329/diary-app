import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Diary from './components/Diary';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [diaries, setDiaries] = useState([]);
  const [editingDiary, setEditingDiary] = useState(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/diaries`);
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };

  const handleAddDiary = async (diary) => {
    try {
      const response = await axios.post(`${API_URL}/api/diaries`, diary);
      setDiaries([response.data, ...diaries]);
    } catch (error) {
      console.error('Error adding diary:', error);
    }
  };

  const handleUpdateDiary = async (id, updatedDiary) => {
    try {
      const response = await axios.put(`${API_URL}/api/diaries/${id}`, updatedDiary);
      setDiaries(diaries.map(diary => 
        diary._id === id ? response.data : diary
      ));
      setEditingDiary(null);
    } catch (error) {
      console.error('Error updating diary:', error);
    }
  };

  const handleDeleteDiary = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/diaries/${id}`);
      setDiaries(diaries.filter(diary => diary._id !== id));
    } catch (error) {
      console.error('Error deleting diary:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center">
              나의 다이어리
            </Typography>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/" element={
                <>
                  <DiaryForm 
                    onSubmit={handleAddDiary}
                    onUpdate={handleUpdateDiary}
                    editingDiary={editingDiary}
                    setEditingDiary={setEditingDiary}
                  />
                  <DiaryList 
                    diaries={diaries}
                    onDelete={handleDeleteDiary}
                    onEdit={setEditingDiary}
                  />
                </>
              } />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
