import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <main className="app">
        <section className="login-card">
          <span className="mark">🌱</span>
          <h1>로그인 완료</h1>
          <p>{id}님, FairPlay에 오신 것을 환영합니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault();
          setLoggedIn(true);
        }}
      >
        <span className="mark">🌱</span>
        <h1>로그인</h1>
        <p>등록된 계정으로 로그인해 주세요.</p>
        <label>
          아이디
          <input value={id} onChange={(event) => setId(event.target.value)} />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">로그인</button>
      </form>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
