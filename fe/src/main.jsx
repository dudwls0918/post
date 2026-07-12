import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <section className="profile">
        <div className="profile-top">
          <div className="avatar">김</div>
          <div>
            <p className="eyebrow">MY PROFILE</p>
            <h1>김그린</h1>
            <p className="email">green@example.com</p>
            <p>프론트엔드 개발자 지망생</p>
          </div>
          <div className="stat">
            <strong>3</strong>
            <span>작성한 글</span>
          </div>
        </div>

        <section className="my-posts">
          <h2>내가 쓴 글</h2>
          <article>
            <span>공지</span>
            <h3>캡스톤 프로젝트를 시작했습니다</h3>
            <p>프로젝트 진행 상황을 공유합니다.</p>
          </article>
          <article>
            <span>자유</span>
            <h3>프론트엔드 화면 작업 기록</h3>
            <p>연한 녹색 콘셉트로 게시판 화면을 구현했습니다.</p>
          </article>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
