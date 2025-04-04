import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function DiaryList({ diaries = [], onDelete, onEdit }) {
  const getMoodColor = (mood) => {
    switch (mood) {
      case '행복':
        return 'success';
      case '평온':
        return 'info';
      case '슬픔':
        return 'error';
      case '화남':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={3}>
      {diaries.map((diary) => (
        <Grid item xs={12} key={diary._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" component="h2">
                  {diary.title}
                </Typography>
                <Box>
                  <IconButton onClick={() => onEdit(diary)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(diary._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {new Date(diary.date).toLocaleDateString()}
              </Typography>
              <Chip
                label={diary.mood}
                color={getMoodColor(diary.mood)}
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" component="p">
                {diary.content}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DiaryList; 