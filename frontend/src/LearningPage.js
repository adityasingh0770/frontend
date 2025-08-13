import videoFile from './new.mp4';
import React, { useEffect, useState } from 'react';
import { trackEvent, getEvents, clearEvents } from './api';

export default function LearningPage({ onLogout }) {
  const [events, setEvents] = useState([]);

  const saveLocalEvent = (type, details) => {
    const existing = JSON.parse(localStorage.getItem('clickstream') || '[]');
    existing.push({ time: new Date().toISOString(), type, details });
    localStorage.setItem('clickstream', JSON.stringify(existing));
  };

  const downloadClickstream = () => {
    const data = localStorage.getItem('clickstream') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clickstream.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    trackEvent('page_view', { page: 'LearningPage' }).catch(() => {});
    saveLocalEvent('page_view', { page: 'LearningPage' });
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch {}
  };

  const onButton = async (name) => {
    await trackEvent('button_click', { name });
    saveLocalEvent('button_click', { name });
    load();
  };

  const onVideo = async (action) => {
    await trackEvent('video', { action });
    saveLocalEvent('video', { action });
    load();
  };

  const onQuiz = async (ans) => {
    await trackEvent('quiz', { question: 'Which Wright brother was the first to fly?', answer: ans });
    saveLocalEvent('quiz', { question: 'Which Wright brother was the first to fly?', answer: ans });
    load();
  };

  const onClear = async () => {
    await clearEvents();
    setEvents([]);
    localStorage.removeItem('clickstream');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#ff4b2b' }}>Learning Page</h1>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={onLogout} style={{ background: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 5 }}>Logout</button>
        <button onClick={downloadClickstream} style={{ marginLeft: 10, background: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 5 }}>
          Download Clickstream Data
        </button>
      </div>

      {/* Lesson Section */}
      <section style={{ background: '#ffffffff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h2>Lesson</h2>
        <p>
          Airplanes are fascinating machines that have revolutionized travel and transportation. The Wright brothers, Orville and Wilbur,
          made history in 1903 with the first successful powered flight. Modern airplanes range from small propeller planes to massive
          commercial jets, connecting the world in ways once thought impossible.
        </p>
      </section>

      {/* Video Section */}
      <section style={{ background: '#d1ecf1', padding: 3, borderRadius: 8, marginBottom: 20 }}>
        <h2>Video</h2>
        <video
          style={{ width: '500px', maxWidth: '100%', display: 'block', margin: '0 auto', borderRadius: 8 }}
          controls
          onPlay={() => onVideo('play')}
          onPause={() => onVideo('pause')}
        >
          <source src={videoFile} type="video/mp4" />
        </video>
      </section>

      {/* Quiz Section */}
      <section style={{ background: '#f8d7da', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h2>Quiz</h2>
        <p>Which Wright brother was the first to fly?</p>
        <button onClick={() => onQuiz('Orville Wright')} style={{ marginRight: 10 }}>Orville Wright</button>
        <button onClick={() => onQuiz('Wilbur Wright')}>Wilbur Wright</button>
      </section>

      {/* Buttons Section */}
<section style={{ background: '#e2e3e5', padding: 15, borderRadius: 8, marginBottom: 20 }}>
  <h2> Buttons</h2>
  <p>Which Situation are you in?</p>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button
      onClick={() => onButton('Takeoff')}
      style={{
        background: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: 8,
        fontSize: '16px',
        flex: 1
      }}
    >
      ✈ Takeoff
    </button>
    <button
      onClick={() => onButton('Landing')}
      style={{
        background: '#28a745',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: 8,
        fontSize: '16px',
        flex: 1
      }}
    >
      🛬 Landing
    </button>
    <button
      onClick={() => onButton('Emergency')}
      style={{
        background: '#dc3545',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: 8,
        fontSize: '16px',
        flex: 1
      }}
    >
      🚨 Emergency
    </button>
  </div>
</section>


      {/* Events Section */}
      <section style={{ background: '#f1f1f1', padding: 15, borderRadius: 8 }}>
        <h2>Your Events</h2>
        <button onClick={onClear} style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: 5, marginBottom: 10 }}>
          Clear
        </button>
        <ul>
          {events.map((e) => (
            <li key={e._id || Math.random()}>
              <strong>{e.type}</strong> — {JSON.stringify(e.details)} — {new Date(e.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
