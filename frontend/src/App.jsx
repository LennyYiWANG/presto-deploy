import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import SignInForm from './components/SigninForm';
import SignUpForm from './components/SignupForm';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignInForm/>}></Route>
      <Route path="/register" element={<SignUpForm/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
