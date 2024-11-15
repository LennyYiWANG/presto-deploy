import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import logo from '../assets/images/logo_transparent.png';
import background from '../assets/images/background.png'; 

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <Container
        maxWidth="md"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
        sx={{
          '@media (max-width: 400px)': {
            padding: '20px',         
            borderRadius: '10px',   
          },
        }}
      >
        <Box mb={3}>
          <img
            src={logo}
            alt="Presto Logo"
            style={{ width: '120px' }}
            
          />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            '@media (max-width: 400px)': {
              fontSize: '1.8rem',   
            },
          }}
        >
          Welcome to Presto
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          sx={{
            '@media (max-width: 400px)': {
              fontSize: '1rem',   
            },
          }}
        >
          Present with ease.
        </Typography>
        <Box
          mt={4}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },   
            gap: 2,                                       
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
            onClick={() => navigate('/login')}
            fullWidth    
          >
            Login
          </Button>
          <Button
            variant="outlined"
            style={{ borderColor: '#1976d2', color: '#1976d2' }}
            onClick={() => navigate('/register')}
            fullWidth    
          >
            Register
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default WelcomePage;
