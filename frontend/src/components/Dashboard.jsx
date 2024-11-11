import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [presentations, setPresentations] = useState([]);
    const [presentationName, setPresentationName] = useState('');
  
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleCreatePresentation = () => {
      if (presentationName.trim() === '') return;
  
      // 创建新的演示对象并将其添加到presentations列表
      const newPresentation = {
        name: presentationName,
        slides: [{}] // 默认情况下只有一个空白幻灯片
      };
      setPresentations([...presentations, newPresentation]);
      setPresentationName('');
      handleClose();
    };
  
    return (
      <div style={{ marginTop: '5rem' }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          New Presentation
        </Button>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create New Presentation
            </Typography>
            <TextField
              fullWidth
              label="Presentation Name"
              variant="outlined"
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePresentation}
              sx={{ mt: 2 }}
              fullWidth
            >
              Create
            </Button>
          </Box>
        </Modal>
  
        {/* 显示已创建的演示 */}
        <Box mt={4}>
          {presentations.map((presentation, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{presentation.name}</Typography>
                <Typography variant="body2">Slides: {presentation.slides.length}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </div>
    );
  };
  
  export default Dashboard;