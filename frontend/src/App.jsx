import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import SignInForm from './components/SigninForm';
import SignUpForm from './components/SignupForm';
import WelcomePage from './components/WelcomePage';
import Logout from './components/Logout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // 检查 localStorage 中的 token 并更新状态
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);
  
  return (
    <>
    <BrowserRouter>
    {/* <Logout/> */}
    <Logout token={token} setToken={setToken} />
    <Routes>
      <Route path="/" element={<WelcomePage/>}></Route>
      <Route path="/login" element={<SignInForm/>}></Route>
      <Route path="/register" element={<SignUpForm/>}></Route>
      {/* <Route path="/dashboard" element={<div>Dashboard Page</div>} /> */}
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
