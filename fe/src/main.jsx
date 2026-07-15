import React, { Component, StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const KEY = 'green-board-posts';
const seed = [
  { id: 1, title: '캡스톤 게시판 프로젝트를 시작했습니다!', content: '사용하기 편한 게시판을 만드는 것이 목표입니다. 의견을 자유롭게 남겨 주세요.', category: '공지', author: '김그린', authorId: 1, createdAt: '2026-07-12T09:00:00.000Z', likes: 12 },
];
const localPosts = () => {
  const posts = JSON.parse(localStorage.getItem(KEY) || JSON.stringify(seed));
  const keptPosts = posts.filter((post) => post.author !== '이새싹');
  if (keptPosts.length !== posts.length) localStorage.setItem(KEY, JSON.stringify(keptPosts));
  return keptPosts;
};
const save = (posts) => localStorage.setItem(KEY, JSON.stringify(posts));
async function request(path, options = {}) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(`요청 처리에 실패했습니다. (HTTP ${res.status})`);
  return res.status === 204 ? null : res.json();
}
const normalizePost = (post) => ({
  ...post,
  category: post.category || '자유',
  likes: post.likes || 0,
});
const api = {
  login: (email) => Promise.resolve({ user: { id: 1, name: '김그린', email, bio: '프론트엔드 개발자 지망생' } }),
  posts: () => API
    ? request('/api/posts').then((posts) => posts.map(normalizePost))
    : Promise.resolve(localPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),
  create: (data) => API
    ? request('/api/posts', { method: 'POST', body: JSON.stringify({ title: data.title, content: data.content, author: data.author }) })
    : Promise.resolve().then(() => { const post = { ...data, id: Date.now(), likes: 0, createdAt: new Date().toISOString() }; save([post, ...localPosts()]); return post; }),
  update: (id, data) => API
    ? request('/api/posts/' + id, { method: 'PUT', body: JSON.stringify({ title: data.title, content: data.content }) })
    : Promise.resolve().then(() => { const posts = localPosts().map(p => p.id === id ? { ...p, ...data } : p); save(posts); return posts.find(p => p.id === id); }),
  remove: (id) => API ? request('/api/posts/' + id, { method: 'DELETE' }) : Promise.resolve().then(() => save(localPosts().filter(p => p.id !== id))),
  like: (id) => Promise.resolve().then(() => save(localPosts().map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))),
};
const categories = ['전체', '공지', '질문', '자유'];
const date = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function Login({ onLogin, error }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return <main className="login"><section className="login-card"><div className="mark">🌱</div><h1>로그인</h1><p className="muted">등록된 계정으로 로그인해 주세요.</p><form onSubmit={e => { e.preventDefault(); onLogin(email, password); }}><label>아이디<input type="text" value={email} onChange={e => setEmail(e.target.value)} /></label><label>비밀번호<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary">로그인</button></form>{error && <p className="error">{error}</p>}</section></main>;
}
function Card({ post, open }) { return <article className="card" onClick={open}><span className="badge">{post.category}</span><h3>{post.title}</h3><p>{post.content}</p><footer><span>{post.author}</span><span>♥ {post.likes}</span><span>{date(post.createdAt)}</span></footer></article>; }

