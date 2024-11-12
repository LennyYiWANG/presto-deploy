import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ name, description, thumbnail, slidesCount }) {
  return (
    <Card sx={{ width: '100%', aspectRatio: '2 / 1', minWidth: 100, display: 'flex' }}>
      <CardMedia
        sx={{ width: '50%', bgcolor: thumbnail ? 'transparent' : 'grey.400' }}
        image={thumbnail || 'https://via.placeholder.com/150/cccccc?text=No+Image'} // 使用占位图像作为默认缩略图
        title={name}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
        Number of slides: {slidesCount}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  );
}
