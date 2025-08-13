import React, { useState } from 'react';
import LoginRegister from './LoginRegister';
import LearningPage from './LearningPage';
import { getToken } from './api';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());
  const logout = ()=> { localStorage.removeItem('token'); setLoggedIn(false); };
  return loggedIn ? <LearningPage onLogout={logout} /> : <LoginRegister onLogin={()=>setLoggedIn(true)} />;
}
