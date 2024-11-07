import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Presto</h1>
      <p>这是一个轻量级、现代的幻灯片演示应用。</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')} style={{ marginLeft: '10px' }}>注册</button>
      </div>
    </div>
  );
}

export default WelcomePage;
