import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: '첫 번째 프로젝트 결과', content: '프로젝트 결과를 공유합니다.' },
  ]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const submitPost = (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setPosts(posts.map((post) => (post.id === editingId ? { ...post, title, content } : post)));
      setEditingId(null);
    } else {
      setPosts([{ id: Date.now(), title, content }, ...posts]);
    }
    setTitle('');
    setContent('');
  };

  const editPost = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  return (
    <main className="app">
      <section className="board">
        <header className="board-header">
          <div>
            <p>FAIRPLAY</p>
            <h1>게시판</h1>
          </div>
          <span>{posts.length}개의 글</span>
        </header>

        <form className="post-form" onSubmit={submitPost}>
          <input placeholder="제목" value={title} onChange={(event) => setTitle(event.target.value)} />
          <textarea placeholder="프로젝트 결과를 공유해 보세요" value={content} onChange={(event) => setContent(event.target.value)} />
          <button type="submit">{editingId ? '수정 완료' : '글 등록'}</button>
        </form>

        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <div>
                <button onClick={() => editPost(post)}>수정</button>
                <button onClick={() => setPosts(posts.filter((item) => item.id !== post.id))}>삭제</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
