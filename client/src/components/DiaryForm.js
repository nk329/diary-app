import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';

const moods = ['행복', '평온', '슬픔', '화남', '중립'];

function DiaryForm({ onSubmit, onUpdate, editingDiary, setEditingDiary }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
  });

  useEffect(() => {
    if (editingDiary) {
      setFormData({
        title: editingDiary.title,
        content: editingDiary.content,
        mood: editingDiary.mood,
      });
    }
  }, [editingDiary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDiary) {
      onUpdate(editingDiary._id, formData);
    } else {
      onSubmit(formData);
    }
    setFormData({
      title: '',
      content: '',
      mood: '',
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {editingDiary ? '다이어리 수정' : '새로운 다이어리 작성'}
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
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>기분</InputLabel>
          <Select
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            label="기분"
            required
          >
            {moods.map((mood) => (
              <MenuItem key={mood} value={mood}>
                {mood}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {editingDiary ? '수정하기' : '작성하기'}
          </Button>
          {editingDiary && (
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setEditingDiary(null)}
            >
              취소
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default DiaryForm; 