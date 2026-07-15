회원가입 없이 기존 계정으로 로그인하고,
게시글 CRUD·검색·카테고리·좋아요·프로필을 제공

```bash
npm install
npm run dev
```

## 백엔드 연결

`.env.example`을 복사하여 `.env`를 만들고 백엔드 주소를 입력

```bash
cp .env.example .env
```

|기능|메서드|경로|
|---|---|---|
|목록 조회|GET|`/api/posts`|
|글 작성|POST|`/api/posts`|
|글 수정|PUT|`/api/posts/:id`|
|글 삭제|DELETE|`/api/posts/:id`|

터미널 API 호출 예시:

```bash
curl http://localhost:8080/api/posts
curl -X POST http://localhost:8080/api/posts -H 'Content-Type: application/json' -d '{"title":"첫 글","content":"안녕하세요","author":"김그린"}'
```
