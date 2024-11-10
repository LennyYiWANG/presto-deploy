import React, { useState, useEffect } from 'react';
import { useNavigate, Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import logo from '../assets/images/logo_transparent.png'; 

const Logout = ({ token, setToken }) => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      setToken(null);
      localStorage.removeItem('token');
      navigate('/'); // 导航到welcome页面
    };
  
    return (
        <Box sx={{ position: 'fixed', top: 0, right: 0, padding: 2, zIndex: 1000 }}>
          {token !== null ? ( // 仅当 token 存在时显示按钮
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          ) : null}
        </Box>
      );
    };
  
  export default Logout;
