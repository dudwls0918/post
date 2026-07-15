import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      setUserName(data.username || id);
      setLoggedIn(true);
    } catch {
      setErrorMessage('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loggedIn) {
    return (
      <main className="app">
        <section className="login-card">
          <span className="mark">🌱</span>
          <h1>로그인 완료</h1>
          <p>{userName}님, FairPlay에 오신 것을 환영합니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <form
        className="login-card"
        onSubmit={handleLogin}
      >
        <span className="mark">🌱</span>
        <h1>로그인</h1>
        <p>등록된 계정으로 로그인해 주세요.</p>
        <label>
          아이디
          <input value={id} onChange={(event) => setId(event.target.value)} required />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