function App() {
  const [user, setUser] = useState(null), [posts, setPosts] = useState([]), [view, setView] = useState('home');
  const [selected, setSelected] = useState(null), [editing, setEditing] = useState(null), [query, setQuery] = useState(''), [category, setCategory] = useState('전체'), [message, setMessage] = useState('');
  const notice = (text) => { setMessage(text); setTimeout(() => setMessage(''), 2500); };
  const load = async () => { try { setPosts(await api.posts()); } catch (e) { notice(e.message); } };
  useEffect(() => { if (user) load(); }, [user]);
  const visible = useMemo(() => posts.filter(p => (category === '전체' || p.category === category) && (p.title + p.content).toLowerCase().includes(query.toLowerCase())), [posts, query, category]);
  const login = async (email, password) => { try { const result = await api.login(email, password); setUser({ id: 1, name: '김그린', bio: '프론트엔드 개발자 지망생', ...result.user }); } catch (e) { notice(e.message); } };
  const write = (post = null) => { setEditing(post); setView('editor'); };
  const savePost = async (form) => { try { editing ? await api.update(editing.id, form) : await api.create({ ...form, author: user.name }); await load(); setView('home'); notice(editing ? '게시글을 수정했어요.' : '새 게시글을 등록했어요.'); } catch (e) { notice(e.message); } };
  const deletePost = async (post) => { if (!confirm('이 게시글을 삭제할까요?')) return; try { await api.remove(post.id); await load(); setView('home'); notice('게시글을 삭제했어요.'); } catch(e) { notice(e.message); } };
  const like = async (post) => { if (API) { notice('좋아요 API는 백엔드 구현 전입니다.'); return; } try { await api.like(post.id); await load(); if (selected?.id === post.id) setSelected({ ...post, likes: post.likes + 1 }); } catch(e) { notice(e.message); } };
  if (!user) return <Login onLogin={login} error={message} />;
  const mine = posts.filter(p => p.author === user.name);
  return <main><header><button className="logo" onClick={() => setView('home')}>🌿 FairPlay</button><nav><button onClick={() => setView('home')}>게시판</button><button onClick={() => setView('profile')}>내 프로필</button><button className="avatar" onClick={() => setView('profile')}>{user.name[0]}</button></nav></header><section className="hero"><p className="eyebrow">GROW TOGETHER</p><h1>프로젝트 결과를 공유하고<br />자유롭게 소통해 보세요</h1><p>작은 아이디어가 더 좋은 내일을 만듭니다.</p></section>
    {view === 'home' && <section className="content"><div className="toolbar"><div><h2>게시판</h2></div><button className="primary" onClick={() => write()}>+ 글쓰기</button></div><div className="filters"><input placeholder="제목 또는 내용 검색" value={query} onChange={e => setQuery(e.target.value)} />{categories.map(c => <button key={c} className={'chip ' + (category === c ? 'active' : '')} onClick={() => setCategory(c)}>{c}</button>)}</div>{visible.length ? <div className="grid">{visible.map(p => <Card key={p.id} post={p} open={() => { setSelected(p); setView('detail'); }} />)}</div> : <div className="empty">검색 결과가 없습니다.<br />첫 번째 이야기를 남겨 보세요.</div>}</section>}
    {view === 'detail' && selected && <section className="content detail"><button className="back" onClick={() => setView('home')}>← 목록으로</button><article><div className="row"><span className="badge">{selected.category}</span>{selected.author === user.name && <span><button onClick={() => write(selected)}>수정</button><button className="danger" onClick={() => deletePost(selected)}>삭제</button></span>}</div><h2>{selected.title}</h2><p className="muted">{selected.author} · {date(selected.createdAt)}</p><p className="body">{selected.content}</p><button className="like" onClick={() => like(selected)}>♡ 공감 {selected.likes}</button></article></section>}
    {view === 'editor' && <Editor post={editing} cancel={() => setView(editing ? 'detail' : 'home')} save={savePost} />}
    {view === 'profile' && <section className="content"><div className="profile"><div className="profile-avatar">{user.name[0]}</div><div><p className="eyebrow">MY PROFILE</p><h2>{user.name}</h2><p>{user.email}</p><p className="muted">{user.bio}</p></div><div className="stat"><b>{mine.length}</b><span>작성한 글</span></div></div><div className="toolbar"><h2>내가 쓴 글</h2><button className="primary" onClick={() => write()}>+ 글쓰기</button></div>{mine.length ? <div className="grid">{mine.map(p => <Card key={p.id} post={p} open={() => { setSelected(p); setView('detail'); }} />)}</div> : <div className="empty">작성한 게시글이 없습니다.</div>}</section>}
    {message && <div className="toast">{message}</div>}
  </main>;
}
function Editor({ post, cancel, save }) {
  const [form, setForm] = useState({ title: post?.title || '', content: post?.content || '', category: post?.category || '자유' });
  const change = key => e => setForm({ ...form, [key]: e.target.value });
  return <section className="content editor"><div className="toolbar"><div><h2>{post ? '게시글 수정' : '새 게시글 작성'}</h2><p className="muted">따뜻하고 명확한 이야기를 작성해 주세요.</p></div></div><form onSubmit={e => { e.preventDefault(); save(form); }}><label>카테고리<select value={form.category} onChange={change('category')}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label>제목<input value={form.title} onChange={change('title')} maxLength="80" required placeholder="제목을 입력해 주세요" /></label><label>내용<textarea value={form.content} onChange={change('content')} required maxLength="1000" placeholder="내용을 입력해 주세요" /></label><div className="actions"><button type="button" onClick={cancel}>취소</button><button className="primary">등록하기</button></div></form></section>;
}
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <main className="login"><section className="login-card"><div className="mark">⚠️</div><h1>화면을 불러오지 못했어요.</h1><p className="error">{this.state.error.message}</p><p className="hint">이 화면을 캡처해서 전달해 주세요.</p></section></main>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>);
