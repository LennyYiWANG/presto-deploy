import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import logo from '../assets/images/logo_transparent.png';
import background from '../assets/images/background.png'; // 引入背景图片

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${background})`, // 设置背景图片
        backgroundSize: 'cover',               // 背景覆盖整个页面
        backgroundPosition: 'center',          // 背景居中
        backgroundRepeat: 'no-repeat',         // 背景不重复
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',                         // 设置文本为白色以增强可读性
      }}
    >
      <Container
        maxWidth="md"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明黑色背景以提高内容对比度
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // 轻微阴影效果
          textAlign: 'center',
        }}
      >
        <Box mb={3}>
          <img src={logo} alt="Presto Logo" style={{ width: '120px' }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Presto
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Present with ease.
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            style={{ marginRight: '10px', backgroundColor: '#1976d2', color: '#ffffff' }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            style={{ borderColor: '#1976d2', color: '#1976d2' }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default WelcomePage;
