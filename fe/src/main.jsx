import React, { Component, StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || window.location.origin;
const samplePosts = [
  {
    id: 'sample-post',
    title: 'FairPlay 게시판에 오신 것을 환영합니다',
    content: '프로젝트 진행 상황, 질문, 결과물을 자유롭게 공유해 보세요. 백엔드가 연결되면 실제 게시글 목록으로 자동 전환됩니다.',
    category: '공지',
    author: 'FairPlay',
    createdAt: new Date().toISOString(),
    imageUrl: '',
  },
];
async function request(path, options = {}) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || errorBody?.error || `요청 처리에 실패했습니다. (HTTP ${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}
const normalizePost = (post) => ({
  ...post,
  author: post.nickname || post.author || '알 수 없음',
  category: post.category || '자유',
  imageUrl: post.imageUrl || '',
  isAnonymous: post.isAnonymous || post.author === '익명',
  likes: post.likes || 0,
});
const api = {
  login: (email) => request('/api/users').then(users => {
    const user = users.find(item => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) throw new Error('등록된 이메일을 찾을 수 없습니다.');
    return user;
  }),
  signup: (data) => request('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: data.email, password: data.password, nickname: data.nickname }),
  }),
  user: (id) => request('/api/users/' + id),
  updateUser: (id, nickname) => request('/api/users/' + id, {
    method: 'PUT',
    body: JSON.stringify({ nickname }),
  }),
  profileVisits: (id) => request(`/api/users/${id}/visits`),
  recordProfileVisit: (id, visitorId) => request(`/api/users/${id}/visits`, {
    method: 'POST',
    body: JSON.stringify({ visitorId }),
  }),
  posts: () => request('/api/posts').then((posts) => posts.map(normalizePost)),
  create: (data) => request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: data.title, content: data.content, userId: data.userId }),
  }),
  update: (id, data) => request('/api/posts/' + id, {
    method: 'PUT',
    body: JSON.stringify({ title: data.title, content: data.content }),
  }),
  remove: (id) => request('/api/posts/' + id, { method: 'DELETE' }),
  comments: (postId) => request(`/api/posts/${postId}/comments`),
  createComment: (postId, data) => request(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content: data.content, userId: data.userId }),
  }),
  updateComment: (commentId, content) => request(`/api/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }),
  removeComment: (commentId) => request(`/api/comments/${commentId}`, { method: 'DELETE' }),
};
const categories = ['전체', '공지', '질문', '자유'];
const date = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function Login({ onLogin, onSignup, error, initialEmail }) {
  const [email, setEmail] = useState(initialEmail || ''); const [password, setPassword] = useState('');
  return <main className="login"><section className="login-card"><div className="mark">🌱</div><h1>로그인</h1><p className="muted">등록된 계정으로 로그인해 주세요.</p><form onSubmit={e => { e.preventDefault(); onLogin(email, password); }}><label>이메일<input type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder="가입한 이메일을 입력해 주세요" /></label><label>비밀번호<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label><button className="primary">로그인</button><button type="button" className="text-button" onClick={onSignup}>회원가입</button></form>{error && <p className="error">{error}</p>}</section></main>;
}
function Signup({ onCancel, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const change = key => e => setForm({ ...form, [key]: e.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    try {
      setError('');
      setSubmitting(true);
      const userId = await api.signup(form);
      onSuccess({ userId, email: form.email });
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };
  return <main className="login"><section className="login-card"><div className="mark">🌿</div><h1>회원가입</h1><p className="muted">게시글과 댓글을 작성할 계정을 만들어 주세요.</p><form onSubmit={submit}><label>이메일<input type="text" value={form.email} onChange={change('email')} required placeholder="이메일을 입력해 주세요" /></label><label>비밀번호<input type="password" value={form.password} onChange={change('password')} required placeholder="비밀번호를 입력해 주세요" /></label><label>닉네임<input value={form.nickname} onChange={change('nickname')} required maxLength="50" placeholder="사용할 닉네임을 입력해 주세요" /></label>{error && <p className="error">{error}</p>}<button className="primary" disabled={submitting}>{submitting ? '가입 중...' : '가입하기'}</button><button type="button" className="text-button" onClick={onCancel}>로그인으로 돌아가기</button></form></section></main>;
}
function Card({ post, open }) { return <article className="card" onClick={open}>{post.imageUrl && <img className="card-image" src={post.imageUrl} alt="" />}<span className="badge">{post.category}</span><h3>{post.title}</h3><p>{post.content}</p><footer><span>{post.author}</span><span>♥ {post.likes}</span><span>{date(post.createdAt)}</span></footer></article>; }

function App() {
  const [user, setUser] = useState(null), [posts, setPosts] = useState([]), [view, setView] = useState('home');
  const [profileUserId, setProfileUserId] = useState(null);
  const [authView, setAuthView] = useState('login'), [registeredEmail, setRegisteredEmail] = useState('');
  const [selected, setSelected] = useState(null), [editing, setEditing] = useState(null), [query, setQuery] = useState(''), [category, setCategory] = useState('전체'), [message, setMessage] = useState('');
  const notice = (text) => { setMessage(text); setTimeout(() => setMessage(''), 2500); };
  const load = async () => { try { setPosts(await api.posts()); } catch (e) { notice(e.message); } };
  useEffect(() => { if (user) load(); }, [user]);
  const boardPosts = posts.length ? posts : samplePosts;
  const visible = useMemo(() => boardPosts.filter(p => (category === '전체' || p.category === category) && (p.title + p.content).toLowerCase().includes(query.toLowerCase())), [boardPosts, query, category]);
  const login = async (email, password) => { try { const loginUser = await api.login(email, password); setUser({ id: loginUser.id, name: loginUser.nickname, email: loginUser.email }); } catch (e) { notice(e.message); } };
  const write = (post = null) => { setEditing(post); setView('editor'); };
  const savePost = async (form) => { try { editing ? await api.update(editing.id, form) : await api.create({ ...form, userId: user.id }); await load(); setView('home'); notice(editing ? '게시글을 수정했어요.' : '새 게시글을 등록했어요.'); } catch (e) { notice(e.message); } };
  const deletePost = async (post) => { if (String(post.id).startsWith('sample-')) { setView('home'); return; } if (!confirm('이 게시글을 삭제할까요?')) return; try { await api.remove(post.id); await load(); setView('home'); notice('게시글을 삭제했어요.'); } catch(e) { notice(e.message); } };
  const likePost = async () => {};
  if (!user && authView === 'signup') return <Signup onCancel={() => setAuthView('login')} onSuccess={({ email }) => { setRegisteredEmail(email); setAuthView('login'); }} />;
  if (!user) return <Login key={registeredEmail || 'login'} onLogin={login} onSignup={() => setAuthView('signup')} error={message} initialEmail={registeredEmail} />;
  return <main><header><button className="logo" onClick={() => setView('home')}>🌿 FairPlay</button><nav><button onClick={() => setView('home')}>게시판</button><button onClick={() => { setProfileUserId(user.id); setView('profile'); }}>내 프로필</button></nav></header>{view !== 'profile' && <section className="hero"><div className="hero-copy"><p className="eyebrow">GROW TOGETHER</p><h1>프로젝트 결과를 공유하고<br />자유롭게 소통해 보세요</h1><p>작은 아이디어가 더 좋은 내일을 만듭니다.</p></div><div className="hero-panel"><span>오늘의 보드</span><strong>{boardPosts.length}</strong><p>공유된 프로젝트 이야기</p></div></section>}
    {view === 'home' && <section className="content"><div className="toolbar"><div><p className="section-label">COMMUNITY</p></div><div className="toolbar-actions"><button className="primary" onClick={() => write()}>+ 글쓰기</button></div></div><div className="filters"><input placeholder="제목 또는 내용 검색" value={query} onChange={e => setQuery(e.target.value)} />{categories.map(c => <button key={c} className={'chip ' + (category === c ? 'active' : '')} onClick={() => setCategory(c)}>{c}</button>)}</div>{visible.length ? <div className="grid">{visible.map(p => <Card key={p.id} post={p} open={() => { setSelected(p); setView('detail'); }} />)}</div> : <div className="empty">검색 결과가 없습니다.<br />첫 번째 이야기를 남겨 보세요.</div>}</section>}
    {view === 'detail' && selected && <section className="content detail"><button className="back" onClick={() => setView('home')}>← 목록으로</button><article><div className="row"><span className="badge">{selected.category}</span><span><button onClick={() => write(selected)}>수정</button><button className="danger" onClick={() => deletePost(selected)}>삭제</button></span></div>{selected.imageUrl && <img className="detail-image" src={selected.imageUrl} alt="" />}<h2>{selected.title}</h2><p className="muted"><button className="author-link" onClick={() => { setProfileUserId(selected.userId); setView('profile'); }}>{selected.author}</button> · {date(selected.createdAt)}</p><p className="body">{selected.content}</p><button className="like" onClick={() => likePost(selected)}>♡ 공감 {selected.likes}</button></article><Comments postId={selected.id} user={user} notice={notice} /></section>}
    {view === 'editor' && <Editor post={editing} cancel={() => setView(editing ? 'detail' : 'home')} save={savePost} />}
    {view === 'profile' && <Profile key={profileUserId || user.id} user={user} profileId={profileUserId || user.id} posts={posts} notice={notice} onUserChange={nextUser => setUser({ ...user, ...nextUser })} openPost={post => { setSelected(post); setView('detail'); }} />}
    {message && <div className="toast">{message}</div>}
  </main>;
}
function Profile({ user, profileId, posts, notice, onUserChange, openPost }) {
  const isOwner = Number(profileId) === Number(user.id);
  const storageKey = `profile-settings-${profileId}`;
  const initialSettings = { bio: '', interests: '', location: '', link: '', theme: 'forest', ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
  const [profile, setProfile] = useState({ id: profileId, email: '', nickname: isOwner ? String(user.name) : '', createdAt: '', updatedAt: '' });
  const [form, setForm] = useState({ nickname: String(user.name), ...initialSettings });
  const [settings, setSettings] = useState(initialSettings);
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`profile-avatar-${profileId}`) || '');
  const [myComments, setMyComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const themes = { forest: 'linear-gradient(135deg, #153f44, #337879 62%, #91aa61)', ocean: 'linear-gradient(135deg, #12324a, #28769a 62%, #72b5b1)', sunset: 'linear-gradient(135deg, #593c55, #b05f65 62%, #e7a866)', lavender: 'linear-gradient(135deg, #403b66, #7169a7 62%, #b49ed8)' };
  const myPosts = posts.filter(post => Number(post.userId) === Number(profileId));
  const receivedLikes = myPosts.reduce((total, post) => total + Number(post.likes || 0), 0);

  useEffect(() => {
    api.user(profileId).then(data => { setProfile(data); setForm(current => ({ ...current, nickname: data.nickname })); if (isOwner) onUserChange({ name: data.nickname }); }).catch(e => notice(e.message));
    const visitRequest = isOwner ? Promise.resolve() : api.recordProfileVisit(profileId, user.id);
    visitRequest.then(() => api.profileVisits(profileId)).then(result => setVisitors(Number(result?.count ?? result ?? 0))).catch(() => setVisitors(0));
    const realPosts = posts.filter(post => !String(post.id).startsWith('sample-'));
    Promise.all(realPosts.map(post => api.comments(post.id).catch(() => []))).then(groups => setMyComments(groups.flat().filter(comment => Number(comment.userId) === Number(profileId))));
  }, [profileId, posts.length]);

  const change = key => event => setForm({ ...form, [key]: event.target.value });
  const saveProfile = async event => {
    event.preventDefault();
    if (!isOwner) { notice('다른 사용자의 프로필은 수정할 수 없습니다.'); return; }
    const nickname = form.nickname.trim();
    if (!nickname || saving) return;
    try {
      setSaving(true);
      await api.updateUser(profileId, nickname);
      const nextSettings = { bio: form.bio.trim(), interests: form.interests.trim(), location: form.location.trim(), link: form.link.trim(), theme: form.theme };
      localStorage.setItem(storageKey, JSON.stringify(nextSettings));
      setSettings(nextSettings);
      setProfile({ ...profile, nickname });
      onUserChange({ name: nickname });
      setEditing(false);
      notice('프로필을 저장했어요.');
    } catch (e) { notice(e.message); }
    finally { setSaving(false); }
  };

  const changeAvatar = event => {
    if (!isOwner) { notice('다른 사용자의 프로필 사진은 변경할 수 없습니다.'); return; }
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { notice('이미지 파일만 선택해 주세요.'); return; }
    const reader = new FileReader();
    reader.onload = () => { const value = String(reader.result); setAvatar(value); localStorage.setItem(`profile-avatar-${profileId}`, value); notice('프로필 사진을 변경했어요.'); };
    reader.readAsDataURL(file);
  };

  return <section className="profile-page"><div className="profile-cover" style={{ background: themes[settings.theme] }}><div className="profile-avatar">{avatar ? <img src={avatar} alt="프로필" /> : <span>{String(profile.nickname || user.name || '?').slice(0, 1)}</span>}<label className="avatar-button">사진 변경<input type="file" accept="image/*" onChange={changeAvatar} /></label></div><div className="profile-identity"><p className="eyebrow">MY PROFILE</p><h1>{profile.nickname || user.name}</h1><p>{settings.bio || profile.email || '나만의 소개를 작성해 보세요.'}</p><div className="profile-tags">{settings.location && <span>📍 {settings.location}</span>}{settings.interests && <span>✨ {settings.interests}</span>}{settings.link && <a href={settings.link} target="_blank" rel="noreferrer">🔗 링크</a>}</div><button className="profile-edit-button" onClick={() => setEditing(true)}>회원정보 · 프로필 꾸미기</button></div></div>{editing && <form className="profile-settings" onSubmit={saveProfile}><div className="profile-settings-head"><div><p className="eyebrow">EDIT PROFILE</p><h2>회원정보와 프로필 꾸미기</h2></div><button type="button" onClick={() => setEditing(false)}>✕ 닫기</button></div><div className="account-details"><div><span>회원 ID</span><strong>{profile.id}</strong></div><div><span>이메일</span><strong>{profile.email || '-'}</strong></div><div><span>가입일</span><strong>{profile.createdAt ? date(profile.createdAt) : '-'}</strong></div><div><span>최근 수정</span><strong>{profile.updatedAt ? date(profile.updatedAt) : '-'}</strong></div></div><div className="profile-fields"><label>닉네임<input value={form.nickname} onChange={change('nickname')} required maxLength="50" /></label><label>한 줄 소개<input value={form.bio} onChange={change('bio')} maxLength="80" placeholder="나를 소개하는 문장을 적어 주세요" /></label><label>관심 분야<input value={form.interests} onChange={change('interests')} maxLength="60" placeholder="예: React, 디자인, 알고리즘" /></label><label>위치<input value={form.location} onChange={change('location')} maxLength="40" placeholder="예: 부산" /></label><label className="wide">개인 링크<input type="url" value={form.link} onChange={change('link')} placeholder="https://..." /></label><fieldset className="wide"><legend>프로필 테마</legend><div className="theme-options">{Object.entries(themes).map(([key, background]) => <label key={key} className={form.theme === key ? 'selected' : ''} style={{ background }}><input type="radio" name="theme" value={key} checked={form.theme === key} onChange={change('theme')} /><span>{key}</span></label>)}</div></fieldset></div><div className="profile-settings-actions"><button type="button" onClick={() => setEditing(false)}>취소</button><button className="primary" disabled={saving}>{saving ? '저장 중...' : '변경사항 저장'}</button></div></form>}<div className="profile-stats"><div><strong>{myPosts.length}</strong><span>내가 쓴 게시물</span></div><div><strong>{receivedLikes}</strong><span>받은 좋아요</span></div><div><strong>{myComments.length}</strong><span>내가 쓴 댓글</span></div><div><strong>{visitors}</strong><span>프로필 방문</span></div></div><div className="profile-grid"><section><h2>내가 쓴 게시물</h2>{myPosts.length ? myPosts.map(post => <button className="profile-activity" key={post.id} onClick={() => openPost(post)}><strong>{post.title}</strong><span>{date(post.createdAt)}</span><p>{post.content}</p></button>) : <p className="profile-empty">아직 작성한 게시물이 없습니다.</p>}</section><section><h2>내가 쓴 댓글</h2>{myComments.length ? myComments.map(comment => <div className="profile-activity" key={comment.id}><strong>{comment.nickname || profile.nickname}</strong><span>{date(comment.createdAt)}</span><p>{comment.content}</p></div>) : <p className="profile-empty">아직 작성한 댓글이 없습니다.</p>}</section></div></section>;
}
function Comments({ postId, user, notice }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isSample = String(postId).startsWith('sample-');

  const loadComments = async () => {
    if (isSample) { setComments([]); setLoading(false); return; }
    try { setComments(await api.comments(postId)); }
    catch (e) { notice(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { setLoading(true); loadComments(); }, [postId]);

  const submit = async (event) => {
    event.preventDefault();
    const value = content.trim();
    if (!value || submitting) return;
    if (isSample) { notice('샘플 게시글에는 댓글을 작성할 수 없습니다.'); return; }
    try {
      setSubmitting(true);
      await api.createComment(postId, { content: value, userId: user.id });
      setContent('');
      await loadComments();
      notice('댓글을 등록했어요.');
    } catch (e) { notice(e.message); }
    finally { setSubmitting(false); }
  };

  const saveEdit = async (commentId) => {
    const value = editingContent.trim();
    if (!value) return;
    try {
      await api.updateComment(commentId, value);
      setEditingId(null);
      await loadComments();
      notice('댓글을 수정했어요.');
    } catch (e) { notice(e.message); }
  };

  const remove = async (commentId) => {
    if (!confirm('이 댓글을 삭제할까요?')) return;
    try {
      await api.removeComment(commentId);
      await loadComments();
      notice('댓글을 삭제했어요.');
    } catch (e) { notice(e.message); }
  };

  return <section className="comments"><div className="comments-heading"><h3>댓글</h3><span>{comments.length}</span></div><form className="comment-form" onSubmit={submit}><textarea value={content} onChange={e => setContent(e.target.value)} maxLength="500" required placeholder="댓글을 입력해 주세요" /><div><span>{content.length}/500</span><button className="primary" disabled={submitting}>{submitting ? '등록 중...' : '댓글 등록'}</button></div></form>{loading ? <p className="comment-state">댓글을 불러오는 중...</p> : comments.length === 0 ? <p className="comment-state">첫 번째 댓글을 남겨 보세요.</p> : <div className="comment-list">{comments.map(comment => <article className="comment" key={comment.id}><div className="comment-meta"><strong>{comment.nickname || '알 수 없음'}</strong><span>{date(comment.createdAt)}</span>{Number(comment.userId) === Number(user.id) && <span className="comment-actions"><button onClick={() => { setEditingId(comment.id); setEditingContent(comment.content); }}>수정</button><button className="danger" onClick={() => remove(comment.id)}>삭제</button></span>}</div>{editingId === comment.id ? <div className="comment-edit"><textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} maxLength="500" /><div><button onClick={() => setEditingId(null)}>취소</button><button className="primary" onClick={() => saveEdit(comment.id)}>저장</button></div></div> : <p>{comment.content}</p>}</article>)}</div>}</section>;
}
function Editor({ post, cancel, save }) {
  const [form, setForm] = useState({ title: post?.title || '', content: post?.content || '', category: post?.category || '자유', image: null, previewUrl: post?.imageUrl || '', isAnonymous: post?.isAnonymous || post?.author === '익명' });
  const change = key => e => setForm({ ...form, [key]: e.target.value });
  const changeImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file, previewUrl: URL.createObjectURL(file) });
  };
  return <section className="content editor"><div className="toolbar"><div><h2>{post ? '게시글 수정' : '새 게시글 작성'}</h2></div></div><form onSubmit={e => { e.preventDefault(); save(form); }}><label>카테고리<select value={form.category} onChange={change('category')}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label>{!post && <label className="anonymous-check"><input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({ ...form, isAnonymous: e.target.checked })} />익명으로 작성</label>}<label>제목<input value={form.title} onChange={change('title')} maxLength="80" required placeholder="제목을 입력해 주세요" /></label><label>이미지 첨부<input type="file" accept="image/*" onChange={changeImage} /></label>{form.previewUrl && <div className="image-preview"><img src={form.previewUrl} alt="첨부 이미지 미리보기" /><button type="button" onClick={() => setForm({ ...form, image: null, previewUrl: '' })}>이미지 삭제</button></div>}<label>내용<textarea value={form.content} onChange={change('content')} required maxLength="1000" placeholder="내용을 입력해 주세요" /></label><div className="actions"><button type="button" onClick={cancel}>취소</button><button className="primary">등록하기</button></div></form></section>;
}
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <main className="login"><section className="login-card"><div className="mark">⚠️</div><h1>화면을 불러오지 못했어요.</h1><p className="error">{this.state.error.message}</p></section></main>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>);
