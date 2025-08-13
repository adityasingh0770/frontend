import React, { useState } from 'react';
import { login, register, setToken } from './api';

export default function LoginRegister({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login(username, password);
        setToken(res.data.token);
        onLogin();
      } else {
        await register(username, password);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={submit}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required /><br/>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "No account?" : "Have account?"}
        <button onClick={()=>setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</button>
      </p>
    </div>
  );
}
