import axios from 'axios';
const API = process.env.REACT_APP_API || 'http://localhost:5000';

export function setToken(token) { 
  localStorage.setItem('token', token); 
}
export function getToken() { 
  return localStorage.getItem('token'); 
}

export async function register(username, password) {
  return axios.post(`${API}/api/auth/register`, { username, password });
}
export async function login(username, password) {
  return axios.post(`${API}/api/auth/login`, { username, password });
}

export async function trackEvent(type, details) {
  const existing = JSON.parse(localStorage.getItem('clickstream') || '[]');
  existing.push({
    type,
    details,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('clickstream', JSON.stringify(existing));
  return { ok: true };
}

export async function getEvents() {
  const events = JSON.parse(localStorage.getItem('clickstream') || '[]');
  return { data: events };
}

export async function clearEvents() {
  localStorage.removeItem('clickstream');
  return { ok: true };
}
