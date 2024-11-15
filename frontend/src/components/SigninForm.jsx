import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import logo from '../assets/images/logo_transparent.png'; // 确保路径正确

const SignInForm = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      //console.log('Response:', response);
      if (response.ok) {
        const data = await response.json();
        // console.log('Data:', data);
        const token = data.token; // 从响应中获取 `token`
        localStorage.setItem('token', token); // 将 `token` 存储在本地存储中     
        setSeverity('success');
        setSnackbarMessage('Login successful! Redirecting...');
        setOpenSnackbar(true);
        setTimeout(() => {
          setToken(token); // 延迟设置 token
          navigate('/dashboard');
        }, 1500); 
      } else if (response.status === 400) {
        setSeverity('error');
        setSnackbarMessage('Invalid input. Please check your email and password.');
        setOpenSnackbar(true);
      } else {
        setSeverity('error');
        setSnackbarMessage('An error occurred. Please try again.');
        setOpenSnackbar(true);
      }
    } catch (error) {

      console.error('Error during login:', error);

      setSeverity('error');
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Logo in the top left corner */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: '80px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </Box>

      {/* Sign Up Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/register')}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Sign Up
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <Typography variant="h5" component="h1" mb={2}>
            Welcome back!
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Let's get you signed in
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Log in
            </Button>
          </Box>

          {/* Additional links */}
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Forgot your password? <Button size="small">Contact support</Button>
            </Typography>
          </Box>

          {/* Snackbar for showing messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInForm;
