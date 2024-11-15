import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import logo from '../assets/images/logo_transparent.png'; // 确保路径正确

const SignUpForm = ({ setToken }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证密码是否匹配
    if (password !== confirmPassword) {
      setSeverity('error');
      setSnackbarMessage('Passwords do not match. Please try again.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('https://z5558797-presto-deploy.vercel.app/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // 从响应中获取 `token`
        localStorage.setItem('token', token); // 将 `token` 存储在本地存储中
        setSeverity('success');
        setSnackbarMessage('Registration successful! Redirecting...');
        setOpenSnackbar(true);
        setTimeout(() => {
          setToken(token); // 延迟设置 token
          navigate('/dashboard');
        }, 1500);
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.error === 'Email address already registered') {
          setSeverity('error');
          setSnackbarMessage('Email address already registered. Please use a different email.');
        } else {
          setSeverity('error');
          setSnackbarMessage('Invalid input. Please check your details and try again.');
        }
        setOpenSnackbar(true);
      } else {
        setSeverity('error');
        setSnackbarMessage('An error occurred. Please try again.');
        setOpenSnackbar(true);
      }
    } catch (_error) {
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

      {/* Login Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/login')}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Login
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
            Create an Account
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
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

export default SignUpForm;
