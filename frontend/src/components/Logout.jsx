import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import logo from '../assets/images/logo_transparent.png'; 

const Logout = ({ token, setToken, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/'); 
  };


  if (!token || location.pathname.includes('/preview')) {
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
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              textAlign: { xs: 'center', sm: 'center' }, 
              color: '#292e70',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Welcome to Presto
          </Typography>

          {/* Right Section (User name and Logout button) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
              variant="body1" 
              sx={{ 
                color: '#292e70', 
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Welcome, {userName || 'User'}!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}
              
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
