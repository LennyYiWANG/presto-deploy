import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import SignInForm from './components/SigninForm';
import SignUpForm from './components/SignupForm';
import WelcomePage from './components/WelcomePage';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import PresentationEditor from './components/PresentationEditor';
import PresentationPreview from './components/PresentationPreview';

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
    <Route path="/" element={<WelcomePage />} />
    <Route path="/login" element={<SignInForm setToken={setToken} />} />
    <Route path="/register" element={<SignUpForm setToken={setToken} />} />
    <Route path="/dashboard" element={<Dashboard setToken={setToken} />} />
    <Route path="/editor/:id/:slideIndex" element={<PresentationEditor />} />
    <Route path="/preview/:id/:slideIndex" element={<PresentationPreview />} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
