import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import logo from '../assets/images/logo_transparent.png'; 

const Logout = ({ token, setToken, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/'); // 导航到 welcome 页面
  };

  // 如果 token 为空，则不渲染导航栏
  if (!token) {
    return null;
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#d7e2f1', padding: '0.5rem 0', zIndex: 1000 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: 50, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />

          {/* Middle Section (Title or navigation links) */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: '#292e70' }}>
            Welcome to Presto
          </Typography>

          {/* Right Section (User name and Logout button) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#292e70' }}>
              Welcome, {userName || 'User'}!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Logout;
