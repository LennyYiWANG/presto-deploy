import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link} from 'react-router-dom';

const Dashboard = (props) => {
    useEffect(() => {
      console.log('Dashboard component is rendered');
    }, []);
    
    return (
      <div style={{ marginTop: '5rem' }}> {/* 确保此值与 Logout 组件的高度一致 */}
        <h1>Dashboard</h1>
      </div>
    );
  };
  
  export default Dashboard;